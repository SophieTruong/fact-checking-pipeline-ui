import { useState } from 'react';

interface ClaimFactCheckProps {
  initialClaim?: string;
  onSubmit: (claim: string, checkDate?: string) => void;
  isDisabled?: boolean;
  className?: string;
}

export default function ClaimFactCheck({ 
  initialClaim = '', 
  onSubmit, 
  isDisabled = false,
  className = ''
}: ClaimFactCheckProps) {
  const [claim, setClaim] = useState(initialClaim);
  const [checkDate, setCheckDate] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claim.trim() || isDisabled) return;

    setIsLoading(true);
    try {
      await onSubmit(claim, checkDate || undefined);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setClaim('');
    setCheckDate('');
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <div>
        <label htmlFor="claim" className="block text-sm font-medium text-gray-700 mb-2">
          Claim to Fact Check
        </label>
        <textarea
          id="claim"
          value={claim}
          onChange={(e) => setClaim(e.target.value)}
          className="w-full h-32 p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
          placeholder="Enter a claim to fact check..."
          disabled={isDisabled}
        />
      </div>

      <div>
        <label htmlFor="checkDate" className="block text-sm font-medium text-gray-700 mb-2">
        Last updated (Optional)
        </label>
        <input
          type="date"
          id="checkDate"
          value={checkDate}
          onChange={(e) => setCheckDate(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
          disabled={isDisabled}
        />
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={handleClear}
          disabled={isDisabled || (!claim.trim() && !checkDate)}
          className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Clear
        </button>
        <button
          type="submit"
          disabled={isLoading || !claim.trim() || isDisabled}
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Checking...' : 'Check Claim'}
        </button>
      </div>
    </form>
  );
} 