"use client";
import { SessionProvider } from "next-auth/react";
import React from "react";

export const CustomProviders = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};
