// route.js

import { NextResponse } from "next/server";
import { handleErrors, handleGetErrors } from "@/lib/errorHandler";
import { trainingUpdateSchema } from "@/app/api/hr/training/trainingSchema";
import { verifySecretToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import prisma from "@/lib/prisma";
import { formatTrainingData } from "@/app/api/hr/training/trainingSchema";
import { getRequestIP } from "@/lib/GetRequestIp";
import { getLocalNow } from "@/lib/GetLocalNow";
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
        employeeTrainingCheckInTraining: {
          include: {
            TrainingEmployeeCheckInEmployeeId: {
              select: {
                employeeFirstname: true,
                employeeLastname: true,
                employeeEmployment: {
                  select: {
                    employmentNumber: true,
                    employmentSignature: true,
                    EmploymentPositionId: {
                      select: {
                        positionName: true,
                      },
                    },
                    EmploymentDivisionId: {
                      select: {
                        divisionName: true,
                      },
                    },
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

    const formData = await request.formData();
    const payload = Object.fromEntries(formData.entries());

    const parsedData = trainingUpdateSchema.parse({
      trainingId: parseInt(trainingId, 10),
      trainingPreTest: payload.trainingPreTest,
      trainingPostTest: payload.trainingPostTest,
      trainingPictureLink: payload.trainingPictureLink,
      trainingEmployeeCheckIn: JSON.parse(payload.trainingEmployeeCheckIn || "[]"),
    });

    const localNow = getLocalNow();

    await prisma.$transaction(async (prismaTx) => {
      await prismaTx.training.update({
        where: { trainingId: parseInt(trainingId, 10) },
        data: {
          trainingPreTest: parsedData.trainingPreTest,
          trainingPostTest: parsedData.trainingPostTest,
          trainingPictureLink: parsedData.trainingPictureLink,
          trainingUpdateAt: localNow,
        },
      });

      if (
        parsedData.trainingEmployeeCheckIn &&
        parsedData.trainingEmployeeCheckIn.length > 0
      ) {
        for (const checkIn of parsedData.trainingEmployeeCheckIn) {
          const existingCheckIn = await prismaTx.trainingEmployeeCheckIn.findUnique({
            where: { trainingEmployeeCheckInId: checkIn.trainingEmployeeCheckInId },
          });

          if (!existingCheckIn) {
            throw new Error(`TrainingEmployeeCheckIn with ID ${checkIn.trainingEmployeeCheckInId} not found`);
          }

          await prismaTx.trainingEmployeeCheckIn.update({
            where: { trainingEmployeeCheckInId: checkIn.trainingEmployeeCheckInId },
            data: {
              trainingEmployeeCheckInMorningCheck: checkIn.trainingEmployeeCheckInMorningCheck
                ? new Date(checkIn.trainingEmployeeCheckInMorningCheck)
                : null,
              trainingEmployeeCheckInAfterNoonCheck: checkIn.trainingEmployeeCheckInAfterNoonCheck
                ? new Date(checkIn.trainingEmployeeCheckInAfterNoonCheck)
                : null,
            },
          });
        }
      }
    });

    const updatedTraining = await prisma.training.findUnique({
      where: { trainingId: parseInt(trainingId, 10) },
      include: {
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
