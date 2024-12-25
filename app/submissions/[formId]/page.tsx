"use client";

import React from "react";
import { useEffect, useState, useMemo } from "react";
import { SideBar } from "@/components/SideBar";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/configs";
import { submissions, jsonForms } from "@/configs/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";

interface FormSubmission {
  id: number;
  createdAt: Date;
  submissionData: Record<string, string>;
}

interface FormSubmissionsProps {
  params: {
    formId?: string;
  };
}

const LoadingSpinner = () => (
  <div className="w-full h-screen flex flex-col items-center justify-center">
    <Image
      src="/Loadertrans.gif"
      alt="Loading..."
      height={150}
      width={150}
      unoptimized
    />
    <span>Loading submissions...</span>
  </div>
);

const FormSubmissionsPage: React.FC<FormSubmissionsProps> = ({ params }) => {
  const [submissionData, setSubmissionData] = useState<FormSubmission[]>([]);
  const [formTitle, setFormTitle] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString: string | Date): string => {
    try {
      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }

      return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  const deleteSubmission = async (submissionId: number) => {
    if (confirm("Are you sure you want to delete this submission?")) {
      try {
        await db.delete(submissions).where(eq(submissions.id, submissionId));
        // Update the state to remove the deleted submission
        setSubmissionData((prevData) =>
          prevData.filter((submission) => submission.id !== submissionId)
        );
      } catch (error) {
        console.error("Error deleting submission:", error);
      }
    }
  };

  useEffect(() => {
    const fetchFormSubmissions = async () => {
      if (!params?.formId) return;

      try {
        const [formResult, submissionsResult] = await Promise.all([
          db
            .select()
            .from(jsonForms)
            .where(eq(jsonForms.id, Number(params.formId))),
          db
            .select()
            .from(submissions)
            .where(eq(submissions.formId, Number(params.formId))),
        ]);

        if (formResult?.[0]) {
          const parsedForm = JSON.parse(formResult[0].jsonform);
          setFormTitle(parsedForm.formTitle || "Untitled Form");
        }

        const processedData: FormSubmission[] = submissionsResult.map(
          (item) => ({
            id: item.id,
            createdAt: new Date(item.createdAt),
            submissionData: JSON.parse(item.submissionData),
          })
        );

        setSubmissionData(processedData);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFormSubmissions();
  }, [params?.formId]);

  const fieldNames = useMemo(() => {
    const allFields = new Set<string>();
    submissionData.forEach((submission) => {
      Object.keys(submission.submissionData).forEach((field) => {
        allFields.add(field);
      });
    });
    return Array.from(allFields);
  }, [submissionData]);

  if (loading) return <LoadingSpinner />;

  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row flex-1 w-full overflow-hidden h-full"
      )}
    >
      <SideBar />
      <div className="flex flex-1 flex-col items-center m-2 md:m-20 lg:m-20 w-full">
        <div className="flex flex-col gap-4 w-full">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{formTitle} - Submissions</h1>
            <div className="text-sm text-gray-500">
              Total Submissions: {submissionData.length}
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Submission ID</TableHead>
                  <TableHead>Date</TableHead>
                  {fieldNames.map((field) => (
                    <TableHead key={field}>{field}</TableHead>
                  ))}
                  <TableHead>Actions</TableHead> {/* New Actions Column */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissionData.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell>{submission.id}</TableCell>
                    <TableCell>{formatDate(submission.createdAt)}</TableCell>
                    {fieldNames.map((field) => (
                      <TableCell key={field}>
                        {submission.submissionData[field] || "-"}
                      </TableCell>
                    ))}
                    <TableCell>
                      <button
                        onClick={() => deleteSubmission(submission.id)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormSubmissionsPage;
