import { NextResponse } from "next/server";
import { handleErrors, handleGetErrors } from "@/lib/errorHandler";
import { trainingUpdateSchema } from "@/app/api/hr/training/trainingSchema";
import { verifySecretToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import prisma from "@/lib/prisma";
import { formatTrainingData } from "@/app/api/hr/training/trainingSchema";
import { getRequestIP } from "@/lib/GetRequestIp";
import { getLocalNow } from "@/lib/GetLocalNow";

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
              select: {
                employeeFirstname: true,
                employeeLastname: true,
                employeeEmployment: {
                  select: {
                    employmentNumber: true,
                  },
                },
              },
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

export async function PUT(request, context) {
  let ip;
  try {
    ip = getRequestIP(request);

    const params = await context.params;
    const { trainingId } = params;
    if (!trainingId) {
      return NextResponse.json(
        { error: "Training ID is required" },
        { status: 400 }
      );
    }

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const payload = await request.json();

    const parsedData = trainingUpdateSchema.parse({
      trainingId: parseInt(trainingId, 10),
      trainingPreTest: payload.trainingPreTest,
      trainingPostTest: payload.trainingPostTest,
      trainingPictureLink: payload.trainingPictureLink,
      trainingEmployee: payload.trainingEmployee,
    });

    const localNow = getLocalNow();

    // ใช้ค่า trainingPictureLink จาก payload โดยตรง
    const uploadedTrainingPictureLink = parsedData.trainingPictureLink;

    // เริ่ม Transaction เพื่ออัปเดตข้อมูล
    await prisma.$transaction(async (prismaTx) => {
      // อัปเดตข้อมูล Training หลัก
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
          await prismaTx.trainingEmployee.update({
            where: { trainingEmployeeId: emp.trainingEmployeeId },
            data: {
              trainingEmployeeResult: emp.trainingEmployeeResult,
              trainingEmployeeCertificateLink:
                emp.trainingEmployeeCertificateLink || undefined,
            },
          });
        }
      }
    });

    // ดึงข้อมูลที่อัปเดตแล้วมาแสดง
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
        TrainingCreateBy: {
          select: { employeeFirstname: true, employeeLastname: true },
        },
        TrainingUpdateBy: {
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
