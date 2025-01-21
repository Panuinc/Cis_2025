import { NextResponse } from "next/server";
import { handleErrors } from "@/lib/errorHandler";
import { employmentTransferBulkSchema } from "./employmentTransferSchema"; // Zod schema
import { verifySecretToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import prisma from "@/lib/prisma";
import { getRequestIP } from "@/lib/GetRequestIp";
import { getLocalNow } from "@/lib/GetLocalNow";

export async function POST(request) {
  let ip;
  try {
    // 1) ดึง IP
    ip = getRequestIP(request);

    // 2) ตรวจสอบ secret token และ Rate Limit
    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    // 3) รับ JSON
    const data = await request.json();
    // data ควรจะเป็น array

    // 4) ใช้ Zod parse data
    const parsedData = employmentTransferBulkSchema.parse(data);

    // 5) สร้างวันที่ Local Now
    const localNow = getLocalNow();

    // 6) map ข้อมูลแต่ละ record เข้าไปใน prisma transaction
    const operations = parsedData.map((item) => {
      return prisma.employment.update({
        where: { employmentId: item.employmentId },
        data: {
          employmentBranchId: item.employmentBranchId,
          employmentSiteId: item.employmentSiteId,
          employmentDivisionId: item.employmentDivisionId,
          employmentDepartmentId: item.employmentDepartmentId,
          employmentParentId: item.employmentParentId,

          employmentUpdateBy: item.employmentUpdateBy,
          employmentUpdateAt: localNow,
        },
      });
    });

    // 7) ทำงานแบบ transaction
    const result = await prisma.$transaction(operations);

    // 8) ส่ง Response
    return NextResponse.json(
      {
        message: "Employment Transfer successfully",
        updatedCount: result.length,
        result,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleErrors(error, ip, "Error updating employment data");
  }
}
