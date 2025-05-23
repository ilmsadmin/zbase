"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { useUpdateCustomer } from '@/hooks/useCustomers';
import { useToast } from '@/hooks/useToast';

interface CustomerNotesSectionProps {
  customerId: string;
  initialNotes: string;
}

export function CustomerNotesSection({ customerId, initialNotes }: CustomerNotesSectionProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [isEditing, setIsEditing] = useState(false);
  const [originalNotes, setOriginalNotes] = useState(initialNotes);
  const { toast } = useToast();
  
  const updateCustomer = useUpdateCustomer();
  
  const handleEditClick = () => {
    setIsEditing(true);
    setOriginalNotes(notes);
  };
  
  const handleCancelClick = () => {
    setIsEditing(false);
    setNotes(originalNotes);
  };
  
  const handleSaveClick = async () => {
    try {
      await updateCustomer.mutateAsync({
        id: customerId,
        data: { notes }
      });
      
      setIsEditing(false);
      setOriginalNotes(notes);
      
      toast({
        title: "Success",
        description: "Customer notes updated successfully",
      });
    } catch (error) {
      // Error is handled by the useMutationWithErrorHandling hook
      console.error('Failed to update notes:', error);
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Customer Notes</CardTitle>
        {isEditing ? (
          <div className="space-x-2">
            <Button variant="outline" size="sm" onClick={handleCancelClick}>
              Cancel
            </Button>
            <Button 
              size="sm" 
              onClick={handleSaveClick}
              disabled={updateCustomer.isPending}
            >
              {updateCustomer.isPending ? 'Saving...' : 'Save Notes'}
            </Button>
          </div>
        ) : (
          <Button variant="outline" size="sm" onClick={handleEditClick}>
            Edit Notes
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={8}
            placeholder="Enter notes about this customer..."
          />
        ) : (
          <div className="p-4 bg-gray-50 rounded-md min-h-[200px] whitespace-pre-wrap">
            {notes ? notes : (
              <span className="text-gray-400">No notes for this customer. Click 'Edit Notes' to add information.</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
