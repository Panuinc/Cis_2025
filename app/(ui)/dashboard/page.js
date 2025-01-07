import FormDashboard from "@/components/form/dashboard/FormDashboard";
import TopicHeader from "@/components/form/TopicHeader";
import React from "react";

export default function Dashboard() {
  return (
    <>
      <TopicHeader topic="Dashboard" />
      <FormDashboard />
    </>
  );
}
