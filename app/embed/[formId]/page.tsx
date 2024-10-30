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


"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Code, Copy, CheckCircle2 } from "lucide-react";

interface EmbedAiFormProps {
  params: {
    formId?: string;
  };
}

export default function EmbedAiForm({ params }: EmbedAiFormProps) {
  const [copied, setCopied] = useState(false);

  if (!params.formId) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Invalid Form ID. Please check the URL and try again.
        </AlertDescription>
      </Alert>
    );
  }

  if (!process.env.NEXT_PUBLIC_WIDGET_URL) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Missing NEXT_PUBLIC_WIDGET_URL environment variable.
        </AlertDescription>
      </Alert>
    );
  }

  const embedCode = `<ai-form form-id="${params.formId}"></ai-form>\n<script src="${process.env.NEXT_PUBLIC_WIDGET_URL}/ai-form-widget.js"></script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-3xl mx-auto bg-primary text-text border-secondary">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Embed Your AI Form
          </CardTitle>
          <CardDescription>
            Copy and paste this code to embed the AI form in your website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-secondary p-4 rounded-md mt-4 relative">
            {/* <pre className="text-sm overflow-x-auto">
              <code>{embedCode}</code>
            </pre> */}

            {/* <Button
              variant="outline"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleCopy}
            >
              {copied ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button> */}

            <p>Stay tuned! An embed link will be available shortly!</p>
          </div>
          <div className="mt-8 ">
            <h3 className="text-lg font-semibold mb-2">Preview</h3>
            <div className="border-2 border-dashed border-secondary border-primary-foreground rounded-md p-4 flex items-center justify-center min-h-[200px]">
              <div className="text-center">
                <Code className="h-12 w-12 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Your AI Form will appear here
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}