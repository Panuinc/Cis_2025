"use client";
import React from "react";
import TopicHeader from "@/components/form/TopicHeader";
import FormBranch from "@/components/form/hr/branch/FormBranch";

export default function BranchCreate() {
  return (
    <>
      <TopicHeader topic="Branch Create" />
      <FormBranch />
    </>
  );
}
