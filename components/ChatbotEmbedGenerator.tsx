import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Clipboard } from "lucide-react";
import { toast } from "sonner";

interface ChatbotEmbedGeneratorProps {
  formId: string;
}

const ChatbotEmbedGenerator: React.FC<ChatbotEmbedGeneratorProps> = ({
  formId,
}) => {
  const [width, setWidth] = useState<string>("400px");
  const [height, setHeight] = useState<string>("600px");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [position, setPosition] = useState<"right" | "left" | "center">(
    "right"
  );

  const generateEmbedCode = () => {
    return `<script>
  (function() {
    var script = document.createElement('script');
    script.src = '${process.env.NEXT_PUBLIC_APP_URL}/chatbot-embed.js';
    script.async = true;
    script.setAttribute('data-form-id', '${formId}');
    script.setAttribute('data-width', '${width}');
    script.setAttribute('data-height', '${height}');
    script.setAttribute('data-theme', '${theme}');
    script.setAttribute('data-position', '${position}');
    document.body.appendChild(script);
  })();
</script>`.trim();
  };

  const copyEmbedCode = () => {
    const embedCode = generateEmbedCode();
    navigator.clipboard.writeText(embedCode);
    toast.success("Chatbot embed code copied to clipboard!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Chatbot Embed Code</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="width">Width</Label>
          <Input
            id="width"
            type="text"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            placeholder="400px"
          />
        </div>

        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="height">Height</Label>
          <Input
            id="height"
            type="text"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="600px"
          />
        </div>

        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label>Theme</Label>
          <div className="flex space-x-2">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              onClick={() => setTheme("light")}
            >
              Light
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              onClick={() => setTheme("dark")}
            >
              Dark
            </Button>
          </div>
        </div>

        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label>Position</Label>
          <div className="flex space-x-2">
            <Button
              variant={position === "left" ? "default" : "outline"}
              onClick={() => setPosition("left")}
            >
              Left
            </Button>
            <Button
              variant={position === "center" ? "default" : "outline"}
              onClick={() => setPosition("center")}
            >
              Center
            </Button>
            <Button
              variant={position === "right" ? "default" : "outline"}
              onClick={() => setPosition("right")}
            >
              Right
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Button onClick={copyEmbedCode} variant="outline" className="w-full">
            <Clipboard className="mr-2 h-4 w-4" /> Copy Embed Code
          </Button>
        </div>

        <div>
          <Label>Embed Code Preview:</Label>
          <pre className="mt-2 p-2 bg-muted rounded-md text-xs overflow-x-auto">
            {generateEmbedCode()}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatbotEmbedGenerator;
