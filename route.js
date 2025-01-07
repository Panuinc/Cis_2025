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
              employee: true,
              // employment: {
              //   include: {
              //     branch: { select: { branchName: true } },
              //     site: { select: { siteName: true } },
              //     division: { select: { divisionName: true } },
              //     department: { select: { departmentName: true } },
              //     position: { select: { positionName: true } },
              //     role: { select: { roleName: true } },
              //   },
              // },
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

          //   if (user.userStatus !== "Active") {
          //     throw new Error(
          //       "The account is not active. Please contact the administrator"
          //     );
          //   }

          return {
            userId: user.userId,
            userUsername: user.userUsername,
            userPassword: user.userPassword,
            employee: user.employee,
            // employment: user.employment.map((employment) => ({
            //   ...employment,
            //   branch: employment.branch?.branchName || null,
            //   site: employment.site?.siteName || null,
            //   division: employment.division?.divisionName || null,
            //   department: employment.department?.departmentName || null,
            //   position: employment.position?.positionName || null,
            //   role: employment.role?.roleName || null,
            // })),
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
        // token.employment = user.employment;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        userId: token.userId,
        userUsername: token.userUsername,
        userPassword: token.userPassword,
        employee: token.employee,
        // employment: token.employment,
      };
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
