import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { checkRateLimit } from "@/lib/rateLimit";

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        userUsername: { label: "Username", type: "text" },
        userPassword: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const ip =
          req.headers["x-forwarded-for"] || req.connection.remoteAddress;
        await checkRateLimit(ip);

        if (!credentials?.userUsername || !credentials?.userPassword) {
          throw new Error("Username and password are required");
        }

        try {
          const user = await prisma.user.findFirst({
            where: { userUsername: credentials.userUsername },
            include: {
              UserEmployeeBy: {
                include: {
                  employeeEmployment: {
                    include: {
                      EmploymentBranchId: { select: { branchName: true } },
                      EmploymentSiteId: { select: { siteName: true } },
                      EmploymentRoleId: { select: { roleName: true } },
                      EmploymentDivisionId: { select: { divisionName: true } },
                      EmploymentDepartmentId: {
                        select: { departmentName: true },
                      },
                      EmploymentPositionId: { select: { positionName: true } },
                    },
                  },
                },
              },
            },
          });

          if (!user) {
            throw new Error(
              "Account not found. Please contact the administrator or register"
            );
          }

          const isValid = await bcrypt.compare(
            credentials.userPassword,
            user.userPassword
          );

          if (!isValid) {
            throw new Error("Incorrect password");
          }

          if (
            !user.UserEmployeeBy ||
            user.UserEmployeeBy.employeeStatus !== "Active"
          ) {
            throw new Error(
              "The account is not active. Please contact the administrator"
            );
          }

          const firstEmployment = user.UserEmployeeBy.employeeEmployment[0];

          return {
            userId: user.userId,
            userUsername: user.userUsername,
            userPassword: user.userPassword,
            employee: user.UserEmployeeBy,
            employment: user.UserEmployeeBy.employeeEmployment,
            branchName: firstEmployment?.EmploymentBranchId?.branchName,
            siteName: firstEmployment?.EmploymentSiteId?.siteName,
            roleName: firstEmployment?.EmploymentRoleId?.roleName,
            divisionName: firstEmployment?.EmploymentDivisionId?.divisionName,
            departmentName:
              firstEmployment?.EmploymentDepartmentId?.departmentName,
            positionName: firstEmployment?.EmploymentPositionId?.positionName,
          };
        } catch (error) {
          throw error;
        }
      },
    }),
  ],
  session: { maxAge: 60 * 60 },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log("🚀 ~ jwt ~ user:", user);
        token.userId = user.userId;
        token.userUsername = user.userUsername;
        token.userPassword = user.userPassword;
        token.employee = user.employee;
        token.employment = user.employment;
        token.branchName = user.branchName;
        token.siteName = user.siteName;
        token.roleName = user.roleName;
        token.divisionName = user.divisionName;
        token.departmentName = user.departmentName;
        token.positionName = user.positionName;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        userId: token.userId,
        userUsername: token.userUsername,
        userPassword: token.userPassword,
        employee: token.employee,
        employment: token.employment,
        branchName: token.branchName,
        siteName: token.siteName,
        roleName: token.roleName,
        divisionName: token.divisionName,
        departmentName: token.departmentName,
        positionName: token.positionName,
      };
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
