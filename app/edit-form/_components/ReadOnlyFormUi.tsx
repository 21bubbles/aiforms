import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

interface JsonFormField {
  fieldType?: string;
  placeholder?: string;
  fieldName?: string;
  formLabel?: string;
  options?: { label: string; value: string }[]; // Unified options for select, radio, and checkbox
}

interface JsonForm {
  formTitle?: string;
  formSubheading?: string;
  formFields?: JsonFormField[];
}

interface ReadOnlyFormUiProps {
  jsonForm?: JsonForm;
  onInputChange: (fieldName: string, value: string) => void;
}

const ReadOnlyFormUi: React.FC<ReadOnlyFormUiProps> = ({ jsonForm, onInputChange }) => {
  return (
    <div className="">
      <div className="mb-4">
        <h1 className="font-bold text-center text-2xl">{jsonForm?.formTitle || "Untitled Form"}</h1>
      </div>
      <div className="mb-4">
        <h2 className="text-center text-xl">{jsonForm?.formSubheading || "No subheading provided"}</h2>
      </div>
      {jsonForm?.formFields?.map((formField, index) => (
        <div key={index} className="my-4">
          <Label>{formField?.formLabel || `Field ${index + 1}`}</Label>

          {formField?.fieldType === "select" && formField?.options ? (
            <Select onValueChange={(value) => onInputChange(formField.fieldName || `field-${index}`, value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={formField.placeholder || "Select"} />
              </SelectTrigger>
              <SelectContent>
                {formField.options.map((option, idx) => (
                  <SelectItem key={idx} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : formField?.fieldType === "radio" && formField?.options ? (
            <RadioGroup onValueChange={(value) => onInputChange(formField.fieldName || `field-${index}`, value)}>
              {formField.options.map((option, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={option.value}
                    id={`radio-${index}-${idx}`}
                  />
                  <Label htmlFor={`radio-${index}-${idx}`}>
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          ) : formField?.fieldType === "checkbox" && formField?.options ? (
            <div>
              {formField.options.map((option, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`checkbox-${index}-${idx}`}
                    onCheckedChange={(checked) => 
                      onInputChange(formField.fieldName || `field-${index}`, checked ? option.value : '')
                    }
                  />
                  <Label htmlFor={`checkbox-${index}-${idx}`}>
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          ) : (
            <Input
              type={formField?.fieldType || "text"}
              placeholder={formField?.placeholder || ""}
              name={formField?.fieldName || `field-${index}`}
              onChange={(e) => onInputChange(formField.fieldName || `field-${index}`, e.target.value)}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ReadOnlyFormUi;