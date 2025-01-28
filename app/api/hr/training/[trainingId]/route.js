import { NextResponse } from "next/server";
import { handleErrors, handleGetErrors } from "@/lib/errorHandler";
import { trainingPutSchema } from "@/app/api/hr/training/trainingSchema";
import { verifySecretToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import prisma from "@/lib/prisma";
import { formatTrainingData } from "@/app/api/hr/training/trainingSchema";
import { getRequestIP } from "@/lib/GetRequestIp";
import { getLocalNow } from "@/lib/GetLocalNow";
import { SevenHouse } from "@/lib/SevenHouse";

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
    const dataObj = {};

    for (const [key, value] of formData.entries()) {
      if (key === "trainingEmployee" || key === "trainingEmployeeCheckIn") {
        dataObj[key] = JSON.parse(value);
      } else {
        dataObj[key] = value;
      }
    }

    const parsedData = trainingPutSchema.parse({
      ...dataObj,
      trainingId,
    });

    const {
      trainingEmployee,
      trainingEmployeeCheckIn,
      trainingStartDate,
      trainingEndDate,
      ...updateData
    } = parsedData;

    const localNow = getLocalNow();

    const adjustedTrainingStartDate = trainingStartDate
      ? SevenHouse(trainingStartDate)
      : null;
    const adjustedTrainingEndDate = trainingEndDate
      ? SevenHouse(trainingEndDate)
      : null;

    await prisma.training.update({
      where: { trainingId: parseInt(trainingId, 10) },
      data: {
        ...updateData,
        trainingStartDate: adjustedTrainingStartDate,
        trainingEndDate: adjustedTrainingEndDate,
        trainingUpdateAt: localNow,
      },
    });

    if (trainingEmployeeCheckIn && trainingEmployeeCheckIn.length > 0) {
      await prisma.trainingEmployeeCheckIn.updateMany({
        where: { trainingEmployeeCheckInTrainingId: parseInt(trainingId, 10) },
        data: {
          trainingEmployeeCheckInTrainingDate: adjustedTrainingStartDate,
          trainingEmployeeCheckInMorningCheck: null,
          trainingEmployeeCheckInAfterNoonCheck: null,
        },
      });
    }

    if (trainingEmployee && trainingEmployee.length > 0) {
      const existingTrainingEmployee = await prisma.trainingEmployee.findMany({
        where: { trainingEmployeeTrainingId: parseInt(trainingId, 10) },
        select: { trainingEmployeeEmployeeId: true },
      });

      const existingEmpIds = existingTrainingEmployee.map(
        (emp) => emp.trainingEmployeeEmployeeId
      );

      const newEmployeeToCreate = trainingEmployee
        .filter(
          (emp) => !existingEmpIds.includes(emp.trainingEmployeeEmployeeId)
        )
        .map((emp) => ({
          trainingEmployeeTrainingId: parseInt(trainingId, 10),
          trainingEmployeeEmployeeId: emp.trainingEmployeeEmployeeId,
        }));

      if (newEmployeeToCreate.length > 0) {
        await prisma.trainingEmployee.createMany({
          data: newEmployeeToCreate,
          skipDuplicates: true,
        });
      }
    }

    if (trainingEmployeeCheckIn && trainingEmployeeCheckIn.length > 0) {
      const existingCheckIn = await prisma.trainingEmployeeCheckIn.findMany({
        where: {
          trainingEmployeeCheckInTrainingId: parseInt(trainingId, 10),
        },
        select: { trainingEmployeeCheckInEmployeeId: true },
      });

      const existingCheckInIds = existingCheckIn.map(
        (ch) => ch.trainingEmployeeCheckInEmployeeId
      );

      const newCheckInToCreate = trainingEmployeeCheckIn
        .filter(
          (ch) =>
            !existingCheckInIds.includes(ch.trainingEmployeeCheckInEmployeeId)
        )
        .map((ch) => ({
          trainingEmployeeCheckInTrainingId: parseInt(trainingId, 10),
          trainingEmployeeCheckInEmployeeId:
            ch.trainingEmployeeCheckInEmployeeId,
          trainingEmployeeCheckInTrainingDate: adjustedTrainingStartDate,
          trainingEmployeeCheckInMorningCheck:
            ch.trainingEmployeeCheckInMorningCheck
              ? SevenHouse(ch.trainingEmployeeCheckInMorningCheck)
              : null,
          trainingEmployeeCheckInAfterNoonCheck:
            ch.trainingEmployeeCheckInAfterNoonCheck
              ? SevenHouse(ch.trainingEmployeeCheckInAfterNoonCheck)
              : null,
        }));

      if (newCheckInToCreate.length > 0) {
        await prisma.trainingEmployeeCheckIn.createMany({
          data: newCheckInToCreate,
          skipDuplicates: true,
        });
      }
    }

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
