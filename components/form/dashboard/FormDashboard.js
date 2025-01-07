import React from "react";

export default function FormDashboard() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
      <div className="flex flex-col xl:flex-row items-center justify-center w-full min-h-40 p-2 gap-2 border-2 border-dark border-dashed">
        Banner
      </div>
      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex items-center justify-center w-full min-h-60 xl:w-6/12 p-2 gap-2 border-2 border-dark border-dashed">
          Graph 1
        </div>
        <div className="flex items-center justify-center w-full min-h-60 xl:w-3/12 p-2 gap-2 border-2 border-dark border-dashed">
          Graph 2
        </div>
        <div className="flex items-center justify-center w-full min-h-60 xl:w-3/12 p-2 gap-2 border-2 border-dark border-dashed">
          Graph 3
        </div>
      </div>
      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex items-center justify-center w-full min-h-60 xl:w-3/12 p-2 gap-2 border-2 border-dark border-dashed">
          Graph 4
        </div>
        <div className="flex items-center justify-center w-full min-h-60 xl:w-3/12 p-2 gap-2 border-2 border-dark border-dashed">
          Graph 5
        </div>
        <div className="flex items-center justify-center w-full min-h-60 xl:w-6/12 p-2 gap-2 border-2 border-dark border-dashed">
          Graph 6
        </div>
      </div>
    </div>
  );
}
