import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddFieldButtonProps {
  onAddField: (fieldType: string) => void;
}

const AddFieldButton: React.FC<AddFieldButtonProps> = ({ onAddField }) => {
  const [selectedFieldType, setSelectedFieldType] = useState<string>('');

  const handleAddField = () => {
    if (selectedFieldType) {
      onAddField(selectedFieldType);
      setSelectedFieldType('');
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus size={16} className="mr-2" /> Add Field
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-medium leading-none">Add a new field</h4>
          <Select onValueChange={setSelectedFieldType} value={selectedFieldType}>
            <SelectTrigger>
              <SelectValue placeholder="Select field type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="number">Number</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="select">Select</SelectItem>
              <SelectItem value="radio">Radio</SelectItem>
              <SelectItem value="checkbox">Checkbox</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="default" className='border border-accent' onClick={handleAddField} disabled={!selectedFieldType}>
            Add Field
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AddFieldButton;