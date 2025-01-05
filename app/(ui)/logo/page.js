import TopicHeader from "@/components/form/TopicHeader";
import React from "react";

export default function Logo() {
  return (
    <>
      <TopicHeader topic="Logo" />
      <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        Contents
      </div>
    </>
  );
}
