import TopicHeader from "@/components/form/TopicHeader";
import React from "react";

export default function Dashboard() {
  return (
    <>
      <TopicHeader topic="Dashboard" />
      <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        Contents
      </div>
    </>
  );
}
