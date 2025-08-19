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
        <h3 className="text-lg font-semibold mb-4 text-white">News Archive Database Results</h3>
        <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
          <p className="text-gray-300 text-sm leading-relaxed">
            The following results list the most relevant sources for the original claim. Our database includes:
          </p>
          <ul className="mt-2 mb-3 text-sm text-gray-300 space-y-1">
            <li className="flex items-center">
              <span className="text-blue-400 mr-2">•</span>
              News articles from YLE, Iltalehti, and Ilta-Sanomat (2019-2024) covering COVID-19, Ukraine war, and Gaza war.
            </li>
            <li className="flex items-center">
              <span className="text-blue-400 mr-2">•</span>
              Facebook posts and comments from Finnish news (e.g., Ilta-Sanomat, Helsingin Sanomat, Vantaan Sanomat) and international news (e.g., USA Today, Guardian US) from 2016 to 2024.
            </li>
          </ul>
        </div>
        {response.vector_db_results && response.vector_db_results.news_archive.length > 0 ? (
          <div className="space-y-4">
            {response.vector_db_results.news_archive.slice(0, 3).map((result: VectorDBResult, index: number) => (
              <div key={result.id} className="bg-gray-800 border border-gray-700 p-4 rounded-md shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-white">Source {index + 1}</span>
                  <span className="text-sm text-gray-400 group relative">
                    Score: {(result.score).toFixed(3)}
                    <span className="inline-flex items-center group">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 cursor-help">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061 3 3 0 112.871 5.026v.345a.75.75 0 01-1.5 0v-.5c0-.72.57-.75 1.5-.75a1.5 1.5 0 100-3zm.5 6.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" clipRule="evenodd" />
                      </svg>
                      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                        A score between 0-1 showing how closely the content matches your query, combining both keyword and semantic search result ranking.
                      </span>
                    </span>
                  </span>
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
          <p className="text-gray-400">No matching sources found in archived news sources.</p>
        )}
        {response.vector_db_results && response.vector_db_results.facebook_post.length > 0 ? (
          <div className="space-y-4">
            {response.vector_db_results.facebook_post.slice(0, 3).map((result: VectorDBResult, index: number) => (
              <div key={result.id} className="bg-gray-800 border border-gray-700 p-4 rounded-md shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-white">Source {index + 1}</span>
                  <span className="text-sm text-gray-400 group relative">
                    Score: {(result.score).toFixed(3)}
                    <span className="inline-flex items-center group">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 cursor-help">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061 3 3 0 112.871 5.026v.345a.75.75 0 01-1.5 0v-.5c0-.72.57-.75 1.5-.75a1.5 1.5 0 100-3zm.5 6.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" clipRule="evenodd" />
                      </svg>
                      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                        A score between 0-1 showing how closely the content matches your query, combining both keyword and semantic search result ranking.
                      </span>
                    </span>
                  </span>
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
          <p className="text-gray-400">No matching sources found in Facebook posts.</p>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-white">Web Search Results</h3>
        <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
          <p className="text-gray-300 text-sm leading-relaxed mb-3">
            The following results are the most relevant fact-checks for the claim from popular fact-checking organizations:
          </p>
          <ul className="mb-3 text-sm text-gray-300 space-y-1">
            <li className="flex items-center">
              <span className="text-blue-400 mr-2">•</span>
              FactCheck.org
            </li>
            <li className="flex items-center">
              <span className="text-blue-400 mr-2">•</span>
              Full Fact
            </li>
            <li className="flex items-center">
              <span className="text-blue-400 mr-2">•</span>
              Snopes
            </li>
            <li className="flex items-center">
              <span className="text-blue-400 mr-2">•</span>
              PolitiFact
            </li>
          </ul>
          <p className="text-gray-400 text-sm italic">
            Note: Result formats may vary depending on the source organization.
          </p>
        </div>
        {response.web_search_results && response.web_search_results.length > 0 ? (
          <div className="space-y-4">
            {response.web_search_results.slice(0, 3).map((result: WebSearchResult, index: number) => {
              const r = result.result;
              return (
                <div key={index} className="bg-gray-800 border border-gray-700 p-4 rounded-md shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-white">Result {index + 1}</span>
                    <span className="text-sm text-gray-400 group relative">
                      Similarity: {(result.similarity).toFixed(3)}
                      <span className="inline-flex items-center group">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 cursor-help">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061 3 3 0 112.871 5.026v.345a.75.75 0 01-1.5 0v-.5c0-.72.57-.75 1.5-.75a1.5 1.5 0 100-3zm.5 6.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" clipRule="evenodd" />
                      </svg>
                      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                      Cosine similarity (1 = identical, 0 = completely different)
                      </span>
                    </span>
                    </span>
                  </div>
                  {r.title && <h4 className="font-medium text-white mb-2">{r.title}</h4>}
                  <div className="text-sm text-gray-400 mb-2">
                    <p>Source: {r.source}</p>
                    {r.factchecker && <p>Factchecker: {r.factchecker}</p>}
                    {r.factcheck_date && <p>Factcheck Date: {r.factcheck_date}</p>}
                    {r.article_published_time && <p>Published Date: {r.article_published_time}</p>}
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
                  {r.link && (
                    <p className="text-sm text-gray-400">
                      Link: {r.link}
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