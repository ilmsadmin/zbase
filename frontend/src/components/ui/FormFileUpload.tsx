"use client";

import * as React from 'react';
import { useState } from 'react';
import { Button } from './Button';
import Image from 'next/image';

interface FormFileUploadProps {
  label?: string;
  helperText?: string;
  accept?: string;
  onChange?: (file: File | null) => void;
  onFileSelected?: (file: File) => void;
  initialPreview?: string;
  buttonText?: string;
  size?: 'default' | 'sm' | 'lg';
  fullWidth?: boolean;
}

export function FormFileUpload({
  label,
  helperText,
  accept,
  onChange,
  onFileSelected,
  initialPreview,
  buttonText = 'Choose File',
  size = 'default',
  fullWidth = false,
}: FormFileUploadProps) {
  const [preview, setPreview] = useState<string | null>(initialPreview || null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    
    if (file) {
      setFileName(file.name);
      
      // Create a preview URL for image files
      if (file.type.startsWith('image/')) {
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);
      } else {
        setPreview(null);
      }
      
      if (onChange) onChange(file);
      if (onFileSelected) onFileSelected(file);
    } else {
      setFileName(null);
      setPreview(null);
      if (onChange) onChange(null);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleClearFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setFileName(null);
    setPreview(null);
    if (onChange) onChange(null);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}
      
      <div className="flex flex-col space-y-2">
        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          ref={fileInputRef}
        />
        
        <div className={`flex ${fullWidth ? 'w-full' : ''} gap-2 items-center`}>
          <Button 
            type="button"
            onClick={handleButtonClick}
            size={size}
            variant="outline"
            className={fullWidth ? 'w-full' : ''}
          >
            {buttonText}
          </Button>
          
          {fileName && (
            <div className="flex items-center gap-2">
              <span className="text-sm truncate max-w-[200px]">{fileName}</span>
              <button
                type="button"
                onClick={handleClearFile}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                ✕
              </button>
            </div>
          )}
        </div>
        
        {preview && (
          <div className="mt-2 relative w-32 h-32 border rounded overflow-hidden">
            <Image 
              src={preview} 
              alt="Preview" 
              fill 
              className="object-cover"
            />
          </div>
        )}
      </div>

      {helperText && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}