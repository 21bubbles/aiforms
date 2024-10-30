"use client";
import { jsonForms, submissions } from "@/configs/schema";
import React, { useEffect, useState, useCallback } from "react";
import { db } from "@/configs";
import { eq } from "drizzle-orm";
import ReadOnlyFormUi from "@/app/edit-form/_components/ReadOnlyFormUi";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface LiveAiFormProps {
  params: {
    formId?: string;
  };
}

interface FormField {
  fieldType: string;
  formLabel: string;
  placeholder: string;
  fieldName: string;
  [key: string]: unknown;
}

interface JsonForm {
  formTitle?: string;
  formHeading?: string;
  formSubheading?: string;
  formFields: FormField[];
}

interface FormData {
  [fieldName: string]: string;
}

const LiveAiForm: React.FC<LiveAiFormProps> = ({ params }) => {
  const [jsonForm, setJsonForm] = useState<JsonForm | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<FormData>({});
  const router = useRouter();

  const GetFormData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await db
        .select()
        .from(jsonForms)
        .where(eq(jsonForms.id, Number(params.formId)));

      if (result && result.length > 0) {
        const parsedForm = JSON.parse(result[0].jsonform) as JsonForm;
        // Ensure formFields is always an array
        setJsonForm({
          ...parsedForm,
          formFields: parsedForm.formFields || [],
        });
      } else {
        console.error("No form data found for the provided form ID.");
      }
    } catch (error) {
      console.error("Error fetching form data:", error);
    } finally {
      setLoading(false);
    }
  }, [params.formId]);

  useEffect(() => {
    if (params?.formId) {
      GetFormData();
    } else {
      console.error("Form ID is missing or undefined.");
      setLoading(false);
    }
  }, [params, GetFormData]);

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData((prevData: FormData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await db.insert(submissions).values({
        formId: Number(params.formId),
        submissionData: JSON.stringify(formData),
      });
      alert("Form submitted successfully!");
      router.push("/submissions");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center">
        <Image 
          src="/Loadertrans.gif" 
          alt="Loading indicator" 
          height={150} 
          width={150} 
          unoptimized
        />
        Loading form data...
      </div>
    );
  }

  if (!params?.formId) {
    return <div>Error: No form ID provided.</div>;
  }

  if (!jsonForm) {
    return <div>No form data found for ID: {params.formId}</div>;
  }

  return (
    <div className="w-full mt-10 p-10 flex flex-col items-center">
      <form
        className="max-w-xl border border-secondary p-5 rounded-md"
        onSubmit={handleSubmit}
      >
        <ReadOnlyFormUi jsonForm={jsonForm} onInputChange={handleInputChange} />
        <Button variant="default" type="submit" className="mt-4">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default LiveAiForm;