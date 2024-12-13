import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface EmbedCodeGeneratorProps {
  formId: string;
}

const EmbedCodeGenerator: React.FC<EmbedCodeGeneratorProps> = ({ formId }) => {
  const [width, setWidth] = useState("100%");
  const [height, setHeight] = useState("600px");

  const generateEmbedCode = () => {
    return `<iframe 
  src="${process.env.NEXT_PUBLIC_APP_URL}/aiform/${formId}" 
  width="${width}" 
  height="${height}" 
  frameBorder="0" 
  style="border:0;" 
  allowFullScreen 
  title="Embedded Form">
</iframe>`;
  };

  const copyEmbedCode = () => {
    const embedCode = generateEmbedCode();
    navigator.clipboard.writeText(embedCode);
    toast.success("Embed code copied to clipboard!");
  };

  return (
    <div className="space-y-4 p-4 border rounded-md">
      <h2 className="text-lg font-semibold">Generate Embed Code</h2>
      <div className="flex space-x-2 items-center">
        <label>Width:</label>
        <Input
          type="text"
          value={width}
          onChange={(e) => setWidth(e.target.value)}
          className="w-24"
          placeholder="Width"
        />
      </div>
      <div className="flex space-x-2 items-center">
        <label>Height:</label>
        <Input
          type="text"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          className="w-24"
          placeholder="Height"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Button
          onClick={copyEmbedCode}
          variant="outline"
          className="flex items-center"
        >
          <Copy className="mr-2 h-4 w-4" /> Copy Embed Code
        </Button>
      </div>
      <div>
        <label className="block mb-2">Embed Code Preview:</label>
        <pre className="bg-gray-700 p-2 rounded-md text-xs overflow-x-auto">
          {generateEmbedCode()}
        </pre>
      </div>
    </div>
  );
};

export default EmbedCodeGenerator;
