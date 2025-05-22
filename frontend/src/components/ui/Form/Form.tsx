import { ReactNode, FormEvent } from 'react';

interface FormProps {
  children: ReactNode;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  className?: string;
  id?: string;
}

export default function Form({ 
  children, 
  onSubmit, 
  className = '', 
  id 
}: FormProps) {
  return (
    <form 
      id={id} 
      className={`space-y-6 ${className}`} 
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(e);
      }}
    >
      {children}
    </form>
  );
}
