import React from "react";
import { Home } from "@/components/icons/icons";

export default function TopicHeader({ topic }) {
  return (
    <div className="flex items-center justify-start w-full h-full p-2 gap-2 border-b-2 border-dark border-dashed">
      <span className="flex items-center justify-center h-full p-2 gap-2 border-2 border-dark border-dashed">
        <Home />
      </span>
      <span className="flex items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed text-lg font-[600]">
        {topic}
      </span>
    </div>
  );
}
