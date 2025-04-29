'use client';

import { useState } from 'react';

interface SmartInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholderText: string;
}

export default function SmartInput({
  placeholderText,
  value,
  onChange,
  ...props
}: SmartInputProps) {
  const [placeholder, setPlaceholder] = useState(placeholderText);

  const handleFocus = () => {
    if (!value) setPlaceholder('');
  };

  const handleBlur = () => {
    if (!value) setPlaceholder(placeholderText);
  };

  return (
    <input
      {...props}
      value={value}
      onChange={onChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholder={placeholder}
      className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
    />
  );
}
