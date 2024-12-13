// import React from "react";
// import CopyBtn from "@/components/copy-btn";

// interface EmbedAiFormProps {
//   params: {
//     formId?: string;
//   };
// }

// const EmbedAiForm: React.FC<EmbedAiFormProps> = ({ params }) => {
//   if (!params.formId) return <div>Invalid Form ID</div>;
//   if (!process.env.NEXT_PUBLIC_WIDGET_URL) return <div>Missing NEXT_PUBLIC_WIDGET_URL</div>;

//   const embedCode = `<ai-form form-id="${params.formId}"></ai-form>\n<script src="${process.env.NEXT_PUBLIC_WIDGET_URL}/ai-form-widget.js"></script>`;

//   return (
//     <div>
//       <h1 className="text-xl font-bold mb-2">Embed Your AI Form</h1>
//       <p className="text-lg text-secondary-foreground">
//         Copy and paste this code to embed the AI form in your website
//       </p>
//       <div className="bg-blue-950 p-6 rounded-md mt-6 relative">
//         <code className="text-white">
//           {embedCode}
//         </code>
//         <CopyBtn text={embedCode} />
//       </div>
//     </div>
//   );
// };

// export default EmbedAiForm;


// "use client";
// import { useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Code, Copy, CheckCircle2 } from "lucide-react";

// interface EmbedAiFormProps {
//   params: {
//     formId?: string;
//   };
// }

// export default function EmbedAiForm({ params }: EmbedAiFormProps) {
//   const [copied, setCopied] = useState(false);

//   if (!params.formId) {
//     return (
//       <Alert variant="destructive">
//         <AlertTitle>Error</AlertTitle>
//         <AlertDescription>
//           Invalid Form ID. Please check the URL and try again.
//         </AlertDescription>
//       </Alert>
//     );
//   }

//   if (!process.env.NEXT_PUBLIC_WIDGET_URL) {
//     return (
//       <Alert variant="destructive">
//         <AlertTitle>Error</AlertTitle>
//         <AlertDescription>
//           Missing NEXT_PUBLIC_WIDGET_URL environment variable.
//         </AlertDescription>
//       </Alert>
//     );
//   }

//   const embedCode = `<ai-form form-id="${params.formId}"></ai-form>\n<script src="${process.env.NEXT_PUBLIC_WIDGET_URL}/ai-form-widget.js"></script>`;

//   const handleCopy = () => {
//     navigator.clipboard.writeText(embedCode);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <Card className="w-full max-w-3xl mx-auto bg-primary text-text border-secondary">
//         <CardHeader>
//           <CardTitle className="text-2xl font-bold">
//             Embed Your AI Form
//           </CardTitle>
//           <CardDescription>
//             Copy and paste this code to embed the AI form in your website
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="bg-secondary p-4 rounded-md mt-4 relative">
//             {/* <pre className="text-sm overflow-x-auto">
//               <code>{embedCode}</code>
//             </pre> */}

//             {/* <Button
//               variant="outline"
//               size="icon"
//               className="absolute top-2 right-2"
//               onClick={handleCopy}
//             >
//               {copied ? (
//                 <CheckCircle2 className="h-4 w-4" />
//               ) : (
//                 <Copy className="h-4 w-4" />
//               )}
//             </Button> */}

//             <p>Stay tuned! An embed link will be available shortly!</p>
//           </div>
//           <div className="mt-8 ">
//             <h3 className="text-lg font-semibold mb-2">Preview</h3>
//             <div className="border-2 border-dashed border-secondary border-primary-foreground rounded-md p-4 flex items-center justify-center min-h-[200px]">
//               <div className="text-center">
//                 <Code className="h-12 w-12 text-primary mx-auto mb-2" />
//                 <p className="text-sm text-muted-foreground">
//                   Your AI Form will appear here
//                 </p>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

"use client";
import { jsonForms, submissions } from "@/configs/schema";
import React, { useEffect, useState, useCallback } from "react";
import { db } from "@/configs";
import { eq } from "drizzle-orm";
import ReadOnlyFormUi from "@/app/edit-form/_components/ReadOnlyFormUi";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import EmbedCodeGenerator from "@/components/EmbedCodeGenerator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      <Tabs defaultValue="form" className="w-full max-w-xl">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="form">Form</TabsTrigger>
          <TabsTrigger value="embed">Embed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="form">
          <form
            className="border border-secondary p-5 rounded-md"
            onSubmit={handleSubmit}
          >
            <ReadOnlyFormUi 
              jsonForm={jsonForm} 
              onInputChange={handleInputChange} 
            />
            <Button variant="default" type="submit" className="mt-4 w-full">
              Submit
            </Button>
          </form>
        </TabsContent>
        
        <TabsContent value="embed">
          {params.formId && (
            <EmbedCodeGenerator formId={params.formId} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LiveAiForm;