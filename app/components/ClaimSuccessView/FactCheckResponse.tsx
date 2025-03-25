import type { FactCheckResponse } from './types';
import { VectorDBResult, WebSearchResult } from './types';

interface FactCheckResponseProps {
  response: FactCheckResponse;
}

export function FactCheckResponse({ response }: FactCheckResponseProps) {
  return (
    <div className="mt-6 space-y-6">
      <div className="bg-gray-800 border border-gray-700 p-4 rounded-md shadow-sm">
        <h3 className="text-lg font-semibold mb-2 text-white">Original Claim</h3>
        <p className="text-gray-200">{response.claim}</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-white">Vector Database Results</h3>
        {response.vector_db_results && response.vector_db_results.length > 0 ? (
          <div className="space-y-4">
            {response.vector_db_results.slice(0, 3).map((result: VectorDBResult, index: number) => (
              <div key={result.id} className="bg-gray-800 border border-gray-700 p-4 rounded-md shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-white">Source {index + 1}</span>
                  <span className="text-sm text-gray-400">Score: {(result.score * 100).toFixed(2)}%</span>
                </div>
                <p className="text-gray-200 mb-2">{result.text}</p>
                <div className="text-sm text-gray-400">
                  <p>Source: {result.source}</p>
                  <p>Date: {result.created_at}</p>
                  {result.url && <p>URL: {result.url}</p>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No matching sources found in vector database</p>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-white">Web Search Results</h3>
        {response.web_search_results && response.web_search_results.length > 0 ? (
          <div className="space-y-4">
            {response.web_search_results.slice(0, 3).map((result: WebSearchResult, index: number) => {
              const r = result.result;
              return (
                <div key={index} className="bg-gray-800 border border-gray-700 p-4 rounded-md shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-white">Result {index + 1}</span>
                    <span className="text-sm text-gray-400">Similarity: {(result.similarity * 100).toFixed(2)}%</span>
                  </div>
                  {r.title && <h4 className="font-medium text-white mb-2">{r.title}</h4>}
                  <div className="text-sm text-gray-400 mb-2">
                    <p>Source: {r.source}</p>
                    {r.factchecker && <p>Factchecker: {r.factchecker}</p>}
                    {r.factcheck_date && <p>Date: {r.factcheck_date}</p>}
                  </div>
                  {r.snippet && (
                    <div className="mb-2">
                      <p className="text-sm font-medium text-white">Snippet:</p>
                      <p className="text-sm text-gray-200">{r.snippet}</p>
                    </div>
                  )}
                  {r.statement && (
                    <div className="mb-2">
                      <p className="text-sm font-medium text-white">Statement:</p>
                      <p className="text-sm text-gray-200">{r.statement}</p>
                    </div>
                  )}
                  {r.verdict && (
                    <p className="font-medium text-white">
                      Verdict: <span className={r.verdict.toLowerCase().includes('true') ? 'text-green-400' : 'text-red-400'}>{r.verdict}</span>
                    </p>
                  )}
                  {r.factcheck_analysis_link && (
                    <p className="text-sm text-gray-400">
                      Analysis Link: {r.factcheck_analysis_link}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-400">No web search results found</p>
        )}
      </div>
    </div>
  );
} 