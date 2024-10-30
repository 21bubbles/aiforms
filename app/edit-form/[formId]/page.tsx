"use client";
import { db } from "@/configs";
import { jsonForms } from "@/configs/schema";
import { useUser } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import FormUi from "../_components/FormUi";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import CopyLinkButton from "@/components/copy-liveLink";

interface EditFormProps {
  params: {
    formId: string;
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

function EditForm({ params }: EditFormProps) {
  const { user } = useUser();
  const [jsonForm, setJsonForm] = useState<JsonForm | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      GetFormData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const GetFormData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await db
        .select()
        .from(jsonForms)
        .where(
          and(
            eq(jsonForms.id, parseInt(params.formId, 10)), // Convert string to number
            eq(
              jsonForms.createdBy,
              user?.primaryEmailAddress?.emailAddress as string
            )
          )
        );
      if (result.length === 0) {
        throw new Error("Form not found");
      }
      const parsedForm = JSON.parse(result[0].jsonform) as JsonForm;
      // Ensure formFields is always an array
      setJsonForm({
        ...parsedForm,
        formFields: parsedForm.formFields || [],
      });
    } catch (error) {
      console.error("Error fetching form data:", error);
      setError("Unable to fetch form data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const updateFormInDb = async (updatedForm: JsonForm) => {
    try {
      await db
        .update(jsonForms)
        .set({ jsonform: JSON.stringify(updatedForm) })
        .where(eq(jsonForms.id, parseInt(params.formId, 10))); // Convert string to number
    } catch (error) {
      console.error("Error updating form data:", error);
    }
  };

  const onFieldUpdate = (updatedField: Partial<FormField>, index: number) => {
    if (jsonForm) {
      const updatedFields = [...jsonForm.formFields];
      updatedFields[index] = { ...updatedFields[index], ...updatedField };
      const updatedForm = { ...jsonForm, formFields: updatedFields };
      setJsonForm(updatedForm);
      updateFormInDb(updatedForm);
    }
  };

  const onFieldDelete = (index: number) => {
    setDeletingIndex(index);
    setIsAlertOpen(true);
  };

  const confirmDelete = async () => {
    if (jsonForm && deletingIndex !== null) {
      const updatedFields = jsonForm.formFields.filter(
        (_, idx) => idx !== deletingIndex
      );
      const updatedForm = { ...jsonForm, formFields: updatedFields };
      setJsonForm(updatedForm);
      await updateFormInDb(updatedForm);
      setIsAlertOpen(false);
      setDeletingIndex(null);
    }
  };

  const onAddField = async (fieldType: string) => {
    if (jsonForm) {
      const newField: FormField = {
        fieldType,
        formLabel: `New ${
          fieldType.charAt(0).toUpperCase() + fieldType.slice(1)
        } Field`,
        placeholder: `Enter ${fieldType}`,
        fieldName: `new_${fieldType}_${Date.now()}`,
      };

      const updatedFields = [...jsonForm.formFields, newField];
      const updatedForm = { ...jsonForm, formFields: updatedFields };
      setJsonForm(updatedForm);
      await updateFormInDb(updatedForm);
    }
  };

  const onTitleUpdate = async (newTitle: string) => {
    if (jsonForm) {
      const updatedForm = { ...jsonForm, formTitle: newTitle };
      setJsonForm(updatedForm);
      await updateFormInDb(updatedForm);
    }
  };

  const onSubheadingUpdate = async (newSubheading: string) => {
    if (jsonForm) {
      const updatedForm = { ...jsonForm, formSubheading: newSubheading };
      setJsonForm(updatedForm);
      await updateFormInDb(updatedForm);
    }
  };

  return (
    <div>
      <div className="w-full mt-10 p-10">
        <div className="flex gap-8 items-center justify-between">
          <Button
            className="flex gap-2 items-center my-5 cursor-pointer hover:font-bold"
            onClick={() => router.back()}
          >
            <ArrowLeftIcon /> Back
          </Button>
          <div className="flex flex-row gap-2">
            <Link href={`/aiform/${params.formId}`} target="_blank">
              <Button className="flex gap-2">
                Live preview <ArrowUpRight className="w-5 h-5"/>
              </Button>
            </Link>
            <CopyLinkButton formId={parseInt(params.formId, 10)} />

            <Link href={`/embed/${params.formId}`} target="_blank">
              <Button>Embed Link</Button>
            </Link>
          </div>
        </div>
        {error && <p className="text-red-500">{error}</p>}

        {loading ? (
      <div className="w-full h-screen flex flex-col items-center">
            <Image
              src="/Loadertrans.gif"
              alt="my gif"
              height={150}
              width={150}
              unoptimized
            />
            Loading form...
          </div>
        ) : (
          <div className="flex items-center justify-center w-full">
            {/* <div className="grid grid-flow-col grid-cols-3 gap-8 w-full"> */}
            <div className="col-span-2 rounded-md min-h-screen h-full p-4 flex items-center justify-center">
              {jsonForm ? (
                <FormUi
                  jsonForm={jsonForm}
                  onFieldUpdate={onFieldUpdate}
                  onFieldDelete={onFieldDelete}
                  onAddField={onAddField}
                  onTitleUpdate={onTitleUpdate}
                  onSubheadingUpdate={onSubheadingUpdate}
                />
              ) : (
                <p>Form data is unavailable.</p>
              )}
            </div>
            {/* <div className="col-span-1 border rounded-md min-h-screen h-full p-4">
              controller
            </div> */}
          </div>
        )}
      </div>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Field</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this field? This action cannot be
            undone.
          </AlertDialogDescription>
          <div className="flex justify-end">
            <AlertDialogCancel onClick={() => setIsAlertOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="ml-2">
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default EditForm;
