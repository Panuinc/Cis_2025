import { NextResponse } from "next/server";
import { handleErrors, handleGetErrors } from "@/lib/errorHandler";
import { trainingPosteSchema } from "@/app/api/hr/training/trainingSchema";
import { verifySecretToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import prisma from "@/lib/prisma";
import { formatTrainingData } from "@/app/api/hr/training/trainingSchema";
import { getRequestIP } from "@/lib/GetRequestIp";
import { getLocalNow } from "@/lib/GetLocalNow";

export async function GET(request) {
  let ip;
  try {
    ip = getRequestIP(request);

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const training = await prisma.training.findMany({
      include: {
        employeeTrainingTraining: true,
        employeeTrainingCheckInTraining: true,
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

export async function POST(request) {
  let ip;
  try {
    ip = getRequestIP(request);

    // ตรวจสอบ Token และ Rate limit
    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    // อ่านข้อมูลจาก FormData
    const formData = await request.formData();
    let dataObj = {};

    for (const [key, value] of formData.entries()) {
      // หากเป็น key ที่เป็น Array ของ Object ต้อง JSON.parse
      if (["trainingEmployee", "trainingEmployeeCheckIn"].includes(key)) {
        dataObj[key] = JSON.parse(value);
      } else {
        dataObj[key] = value;
      }
    }

    // ตรวจสอบความถูกต้องของข้อมูลด้วย Zod
    const parsedData = trainingPosteSchema.parse(dataObj);

    // แยกข้อมูลที่จะสร้างในตารางลูก
    const { trainingEmployee, trainingEmployeeCheckIn, ...trainingData } =
      parsedData;

    // เวลา Local ปัจจุบัน (ถ้ามีฟังก์ชัน getLocalNow)
    const localNow = getLocalNow();

    // ถ้าอยากเขียนฟังก์ชัน processEntries คล้ายในตัวอย่าง ก็ทำได้
    // แต่กรณี create ใหม่ เราไม่จำเป็นต้องแยก "update" กับ "create"
    // จึงสามารถเขียนสั้น ๆ ได้เช่นนี้
    function processEntries(entries, fields) {
      return (entries || []).map((e) =>
        Object.fromEntries(fields.map((field) => [field, e[field]]))
      );
    }

    // ฟิลด์ของ TrainingEmployee
    const trainingEmployeeFields = [
      "trainingEmployeeEmployeeId",
      "trainingEmployeeResult", // ถ้ามี
      "trainingEmployeeCertificateLink", // ถ้ามี
    ];

    // ฟิลด์ของ TrainingEmployeeCheckIn
    const trainingEmployeeCheckInFields = [
      "trainingEmployeeCheckInEmployeeId",
      "trainingEmployeeCheckInTrainingDate",
      "trainingEmployeeCheckInMorningCheck",
      "trainingEmployeeCheckInAfterNoonCheck",
    ];

    // เตรียมข้อมูลสำหรับ create
    const createEmployee = processEntries(
      trainingEmployee,
      trainingEmployeeFields
    );
    const createCheckIn = processEntries(
      trainingEmployeeCheckIn,
      trainingEmployeeCheckInFields
    );

    // สร้าง Training พร้อม Nested create ลงตารางลูก
    const newTraining = await prisma.training.create({
      data: {
        ...trainingData,
        trainingCreateAt: localNow,

        // สร้างผู้เข้าอบรม
        employeeTrainingTraining: {
          create: createEmployee,
        },

        // สร้างข้อมูล Check-in
        employeeTrainingCheckInTraining: {
          create: createCheckIn,
        },
      },
      include: {
        employeeTrainingTraining: true,
        employeeTrainingCheckInTraining: true,
      },
    });

    return NextResponse.json(
      {
        message: "Successfully created new training with employees/check-ins",
        training: newTraining,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleErrors(error, ip, "Error creating training data");
  }
}
