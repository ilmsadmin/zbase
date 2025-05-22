import { useState, useRef, ChangeEvent, forwardRef } from 'react';
import { 
  ArrowUpTrayIcon, 
  DocumentIcon, 
  XMarkIcon, 
  ExclamationCircleIcon 
} from '@heroicons/react/24/outline';

export interface FileUploadProps {
  label?: string;
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  error?: string;
  hint?: string;
  onChange?: (files: File[]) => void;
  name?: string;
  id?: string;
  containerClassName?: string;
  disabled?: boolean;
  className?: string;
  preview?: boolean;
  previewMaxCount?: number;
}

const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  (
    {
      label,
      accept,
      multiple = false,
      maxSizeMB = 5,
      error,
      hint,
      onChange,
      name,
      id,
      containerClassName = '',
      disabled = false,
      className = '',
      preview = true,
      previewMaxCount = 5,
      ...props
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [fileList, setFileList] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const [localError, setLocalError] = useState<string | undefined>(error);
    
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    
    const isImage = (file: File) => {
      return file.type.startsWith('image/');
    };
    
    const resetFileInput = () => {
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    };
    
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files;
      if (!selectedFiles || selectedFiles.length === 0) return;
      
      handleFiles(Array.from(selectedFiles));
    };
    
    const handleFiles = (files: File[]) => {
      setLocalError(undefined);
      
      // Validate file size
      const oversizedFiles = files.filter(file => file.size > maxSizeBytes);
      if (oversizedFiles.length > 0) {
        setLocalError(`Một hoặc nhiều tệp vượt quá kích thước tối đa ${maxSizeMB}MB`);
        resetFileInput();
        return;
      }
      
      // Get final list of files (replace or add to existing)
      const newFileList = multiple ? [...fileList, ...files] : files;
      setFileList(newFileList);
      
      // Generate preview URLs
      if (preview) {
        const newPreviewUrls: string[] = [];
        newFileList.forEach(file => {
          if (isImage(file)) {
            newPreviewUrls.push(URL.createObjectURL(file));
          } else {
            newPreviewUrls.push('');
          }
        });
        
        // Revoke old preview URLs to avoid memory leaks
        previewUrls.forEach(url => {
          if (url) URL.revokeObjectURL(url);
        });
        
        setPreviewUrls(newPreviewUrls);
      }
      
      // Call onChange callback
      if (onChange) {
        onChange(newFileList);
      }
    };
    
    const handleDrag = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (disabled) return;
      
      if (e.type === 'dragenter' || e.type === 'dragover') {
        setDragActive(true);
      } else if (e.type === 'dragleave') {
        setDragActive(false);
      }
    };
    
    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (disabled) return;
      
      setDragActive(false);
      
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const droppedFiles = Array.from(e.dataTransfer.files);
        handleFiles(multiple ? droppedFiles : [droppedFiles[0]]);
      }
    };
    
    const removeFile = (index: number) => {
      const newFileList = [...fileList];
      newFileList.splice(index, 1);
      setFileList(newFileList);
      
      if (preview && previewUrls[index]) {
        URL.revokeObjectURL(previewUrls[index]);
        const newPreviewUrls = [...previewUrls];
        newPreviewUrls.splice(index, 1);
        setPreviewUrls(newPreviewUrls);
      }
      
      // Call onChange callback with updated list
      if (onChange) {
        onChange(newFileList);
      }
    };
    
    const triggerFileInput = () => {
      inputRef.current?.click();
    };
    
    return (
      <div className={`${containerClassName}`}>
        {label && (
          <label
            htmlFor={id || name}
            className={`block text-sm font-medium ${disabled ? 'text-gray-400' : localError || error ? 'text-red-700' : 'text-gray-700'} mb-1`}
          >
            {label}
          </label>
        )}
        
        {/* File input */}
        <input
          ref={(node) => {
            if (ref) {
              if (typeof ref === 'function') {
                ref(node);
              } else {
                ref.current = node;
              }
            }
            inputRef.current = node;
          }}
          type="file"
          id={id || name}
          name={name}
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          className="sr-only"
          onChange={handleFileChange}
          {...props}
        />
        
        {/* Drop zone */}
        <div
          onClick={disabled ? undefined : triggerFileInput}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-md p-6 text-center
            ${disabled ? 'bg-gray-100 border-gray-300 cursor-not-allowed' : dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 cursor-pointer'}
            ${localError || error ? 'border-red-300 bg-red-50' : ''}
            ${className}
          `}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <ArrowUpTrayIcon className={`h-8 w-8 ${disabled ? 'text-gray-400' : localError || error ? 'text-red-500' : 'text-gray-500'}`} />
            
            <div className="text-sm">
              <span className={`font-medium ${disabled ? 'text-gray-400' : localError || error ? 'text-red-700' : 'text-gray-900'}`}>
                {multiple ? 'Kéo thả hoặc chọn nhiều tệp' : 'Kéo thả hoặc chọn tệp'}
              </span>
              <p className={`${disabled ? 'text-gray-400' : localError || error ? 'text-red-700' : 'text-gray-500'}`}>
                {accept ? `Chấp nhận: ${accept}` : 'Tất cả các loại tệp'}
              </p>
              <p className={`${disabled ? 'text-gray-400' : localError || error ? 'text-red-700' : 'text-gray-500'}`}>
                Tối đa {maxSizeMB}MB {multiple && '/ tệp'}
              </p>
            </div>
          </div>
        </div>
        
        {/* File preview */}
        {preview && fileList.length > 0 && (
          <ul className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {fileList.slice(0, previewMaxCount).map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className="relative group rounded-md border border-gray-300 p-2"
              >
                <div className="flex items-center space-x-2">
                  {isImage(file) && previewUrls[index] ? (
                    <div className="w-12 h-12 flex-shrink-0 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden">
                      <img
                        src={previewUrls[index]}
                        alt={file.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 flex-shrink-0 rounded-md bg-gray-100 flex items-center justify-center">
                      <DocumentIcon className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  
                  <div className="overflow-hidden">
                    <p className="text-xs font-medium text-gray-700 truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(1)}KB
                    </p>
                  </div>
                </div>
                
                {!disabled && (
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                  >
                    <XMarkIcon className="h-4 w-4 text-gray-500 hover:text-red-500" />
                  </button>
                )}
              </li>
            ))}
            
            {fileList.length > previewMaxCount && (
              <li className="flex items-center justify-center border border-gray-300 rounded-md p-2 bg-gray-50">
                <span className="text-sm text-gray-500">
                  +{fileList.length - previewMaxCount} tệp
                </span>
              </li>
            )}
          </ul>
        )}
        
        {/* File count (if not showing preview) */}
        {!preview && fileList.length > 0 && (
          <div className="mt-2 text-sm text-gray-500">
            Đã chọn {fileList.length} {fileList.length === 1 ? 'tệp' : 'tệp'}
          </div>
        )}
        
        {/* Error message */}
        {(localError || error || hint) && (
          <div className="flex items-start mt-1">
            {(localError || error) && (
              <ExclamationCircleIcon className="h-4 w-4 text-red-500 mt-0.5 mr-1 flex-shrink-0" />
            )}
            <p className={`text-sm ${localError || error ? 'text-red-600' : 'text-gray-500'}`}>
              {localError || error || hint}
            </p>
          </div>
        )}
      </div>
    );
  }
);

FileUpload.displayName = 'FileUpload';

export default FileUpload;
