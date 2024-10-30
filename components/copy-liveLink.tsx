import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { IconLink } from "@tabler/icons-react";
import { Check, Copy } from "lucide-react";

const CopyLinkButton = ({ formId }: { formId: number }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    // Construct the full URL (adjust the base URL according to your deployment)
    const url = `${window.location.origin}/aiform/${formId}`;
    
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Button 
      variant="outline" 
      className="border-secondary"
      onClick={handleCopy}
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <IconLink className="h-4 w-4" />
      )}
    </Button>
  );
};

export default CopyLinkButton;