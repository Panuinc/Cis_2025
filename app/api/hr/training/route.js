import { NextResponse } from "next/server";
import { handleErrors, handleGetErrors } from "@/lib/errorHandler";
import { trainingPostSchema } from "@/app/api/hr/training/trainingSchema";
import { verifySecretToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import prisma from "@/lib/prisma";
import { formatTrainingData } from "@/app/api/hr/training/trainingSchema";
import { getRequestIP } from "@/lib/GetRequestIp";
import { getLocalNow } from "@/lib/GetLocalNow";
import { SevenHouse } from "@/lib/SevenHouse";

export async function GET(request) {
  let ip;
  try {
    ip = getRequestIP(request);

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const { searchParams } = new URL(request.url);
    const employeeIdParam = searchParams.get("employeeId");
    const employeeId = employeeIdParam ? Number(employeeIdParam) : null;

    // รับ userId จาก headers
    const userId = request.headers.get("user-id");

    // Query ข้อมูล User และ Employee ที่เกี่ยวข้อง
    const user = await prisma.user.findUnique({
      where: { userId: Number(userId) },
      include: {
        UserEmployeeBy: {
          include: {
            employeeEmployment: {
              include: {
                EmploymentBranchId: true,
                EmploymentDivisionId: true,
                EmploymentRoleId: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userDivision =
      user.UserEmployeeBy?.employeeEmployment[0]?.EmploymentDivisionId
        ?.divisionName;
    const userRole =
      user.UserEmployeeBy?.employeeEmployment[0]?.EmploymentRoleId?.roleName;

    let whereCondition = {};

    // Case 1: Owner sees all their requests
    if (employeeId) {
      whereCondition = {
        trainingCreateBy: employeeId, // Owner sees all their requests
      };
    }

    // Case 3: HR Manager sees all requests but can only update PendingHrApprove or PendingMdApprove for their subordinates
    if (userDivision === "บุคคล" && userRole === "Manager") {
      whereCondition = {}; // HR Manager sees all requests
    }

    // Case 4: MD sees only requests with status PendingMdApprove
    if (userDivision === "บริหาร" && userRole === "MD") {
      whereCondition = {
        trainingStatus: "PendingMdApprove",
      };
    }

    const training = await prisma.training.findMany({
      where: whereCondition,
      include: {
        employeeTrainingTraining: {
          include: {
            TrainingEmployeeEmployeeId: {
              select: { employeeFirstnameTH: true, employeeLastnameTH: true },
            },
          },
        },
        employeeTrainingCheckInTraining: {
          include: {
            TrainingEmployeeCheckInEmployeeId: {
              select: { employeeFirstnameTH: true, employeeLastnameTH: true },
            },
          },
        },
        TrainingCreateBy: {
          select: {
            employeeId: true,
            employeeFirstnameTH: true,
            employeeLastnameTH: true,
            employeeEmployment: {
              select: {
                employmentSignature: true,
              },
              take: 1,
            },
          },
        },
        TrainingUpdateBy: {
          select: { employeeFirstnameTH: true, employeeLastnameTH: true },
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

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const formData = await request.formData();
    let dataObj = {};

    for (const [key, value] of formData.entries()) {
      if (key === "trainingEmployee") {
        dataObj[key] = JSON.parse(value);
      } else {
        dataObj[key] = value;
      }
    }

    const parsedData = trainingPostSchema.parse(dataObj);

    const {
      trainingEmployee,
      trainingStartDate,
      trainingEndDate,
      ...trainingData
    } = parsedData;

    const localNow = getLocalNow();

    const adjustedTrainingStartDate = SevenHouse(trainingStartDate);
    const adjustedTrainingEndDate = SevenHouse(trainingEndDate);

    const createEmployee = (trainingEmployee || []).map((emp) => ({
      trainingEmployeeEmployeeId: emp.trainingEmployeeEmployeeId,
    }));

    const createCheckIn = (trainingEmployee || []).map((emp) => ({
      trainingEmployeeCheckInEmployeeId: emp.trainingEmployeeEmployeeId,
      trainingEmployeeCheckInTrainingDate: adjustedTrainingStartDate,
      trainingEmployeeCheckInMorningCheck: null,
      trainingEmployeeCheckInAfterNoonCheck: null,
    }));

    const newTraining = await prisma.training.create({
      data: {
        ...trainingData,
        trainingStartDate: adjustedTrainingStartDate,
        trainingEndDate: adjustedTrainingEndDate,

        trainingCreateAt: localNow,

        employeeTrainingTraining: {
          create: createEmployee,
        },

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
        message: "Successfully created new training",
        training: newTraining,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleErrors(error, ip, "Error creating training data");
  }
}
