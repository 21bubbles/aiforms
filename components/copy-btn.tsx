"use client";
import { Clipboard } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "./ui/button";


const CopyBtn = ({ text }: {
  text: string
}) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard');
    })
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button onClick={() => copyToClipboard(text)} className="text-slate-50 absolute p-2 right-0 top-0"><Clipboard /></Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Copy code</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>

  )
}

export default CopyBtn;