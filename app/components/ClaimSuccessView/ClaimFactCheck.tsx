import { useState } from 'react';

interface ClaimFactCheckProps {
  onFactCheck: (claim: string, checkDate?: string) => void;
}

export function ClaimFactCheck({ onFactCheck }: ClaimFactCheckProps) {
  const [claim, setClaim] = useState('');
  const [checkDate, setCheckDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFactCheck(claim, checkDate || undefined);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="claim" className="block text-sm font-medium text-gray-200 mb-1">
          Enter a claim to fact-check
        </label>
        <textarea
          id="claim"
          value={claim}
          onChange={(e) => setClaim(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={3}
          placeholder="Enter your claim here..."
          required
        />
      </div>

      <div>
        <label htmlFor="checkDate" className="block text-sm font-medium text-gray-200 mb-1">
        Last updated (Optional)
        </label>
        <input
          type="date"
          id="checkDate"
          value={checkDate}
          onChange={(e) => setCheckDate(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black"
      >
        Fact Check Claim
      </button>
    </form>
  );
} 