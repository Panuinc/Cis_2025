import { NextResponse } from "next/server";
import { handleErrors, handleGetErrors } from "@/lib/errorHandler";
import { trainingUpdateSchema } from "@/app/api/hr/training/trainingSchema";
import { verifySecretToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import prisma from "@/lib/prisma";
import { formatTrainingData } from "@/app/api/hr/training/trainingSchema";
import { getRequestIP } from "@/lib/GetRequestIp";
import { getLocalNow } from "@/lib/GetLocalNow";
import { SevenHouse } from "@/lib/SevenHouse";
import { writeFile } from "fs/promises";
import path from "path";

export async function GET(request, context) {
  let ip;
  try {
    ip = getRequestIP(request);

    const params = await context.params;
    const trainingId = parseInt(params.trainingId, 10);

    if (!trainingId) {
      return NextResponse.json(
        { error: "Training ID is required" },
        { status: 400 }
      );
    }

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const training = await prisma.training.findMany({
      where: { trainingId: trainingId },
      include: {
        employeeTrainingTraining: {
          include: {
            TrainingEmployeeEmployeeId: {
              select: { employeeFirstname: true, employeeLastname: true },
            },
          },
        },
        employeeTrainingCheckInTraining: {
          include: {
            TrainingEmployeeCheckInEmployeeId: {
              select: { employeeFirstname: true, employeeLastname: true },
            },
          },
        },
        TrainingCreateBy: {
          select: { employeeFirstname: true, employeeLastname: true },
        },
        TrainingUpdateBy: {
          select: { employeeFirstname: true, employeeLastname: true },
        },
      },
    });

    if (!training?.length) {
      return NextResponse.json(
        { error: "No training data found" },
        { status: 404 }
      );
    }

    const formattedTraining = formatTrainingData(training);

    return NextResponse.json(
      {
        message: "Training data retrieved successfully",
        training: formattedTraining,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleGetErrors(error, ip, "Error retrieving training data");
  }
}

async function uploadFile(file, folder, employmentNumber, trainingId) {
  if (!file?.name || file.size === 0) {
    return null;
  }

  const extension = path.extname(file.name).toLowerCase() || ".png";
  const fileName = `${employmentNumber}_${trainingId}_${Date.now()}${extension}`;
  const filePath = path
    .join("public/images", folder, fileName)
    .replace(/\\/g, "/");
  await writeFile(
    path.join(process.cwd(), filePath),
    Buffer.from(await file.arrayBuffer())
  );
  return `/images/${folder}/${fileName}`;
}

export async function PUT(request, context) {
  let ip;
  try {
    ip = getRequestIP(request);

    const params = context.params;
    const { trainingId } = params;
    if (!trainingId) {
      return NextResponse.json(
        { error: "Training ID is required" },
        { status: 400 }
      );
    }

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const formData = await request.formData();
    const dataObj = {};

    for (const [key, value] of formData.entries()) {
      if (
        key === "trainingEmployee" ||
        key === "trainingEmployeeCheckIn" ||
        key === "selectedIds"
      ) {
        dataObj[key] = JSON.parse(value);
      } else {
        dataObj[key] = value;
      }
    }

    // อัพเดตเฉพาะฟิลด์ที่ต้องการ
    const parsedData = trainingUpdateSchema.parse({
      trainingId: parseInt(trainingId, 10),
      trainingPreTest: dataObj.trainingPreTest,
      trainingPostTest: dataObj.trainingPostTest,
      // trainingPictureLink จะจัดการไฟล์ในขั้นตอนถัดไป
      trainingEmployee: dataObj.trainingEmployee, // สมมติว่าเป็น array ของพนักงาน
    });

    const localNow = getLocalNow();

    // อัพโหลดไฟล์ trainingPictureLink หากมีการเปลี่ยนแปลง
    let uploadedTrainingPictureLink = parsedData.trainingPictureLink;
    const trainingPictureFile = formData.get("trainingPictureLink");
    if (trainingPictureFile && trainingPictureFile.size > 0) {
      uploadedTrainingPictureLink = await uploadFile(
        trainingPictureFile,
        "trainingPicture",
        "training", // สามารถปรับตามความเหมาะสม
        trainingId
      );
    }

    // เริ่ม Transaction เพื่ออัพเดตข้อมูล
    await prisma.$transaction(async (prismaTx) => {
      // อัพเดตข้อมูล Training หลัก
      await prismaTx.training.update({
        where: { trainingId: parseInt(trainingId, 10) },
        data: {
          trainingPreTest: parsedData.trainingPreTest,
          trainingPostTest: parsedData.trainingPostTest,
          trainingPictureLink: uploadedTrainingPictureLink || undefined,
          trainingUpdateAt: localNow,
        },
      });

      // จัดการ trainingEmployeeResult และ trainingEmployeeCertificateLink
      if (
        parsedData.trainingEmployee &&
        parsedData.trainingEmployee.length > 0
      ) {
        for (const emp of parsedData.trainingEmployee) {
          let certificateLink = emp.trainingEmployeeCertificateLink;
          const certificateFile = formData.get(
            `trainingEmployeeCertificateLink_${emp.trainingEmployeeId}`
          );
          if (
            emp.trainingEmployeeResult === "Pass" &&
            certificateFile &&
            certificateFile.size > 0
          ) {
            certificateLink = await uploadFile(
              certificateFile,
              "certificate",
              "employee", // สามารถปรับตามต้องการ
              trainingId
            );
          }

          await prismaTx.trainingEmployee.update({
            where: { trainingEmployeeId: emp.trainingEmployeeId },
            data: {
              trainingEmployeeResult: emp.trainingEmployeeResult,
              trainingEmployeeCertificateLink: certificateLink || undefined,
            },
          });
        }
      }
    });

    // ดึงข้อมูลที่อัพเดตแล้วมาแสดง
    const updatedTraining = await prisma.training.findUnique({
      where: { trainingId: parseInt(trainingId, 10) },
      include: {
        employeeTrainingTraining: {
          include: {
            TrainingEmployeeEmployeeId: {
              select: { employeeFirstname: true, employeeLastname: true },
            },
          },
        },
        employeeTrainingCheckInTraining: {
          include: {
            TrainingEmployeeCheckInEmployeeId: {
              select: { employeeFirstname: true, employeeLastname: true },
            },
          },
        },
        TrainingCreateBy: {
          select: { employeeFirstname: true, employeeLastname: true },
        },
        TrainingUpdateBy: {
          select: { employeeFirstname: true, employeeLastname: true },
        },
        TrainingHrApproveBy: {
          select: { employeeFirstname: true, employeeLastname: true },
        },
        TrainingMdApproveBy: {
          select: { employeeFirstname: true, employeeLastname: true },
        },
      },
    });

    const formattedTraining = formatTrainingData([updatedTraining]);

    return NextResponse.json(
      {
        message: "Training data updated successfully",
        training: formattedTraining,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleErrors(error, ip, "Error updating training data");
  }
}
