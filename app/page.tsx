'use client';

import { useState } from 'react';
import DocToClaimInput from './components/DocToClaimInput';
import ClaimSuccessView from './components/ClaimSuccessView';
import ClaimErrorView from './components/ClaimErrorView';
import { FactCheckResponse } from './components/ClaimSuccessView/FactCheckResponse';
import { ClaimDetectionResponse } from './types/claim';
import { API_CONFIG } from './components/ClaimSuccessView/api';
import type { FactCheckResponse as FactCheckResponseType } from './components/ClaimSuccessView/types';
import { ClaimFactCheck } from './components/ClaimSuccessView/ClaimFactCheck';
import { MetricsView } from './components/MetricsView';

type ViewState = 'input' | 'success' | 'error' | 'factCheck' | 'metrics';

// Utility function to clean and parse JSON responses
const cleanAndParseJson = (responseText: string): FactCheckResponseType => {
  // Remove the ping line if it exists
  if (responseText.startsWith(": ping -")) {
    // Find the first occurrence of '{' to locate the start of JSON
    const jsonStart = responseText.indexOf('{');
    if (jsonStart !== -1) {
      responseText = responseText.substring(jsonStart);
    }
  }
  
  // Now parse the cleaned JSON
  try {
    return JSON.parse(responseText);
  } catch (error) {
    console.error('JSON parsing error:', error);
    throw new Error('Failed to parse response data');
  }
};

export default function Home() {
  const [viewState, setViewState] = useState<ViewState>('input');
  const [data, setData] = useState<ClaimDetectionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [factCheckResponse, setFactCheckResponse] = useState<FactCheckResponseType | null>(null);

  const handleSubmit = async (text: string) => {
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/claim_detection/insert`, {
        method: 'POST',
        headers: API_CONFIG.headers,
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        throw new Error('Failed to process text');
      }

      const result = await response.json();
      setData(result);
      setViewState('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setViewState('error');
    }
  };

  const handleBack = () => {
    setViewState('input');
    setData(null);
    setError(null);
    setFactCheckResponse(null);
  };

  const handleFactCheck = async (claim: string, checkDate?: string) => {
    setViewState('factCheck');
    try {
      const response = await fetch('https://craicis-dime.cs.aalto.fi/semantic_search/create', {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          claims: [{
            claim: claim,
            timestamp: checkDate || ""
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to fact check claim: ${await response.text()}`);
      }

      const responseText = await response.text();
      const data = cleanAndParseJson(responseText);
      setFactCheckResponse(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fact check claim');
      setViewState('error');
    }
  };

  return (
    <main className="min-h-screen p-8 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Fact-checking Pipeline</h1>
          <div className="space-x-4">
            {viewState === 'metrics' && (
              <button
                onClick={handleBack}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Back to Input
              </button>
            )}
            {viewState === 'input' && (
              <button
                onClick={() => setViewState('metrics')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Performance Monitoring Metrics
              </button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className={`space-y-6 ${viewState === 'success' ? 'lg:col-span-1' : 'lg:col-span-2'}`}>
            {viewState === 'factCheck' && data ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white">Fact Check Results</h2>
                  {factCheckResponse && <FactCheckResponse response={factCheckResponse} />}
                </div>
                <div className="space-y-6">
                  {data && (
                    <ClaimSuccessView 
                      data={data} 
                      onBack={handleBack}
                      onFactCheck={handleFactCheck}
                      factCheckResponse={null}
                    />
                  )}
                </div>
              </div>
            ) : viewState === 'factCheck' && !data ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">Fact Check Results</h2>
                  <button
                    onClick={handleBack}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    Back to Input
                  </button>
                </div>
                {factCheckResponse && <FactCheckResponse response={factCheckResponse} />}
              </div>
            ) : viewState === 'input' ? ( 
              <div className="space-y-8">
                <DocToClaimInput 
                  onSubmit={handleSubmit} 
                  isDisabled={false} 
                />
                <div className="border-t border-gray-700 pt-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Fact-check a Claim</h2>
                  <ClaimFactCheck onFactCheck={handleFactCheck} />
                </div>
              </div>
            ) : viewState === 'metrics' ? (
              <MetricsView />
            ) : null}
          </div>
          
          {viewState === 'success' && data && (
            <div className="sticky top-8">
              <div className="w-full max-w-4xl space-y-6">
                <ClaimSuccessView 
                  data={data} 
                  onBack={handleBack}
                  onFactCheck={handleFactCheck}
                  factCheckResponse={factCheckResponse}
                />
              </div>
            </div>
          )}
          
          {viewState === 'error' && error && (
            <div className="flex items-center justify-center lg:col-span-2">
              <div className="w-full max-w-4xl space-y-6">
                <ClaimErrorView error={error} onBack={handleBack} />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
