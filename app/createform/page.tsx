import CreateForm from "@/components/CreateForm";
import { SideBar } from "@/components/SideBar";
import { cn } from "@/lib/utils";
import React from "react";

const CreateFormPage = () => {
  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row flex-1 overflow-hidden ",
        "h-screen "
      )}
    >
      <SideBar />
      <div className="flex flex-1 flex-col items-center justify-center w-full">
        {/* <h1 className="text-lg font-medium mb-4">Create Form</h1> */}
        <CreateForm />
      </div>
    </div>
  );
};

export default CreateFormPage;
