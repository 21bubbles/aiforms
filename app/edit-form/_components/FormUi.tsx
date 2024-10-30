"use client";
import React, { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import FieldEdit from "./FieldEdit";
import AddFieldButton from "./AddFieldButton";

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

interface FormUiProps {
  jsonForm?: JsonForm;
  onFieldUpdate: (updatedField: Partial<JsonFormField>, index: number) => void;
  onFieldDelete: (index: number) => void;
  onAddField: (fieldType: string) => void;
  onTitleUpdate: (newTitle: string) => void;
  onSubheadingUpdate: (newSubheading: string) => void;
}

const FormUi: React.FC<FormUiProps> = ({
  jsonForm,
  onFieldUpdate,
  onFieldDelete,
  onAddField,
  onTitleUpdate,
  onSubheadingUpdate,
}) => {
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingSubheading, setEditingSubheading] = useState(false);
  const [tempTitle, setTempTitle] = useState(
    jsonForm?.formTitle || "Untitled Form"
  );
  const [tempSubheading, setTempSubheading] = useState(
    jsonForm?.formSubheading || "No subheading provided"
  );

  const handleTitleSave = () => {
    onTitleUpdate(tempTitle);
    setEditingTitle(false);
  };

  const handleSubheadingSave = () => {
    onSubheadingUpdate(tempSubheading);
    setEditingSubheading(false);
  };

  const handleUpdate = (
    index: number,
    updatedField: Partial<JsonFormField>
  ) => {
    onFieldUpdate(updatedField, index);
  };

  return (
    <div className="border border-secondary text-text p-5 rounded-md">
      <div className="mb-4">
        {editingTitle ? (
          <div className="flex items-center">
            <Input
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              className="text-2xl border border-accent"
            />
            <Button onClick={handleTitleSave} className="ml-2">
              Save
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <h1 className="font-bold text-center text-2xl">
              {jsonForm?.formTitle || "Untitled Form"}
            </h1>
            <Button
              variant="default"
              size="sm"
              onClick={() => setEditingTitle(true)}
              className="ml-2 hover:bg-accent"
            >
              <Edit size={16} />
            </Button>
          </div>
        )}
      </div>
      <div className="mb-4">
        {editingSubheading ? (
          <div className="flex items-center">
            <Input
              value={tempSubheading}
              onChange={(e) => setTempSubheading(e.target.value)}
              className="text-xl border border-accent"
            />
            <Button onClick={handleSubheadingSave} className="ml-2">
              Save
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <h2 className="text-center text-xl">
              {jsonForm?.formSubheading || "No subheading provided"}
            </h2>
            <Button
              variant="default"
              size="sm"
              onClick={() => setEditingSubheading(true)}
              className="ml-2 hover:bg-accent"
            >
              <Edit size={16} />
            </Button>
          </div>
        )}
      </div>
      {jsonForm?.formFields?.map((formField, index) => (
        <div key={index} className="my-4">
          <div className="flex justify-between my-2">
            <label>{formField?.formLabel || `Field ${index + 1}`}</label>
            <div className="flex flex-row gap-2">
              <FieldEdit
                defaultValue={formField}
                onUpdate={(updatedField) => handleUpdate(index, updatedField)}
                onDelete={() => onFieldDelete(index)}
              />
            </div>
          </div>

          {formField?.fieldType === "select" && formField?.options ? (
            <Select>
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
            <RadioGroup defaultValue={formField.options[0]?.value || ""}>
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
                  <Checkbox id={`checkbox-${index}-${idx}`} />
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
            />
          )}
        </div>
      ))}
      <div className="mt-4">
        <AddFieldButton onAddField={onAddField} />
      </div>
    </div>
  );
};

export default FormUi;