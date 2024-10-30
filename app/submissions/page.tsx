"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { SideBar } from "@/components/SideBar";
import { cn } from "@/lib/utils";
import {
  IconUserBolt,
  IconLink,
  IconEdit,
  IconSearch,
} from "@tabler/icons-react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/configs";
import { submissions, jsonForms } from "@/configs/schema";
import { eq, sql } from "drizzle-orm";
import Link from "next/link";
import moment from "moment";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, FileJson } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import CopyLinkButton from "@/components/copy-liveLink";

// Type definitions
interface FormData {
  formId: number;
  formTitle: string;
  createdAt: string;
  submissionCount: number;
}

// Define the exact structure of your JSON form
interface JsonFormData {
  formTitle: string;
  fields: Array<{
    id: string;
    type: string;
    label: string;
    required: boolean;
    options?: string[];
  }>;
  settings: {
    allowMultipleSubmissions: boolean;
    submitButtonText: string;
    confirmationMessage: string;
  };
}

interface DbQueryResult {
  formId: number;
  jsonform: string;
  createdAt: string | null;
  submissionCount: number;
}

// Component Props Types
interface StatCardProps {
  icon: React.FC<{ className?: string }>;
  title: string;
  value: number | string;
}

// Separate components
const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value }) => (
  <div className="flex flex-col gap-2 border border-secondary p-4 rounded-md w-full">
    <Icon className="h-5 w-5 flex-shrink-0" />
    <h1>{title}</h1>
    <h1>{value}</h1>
  </div>
);

const LoadingSpinner: React.FC = () => (
  <div className="w-full h-screen flex flex-col items-center justify-center">
    <Image
      src="/Loadertrans.gif"
      alt="Loading"
      height={150}
      width={150}
      priority
      unoptimized
    />
    Loading forms...
  </div>
);

const SubmissionsPage: React.FC = () => {
  const { user } = useUser();
  const [formsData, setFormsData] = useState<FormData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const filteredForms = useMemo(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    return formsData.filter((form) =>
      form.formTitle.toLowerCase().includes(lowercasedQuery)
    );
  }, [searchQuery, formsData]);

  const totalSubmissions = useMemo(
    () => formsData.reduce((sum, form) => sum + form.submissionCount, 0),
    [formsData]
  );

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  // const formatDate = useCallback((date: string | null): string => {
  //   if (!date) return "N/A";
  //   const momentDate = moment(date);
  //   return momentDate.isValid()
  //     ? momentDate.format("DD/MM/YYYY") // Ensure date format is consistent
  //     : "Invalid Date";
  // }, []);

  const formatDate = useCallback((date: string | null): string => {
    if (!date) return "N/A";

    const momentDate = moment(date, "DD/MM/YYYY", true); // Specify the expected format
    if (!momentDate.isValid()) {
      console.warn("Invalid date format:", date); // Log invalid date formats
      return "Invalid Date";
    }

    return momentDate.format("DD/MM/YYYY");
  }, []);

  const parseJsonForm = (jsonString: string): JsonFormData => {
    try {
      const parsed = JSON.parse(jsonString) as JsonFormData;
      // Validate the required properties
      if (typeof parsed.formTitle !== "string") {
        throw new Error("Invalid form title");
      }
      return parsed;
    } catch {
      // Return a default form structure if parsing fails
      return {
        formTitle: "Untitled Form",
        fields: [],
        settings: {
          allowMultipleSubmissions: false,
          submitButtonText: "Submit",
          confirmationMessage: "Thank you for your submission",
        },
      };
    }
  };

  const processQueryResult = useCallback(
    (result: DbQueryResult): FormData => {
      const parsedForm = parseJsonForm(result.jsonform);

      return {
        formId: result.formId,
        formTitle: parsedForm.formTitle,
        createdAt: formatDate(result.createdAt), // Use formatDate to format the date
        submissionCount: Number(result.submissionCount),
      };
    },
    [formatDate]
  );

  // const deleteForm = useCallback(async (formId: number) => {
  //   if (
  //     confirm(
  //       "Are you sure you want to delete this form? This action cannot be undone."
  //     )
  //   ) {
  //     try {
  //       await db.delete(jsonForms).where(eq(jsonForms.id, formId)); // Adjust this line according to your ORM's delete syntax

  //       // Update state to remove the deleted form
  //       setFormsData((prevForms) =>
  //         prevForms.filter((form) => form.formId !== formId)
  //       );
  //     } catch (error) {
  //       console.error(
  //         "Error deleting form:",
  //         error instanceof Error ? error.message : "Unknown error"
  //       );
  //     }
  //   }
  // }, []);

  const deleteForm = useCallback(async (formId: number) => {
    if (
      confirm(
        "Are you sure you want to delete this form and all its submissions? This action cannot be undone."
      )
    ) {
      try {
        // Delete submissions associated with the form
        await db.delete(submissions).where(eq(submissions.formId, formId));

        // Delete the form itself
        await db.delete(jsonForms).where(eq(jsonForms.id, formId));

        // Update state to remove the deleted form
        setFormsData((prevForms) =>
          prevForms.filter((form) => form.formId !== formId)
        );
      } catch (error) {
        console.error(
          "Error deleting form:",
          error instanceof Error ? error.message : "Unknown error"
        );
      }
    }
  }, []);

  const fetchForms = useCallback(async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    try {
      const result = await db
        .select({
          formId: jsonForms.id,
          jsonform: jsonForms.jsonform,
          createdAt: jsonForms.createdAt,
          submissionCount: sql<number>`COUNT(${submissions.id})`,
        })
        .from(jsonForms)
        .leftJoin(submissions, eq(jsonForms.id, submissions.formId))
        .where(eq(jsonForms.createdBy, user.primaryEmailAddress.emailAddress))
        .groupBy(jsonForms.id, jsonForms.jsonform, jsonForms.createdAt)
        .orderBy(sql`COUNT(${submissions.id}) DESC`);

      console.log("Raw result from DB:", result);

      const processedData = result.map((item: DbQueryResult) =>
        processQueryResult(item)
      );
      setFormsData(processedData);
    } catch (error) {
      console.error(
        "Error fetching forms:",
        error instanceof Error ? error.message : "Unknown error"
      );
    } finally {
      setLoading(false);
    }
  }, [user?.primaryEmailAddress?.emailAddress, processQueryResult]);

  useEffect(() => {
    if (user) {
      fetchForms();
    }
  }, [user, fetchForms]);

  if (loading) return <LoadingSpinner />;

  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row flex-1 w-full overflow-hidden",
        "h-full"
      )}
    >
      <SideBar />
      <div className="flex flex-1 flex-col items-center m-20 w-full">
        <div className="flex flex-col gap-4 w-full">
          <h1 className="text-start text-2xl font-bold">Forms & Submissions</h1>

          <div className="relative w-full mt-4">
            <input
              type="text"
              placeholder="Search by form title..."
              value={searchQuery}
              onChange={handleSearch}
              className="border border-accent rounded-md p-2 pl-10 w-full bg-primary"
            />
            <IconSearch className="absolute left-3 top-2.5 text-text h-5 w-5" />
          </div>

          <div className="flex flex-row gap-4 mt-4">
            <StatCard
              icon={IconUserBolt}
              title="Total Forms"
              value={filteredForms.length}
            />
            <StatCard
              icon={IconUserBolt}
              title="Total Submissions"
              value={totalSubmissions}
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Form Title</TableHead>
                <TableHead className="text-center">Created Date</TableHead>
                <TableHead className="text-center">Submission Count</TableHead>
                <TableHead className="text-center">Live Link</TableHead>
                <TableHead className="text-center">Embed Link</TableHead>
                <TableHead className="text-center">Edit</TableHead>
                <TableHead className="text-center">Delete</TableHead>{" "}
                {/* Add a header for delete */}
                <TableHead className="text-center">View Submissions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredForms.map((form) => (
                <TableRow key={form.formId}>
                  <TableCell className="text-start">{form.formTitle}</TableCell>
                  <TableCell className="text-center">
                    {form.createdAt}
                  </TableCell>
                  <TableCell className="text-center">
                    {form.submissionCount}
                  </TableCell>
                  <TableCell className="text-center">
                    {/* <Link href={`/aiform/${form.formId}`}>
                      <Button variant="outline" className="border-secondary">
                        <IconLink className="cursor-pointer h-4 w-4" />
                      </Button>
                    </Link> */}
                    <TableCell className="text-center">
                      <CopyLinkButton formId={form.formId} />
                    </TableCell>
                  </TableCell>
                  <TableCell className="text-center">
                    <Link href={`/embed/${form.formId}`}>
                      <Button variant="outline" className="border-secondary">
                        <FileJson className="cursor-pointer h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                  <TableCell className="text-center">
                    <Link href={`/edit-form/${form.formId}`}>
                      <Button variant="outline" className="border-secondary">
                        <IconEdit className="cursor-pointer h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="outline"
                      className="border-secondary"
                      onClick={() => deleteForm(form.formId)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                  <TableCell className="text-center">
                    <Link href={`/submissions/${form.formId}`}>
                      <Button variant="outline" className="border-secondary">
                        <ArrowRightIcon className="cursor-pointer h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={8}></TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default SubmissionsPage;
