import { NextResponse } from "next/server";
import { handleErrors, handleGetErrors } from "@/lib/errorHandler";
import {
  trainingPutSchema,
  trainingHrApprovePutSchema,
  trainingMdApprovePutSchema,
} from "@/app/api/hr/training/trainingSchema";
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
          select: { employeeFirstnameTH: true, employeeLastnameTH: true },
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

    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (!action) {
      return NextResponse.json(
        { error: "Query parameter 'action' is required" },
        { status: 400 }
      );
    }

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

    let parsedData, updateData, message;
    const localNow = getLocalNow();

    switch (action) {
      case "update":
        {
          // update แบบปกติ
          parsedData = trainingPutSchema.parse({
            ...dataObj,
            trainingId: parseInt(trainingId, 10),
          });
          const {
            trainingEmployee,
            trainingEmployeeCheckIn,
            trainingStartDate,
            trainingEndDate,
            selectedIds,
            ...rest
          } = parsedData;

          // จัดการวันที่
          const adjustedTrainingStartDate = trainingStartDate
            ? SevenHouse(trainingStartDate)
            : null;
          const adjustedTrainingEndDate = trainingEndDate
            ? SevenHouse(trainingEndDate)
            : null;

          // updateData หลัก
          updateData = {
            ...rest,
            trainingStartDate: adjustedTrainingStartDate,
            trainingEndDate: adjustedTrainingEndDate,
            trainingUpdateAt: localNow,
          };
          message = "Training data updated successfully";

          // จากนั้นจัดการอัพเดต trainingEmployee, trainingCheckIn ใน transaction
          await prisma.$transaction(async (prismaTx) => {
            // update Training หลัก
            await prismaTx.training.update({
              where: { trainingId: parseInt(trainingId, 10) },
              data: updateData,
            });

            // จัดการ trainingEmployee & trainingCheckIn (เหมือนโค้ดเดิม)
            // ... (โค้ดจัดการ add/remove ตาม selectedIds)
            // -- ตัวอย่างสรุปย่อ --
            const existing = await prismaTx.trainingEmployee.findMany({
              where: { trainingEmployeeTrainingId: parseInt(trainingId, 10) },
              select: { trainingEmployeeEmployeeId: true },
            });
            const existingEmpIds = existing.map(
              (emp) => emp.trainingEmployeeEmployeeId
            );

            if (trainingEmployeeCheckIn && trainingEmployeeCheckIn.length > 0) {
              // updateMany reset checkIn date, etc.
              await prismaTx.trainingEmployeeCheckIn.updateMany({
                where: {
                  trainingEmployeeCheckInTrainingId: parseInt(trainingId, 10),
                },
                data: {
                  trainingEmployeeCheckInTrainingDate:
                    adjustedTrainingStartDate,
                  trainingEmployeeCheckInMorningCheck: null,
                  trainingEmployeeCheckInAfterNoonCheck: null,
                },
              });
            }

            if (trainingEmployee && trainingEmployee.length > 0) {
              // create ใหม่เฉพาะที่ยังไม่มี
              const newToCreate = trainingEmployee
                .filter(
                  (emp) =>
                    !existingEmpIds.includes(emp.trainingEmployeeEmployeeId)
                )
                .map((emp) => ({
                  trainingEmployeeTrainingId: parseInt(trainingId, 10),
                  trainingEmployeeEmployeeId: emp.trainingEmployeeEmployeeId,
                }));
              if (newToCreate.length > 0) {
                await prismaTx.trainingEmployee.createMany({
                  data: newToCreate,
                  skipDuplicates: true,
                });
              }
            }

            if (trainingEmployeeCheckIn && trainingEmployeeCheckIn.length > 0) {
              // create checkIn ใหม่เฉพาะที่ยังไม่มี
              const existingCheckIn =
                await prismaTx.trainingEmployeeCheckIn.findMany({
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
                    !existingCheckInIds.includes(
                      ch.trainingEmployeeCheckInEmployeeId
                    )
                )
                .map((ch) => ({
                  trainingEmployeeCheckInTrainingId: parseInt(trainingId, 10),
                  trainingEmployeeCheckInEmployeeId:
                    ch.trainingEmployeeCheckInEmployeeId,
                  trainingEmployeeCheckInTrainingDate:
                    adjustedTrainingStartDate,
                  trainingEmployeeCheckInMorningCheck: null,
                  trainingEmployeeCheckInAfterNoonCheck: null,
                }));
              if (newCheckInToCreate.length > 0) {
                await prismaTx.trainingEmployeeCheckIn.createMany({
                  data: newCheckInToCreate,
                  skipDuplicates: true,
                });
              }
            }

            // ลบพนักงานที่ไม่อยู่ใน selectedIds
            if (selectedIds && Array.isArray(selectedIds)) {
              const employeesToDelete = existingEmpIds.filter(
                (id) => !selectedIds.includes(id)
              );
              if (employeesToDelete.length > 0) {
                await prismaTx.trainingEmployeeCheckIn.deleteMany({
                  where: {
                    trainingEmployeeCheckInTrainingId: parseInt(trainingId, 10),
                    trainingEmployeeCheckInEmployeeId: {
                      in: employeesToDelete,
                    },
                  },
                });
                await prismaTx.trainingEmployee.deleteMany({
                  where: {
                    trainingEmployeeTrainingId: parseInt(trainingId, 10),
                    trainingEmployeeEmployeeId: { in: employeesToDelete },
                  },
                });
              }
            } else {
              // หากไม่มี selectedIds เลย (เคลียร์ทั้งหมด)
              await prismaTx.trainingEmployeeCheckIn.deleteMany({
                where: {
                  trainingEmployeeCheckInTrainingId: parseInt(trainingId, 10),
                },
              });
              await prismaTx.trainingEmployee.deleteMany({
                where: {
                  trainingEmployeeTrainingId: parseInt(trainingId, 10),
                },
              });
            }
          });
        }
        break;

      case "hrApprove":
        {
          // ถ้า HR Manager กด Approve หรือ Cancel
          // ตัวอย่างสั้น ๆ
          parsedData = trainingHrApprovePutSchema.parse({
            ...dataObj,
            trainingId: parseInt(trainingId, 10),
          });
          updateData = {
            trainingStatus: parsedData.trainingStatus,
            trainingReasonHrApproveBy: parsedData.trainingReasonHrApproveBy,
            trainingReasonHrApproveAt: localNow,
          };
          message = "Training data updated By HR successfully";
          await prisma.training.update({
            where: { trainingId: parseInt(trainingId, 10) },
            data: updateData,
          });
        }
        break;

      case "mdApprove":
        {
          // ถ้า MD กด Approve หรือ Cancel
          parsedData = trainingMdApprovePutSchema.parse({
            ...dataObj,
            trainingId: parseInt(trainingId, 10),
          });
          updateData = {
            trainingStatus: parsedData.trainingStatus,
            trainingReasonMdApproveBy: parsedData.trainingReasonMdApproveBy,
            trainingReasonMdApproveAt: localNow,
          };
          message = "Training data updated By MD successfully";
          await prisma.training.update({
            where: { trainingId: parseInt(trainingId, 10) },
            data: updateData,
          });
        }
        break;

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // ดึงข้อมูลมาโชว์หลังอัพเดต
    const updatedTraining = await prisma.training.findUnique({
      where: { trainingId: parseInt(trainingId, 10) },
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
          select: { employeeFirstnameTH: true, employeeLastnameTH: true },
        },
        TrainingUpdateBy: {
          select: { employeeFirstnameTH: true, employeeLastnameTH: true },
        },
      },
    });

    const formattedTraining = formatTrainingData([updatedTraining]);

    return NextResponse.json(
      {
        message,
        training: formattedTraining,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleErrors(error, ip, "Error updating training data");
  }
}
