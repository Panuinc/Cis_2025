import logger from "@/lib/logger";

export function verifySecretToken(headers) {
  const secretToken = headers.get("secret-token");
  if (!secretToken || secretToken !== process.env.SECRET_TOKEN) {
    const error = new Error("Access Denied Due To An Invalid Or Missing Token");
    error.status = 401;
    logger.warn({
      message: "Access Denied Due To An Invalid Or Missing Token",
    });
    throw error;
  }
}
