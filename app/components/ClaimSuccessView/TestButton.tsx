import { useState } from 'react';
import { API_CONFIG } from './api';

export function TestButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTest = async () => {
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/claim_detection/test`, {
        method: 'GET',
        headers: API_CONFIG.headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <button
        onClick={handleTest}
        disabled={isLoading}
        className="w-full px-4 py-2 bg-yellow-500 text-black rounded-md hover:bg-yellow-600 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold shadow-md transition-colors"
      >
        {isLoading ? 'Testing...' : 'Test API Connection'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md border border-red-200">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {response && (
        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md border border-green-200">
          <p className="font-semibold">API Response:</p>
          <pre className="mt-2 text-sm overflow-auto max-h-[200px]">
            {response}
          </pre>
        </div>
      )}
    </div>
  );
} 