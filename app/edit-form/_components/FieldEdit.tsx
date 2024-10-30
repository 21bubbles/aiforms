import React, { useState, useEffect } from "react";
import { Delete, Edit } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import {
//   AlertDialog,
//   AlertDialogTrigger,
//   AlertDialogContent,
//   AlertDialogTitle,
//   AlertDialogDescription,
//   AlertDialogAction,
//   AlertDialogCancel,
// } from "@/components/ui/alert-dialog";

interface FieldEditProps {
  defaultValue: {
    formLabel?: string;
    placeholder?: string;
  };
  onUpdate: (updatedField: { formLabel: string; placeholder: string }) => void;
  onDelete: () => void; // Add onDelete prop
}

const FieldEdit: React.FC<FieldEditProps> = ({
  defaultValue,
  onUpdate,
  onDelete,
}) => {
  const [formLabel, setLabel] = useState(defaultValue.formLabel || "");
  const [placeholder, setPlaceholder] = useState(
    defaultValue.placeholder || ""
  );

  useEffect(() => {
    setLabel(defaultValue.formLabel || "");
    setPlaceholder(defaultValue.placeholder || "");
  }, [defaultValue]);

  const handleSave = () => {
    onUpdate({ formLabel, placeholder });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="default" size="sm">
          <Edit size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-2">
          <Input
            value={formLabel}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Field Label"
          />
          <Input
            value={placeholder}
            onChange={(e) => setPlaceholder(e.target.value)}
            placeholder="Placeholder"
          />
          <Button variant="default" onClick={handleSave}>Save</Button>
        </div>
      </PopoverContent>

      {/* Alert Dialog for Deleting */}
      {/* <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="sm" className="text-red-500">
            <Delete size={16} />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will permanently delete the field. Do you want to
            proceed?
          </AlertDialogDescription>
          <div className="flex justify-end space-x-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog> */}
      <Button
        variant="default"
        size="sm"
        className="text-red-500"
        onClick={onDelete} // Directly trigger the delete action
      >
        <Delete size={16} />
      </Button>
    </Popover>
  );
};

export default FieldEdit;
