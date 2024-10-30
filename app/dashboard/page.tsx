import CreateForm from "@/components/CreateForm";
import { SideBar } from "@/components/SideBar";
import React from "react";

export default function Dashboard() {
  return (
    <div className="flex h-screen overflow-hidden">
      {" "}
      <SideBar />
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-1 flex-col items-center mt-20 w-full h-screen">
          <div>
            <CreateForm />
          </div>
          <div className="grid grid-flow-row gap-4 mt-10">
            <div className="grid grid-flow-col gap-4 grid-cols-3">
              <div className="border rounded-lg w-full h-full p-10 col-span-2">
                {" "}
                very important data{" "}
              </div>
              <div className="border rounded-lg w-full h-full p-10 col-span-1">
                form list table
              </div>
            </div>
            <div className="grid grid-flow-col gap-4 grid-cols-3">
              <div className="border rounded-lg w-full h-full p-10 col-span-1">
                3
              </div>
              <div className="border rounded-lg w-full h-full p-10 col-span-2">
                4
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
