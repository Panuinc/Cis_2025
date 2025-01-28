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

    const parsedData = trainingPosteSchema.parse(dataObj);

    const {
      trainingEmployee,
      trainingStartDate,
      trainingEndDate,
      ...trainingData
    } = parsedData;

    const localNow = getLocalNow();

    const addSevenHours = (dateString) => {
      return dateString
        ? new Date(new Date(dateString).getTime() + 7 * 60 * 60 * 1000)
        : null;
    };

    const adjustedTrainingStartDate = addSevenHours(trainingStartDate);
    const adjustedTrainingEndDate = addSevenHours(trainingEndDate);

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
