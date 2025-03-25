'use client';

import { useState } from 'react';

interface DocToClaimInputProps {
  onSubmit: (text: string) => void;
  isDisabled?: boolean;
}

export default function DocToClaimInput({ onSubmit, isDisabled = false }: DocToClaimInputProps) {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isDisabled) return;

    setIsLoading(true);
    try {
      await onSubmit(text);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
          Enter Text
        </label>
        <textarea
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-64 p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
          placeholder="Enter your text here..."
          disabled={isDisabled}
        />
      </div>
      <div className="flex gap-4">
        <button
          type="button"
          onClick={handleClear}
          disabled={isDisabled || !text.trim()}
          className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Clear
        </button>
        <button
          type="submit"
          disabled={isLoading || !text.trim() || isDisabled}
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Processing...' : isDisabled ? 'Processing Claims...' : 'Submit'}
        </button>
      </div>
    </form>
  );
} 