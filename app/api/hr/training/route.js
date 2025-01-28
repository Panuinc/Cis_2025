// app/api/hr/training/route.js

import { NextResponse } from "next/server";
import { handleErrors, handleGetErrors } from "@/lib/errorHandler";
import { trainingPosteSchema } from "@/app/api/hr/training/trainingSchema"; // Zod schema
import { verifySecretToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import prisma from "@/lib/prisma";
import { formatTrainingData } from "@/app/api/hr/training/trainingSchema";
import { getRequestIP } from "@/lib/GetRequestIp";
import { getLocalNow } from "@/lib/GetLocalNow";

// ======================== GET handler ========================
export async function GET(request) {
  let ip;
  try {
    ip = getRequestIP(request);

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const training = await prisma.training.findMany({
      include: {
        // เอารายการที่อยู่ในตารางลูกมาให้ด้วย
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

// ======================== POST handler ========================
export async function POST(request) {
  let ip;
  try {
    ip = getRequestIP(request);

    // ตรวจสอบ Token และ Rate limit
    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    // 1) อ่านข้อมูลจาก FormData
    const formData = await request.formData();
    let dataObj = {};

    for (const [key, value] of formData.entries()) {
      // หากเป็น key ที่เป็น Array ของ Object ต้อง JSON.parse
      if (key === "trainingEmployee") {
        dataObj[key] = JSON.parse(value);
      } else {
        dataObj[key] = value;
      }
    }

    // 2) ตรวจสอบความถูกต้องของข้อมูลด้วย Zod
    const parsedData = trainingPosteSchema.parse(dataObj);

    // 3) แยกข้อมูล
    const {
      // ดึงค่าที่จำเป็น
      trainingEmployee,
      trainingStartDate, // สำคัญ: ต้องมีการส่งเข้ามา และ schema ก็รองรับ
      ...trainingData
    } = parsedData;

    // เวลา Local ปัจจุบัน
    const localNow = getLocalNow();

    // 4) เตรียมข้อมูลสำหรับตาราง TrainingEmployee
    const createEmployee = (trainingEmployee || []).map((emp) => ({
      // ฟิลด์หลัก
      trainingEmployeeEmployeeId: emp.trainingEmployeeEmployeeId,
      // ถ้ามีฟิลด์อื่น (เช่น trainingEmployeeResult) ให้ใส่เพิ่มได้
    }));

    // 5) เตรียมข้อมูลสำหรับตาราง TrainingEmployeeCheckIn (สร้างอัตโนมัติ)
    const createCheckIn = (trainingEmployee || []).map((emp) => ({
      trainingEmployeeCheckInEmployeeId: emp.trainingEmployeeEmployeeId,
      trainingEmployeeCheckInTrainingDate: trainingStartDate
        ? new Date(trainingStartDate)
        : null,
      trainingEmployeeCheckInMorningCheck: null,
      trainingEmployeeCheckInAfterNoonCheck: null,
    }));

    // 6) สร้าง Training + Nested Create ลงตารางลูก
    const newTraining = await prisma.training.create({
      data: {
        ...trainingData,
        // บังคับให้มี trainingStartDate
        // สมมติว่า trainingStartDate ถูก parse เป็น Date ใน schema แล้ว
        trainingStartDate: new Date(trainingStartDate),

        trainingCreateAt: localNow,

        // สร้าง TrainingEmployee
        employeeTrainingTraining: {
          create: createEmployee,
        },

        // สร้าง TrainingEmployeeCheckIn
        employeeTrainingCheckInTraining: {
          create: createCheckIn,
        },
      },
      include: {
        // include ตารางลูก
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
