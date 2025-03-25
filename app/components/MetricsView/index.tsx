import { useState } from 'react';

interface ClaimDetectionMetrics {
  start_date: string;
  end_date: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  f1_micro: number;
  f1_macro: number;
  f1_weighted: number;
  sample_count: number;
}

interface EvidenceRetrievalMetrics {
  start_date: string;
  end_date: string;
  query_count: number;
  freq_empty_milvus_hybrid_search: number;
  freq_empty_web_search: number;
  frq_close_match_websearch: number;
  frq_close_match_milvus_hybrid_search: number;
  n_exact_match_websearch: number;
  milvus_hybrid_search_score_max: number;
  web_search_score_max: number;
  example_claim_no_evidence_milvus_hybrid_search: null | {
    claim_text: string;
  };
  example_claim_no_evidence_web_search: null | {
    claim_text: string;
  } ;
  example_claim_high_match_websearch: null | {
    claim_text: string;
  };
  example_claim_high_match_milvus_hybrid_search: null | {
    claim_text: string;
  };
}

interface MetricsResponse {
  claim_detection_metrics: ClaimDetectionMetrics;
  evidence_retrieval_metrics: EvidenceRetrievalMetrics;
}

export function MetricsView() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://craicis-dime.cs.aalto.fi/pipeline_metrics?start_date=${startDate}&end_date=${endDate}`,
        {
          headers: {
            'accept': 'application/json',
            'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ''
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch metrics: ${await response.text()}`);
      }

      const data = await response.json();
      setMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Pipeline Metrics</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
          />
        </div>
      </div>

      <button
        onClick={fetchMetrics}
        disabled={isLoading}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
      >
        {isLoading ? 'Loading...' : 'Fetch Metrics'}
      </button>

      {error && (
        <div className="p-4 bg-red-900 text-white rounded-md">
          {error}
        </div>
      )}

      {metrics && (
        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-white">Claim Detection Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400">Accuracy</p>
                <p className="text-white">{(metrics.claim_detection_metrics.accuracy * 100).toFixed(2)}%</p>
              </div>
              <div>
                <p className="text-gray-400">Precision</p>
                <p className="text-white">{(metrics.claim_detection_metrics.precision * 100).toFixed(2)}%</p>
              </div>
              <div>
                <p className="text-gray-400">Recall</p>
                <p className="text-white">{(metrics.claim_detection_metrics.recall * 100).toFixed(2)}%</p>
              </div>
              <div>
                <p className="text-gray-400">F1 Score</p>
                <p className="text-white">{(metrics.claim_detection_metrics.f1_score * 100).toFixed(2)}%</p>
              </div>
              <div>
                <p className="text-gray-400">Sample Count</p>
                <p className="text-white">{metrics.claim_detection_metrics.sample_count}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-white">Evidence Retrieval Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400">Query Count</p>
                <p className="text-white">{metrics.evidence_retrieval_metrics.query_count}</p>
              </div>
              <div>
                <p className="text-gray-400">Close Match Web Search Frequency</p>
                <p className="text-white">{(metrics.evidence_retrieval_metrics.frq_close_match_websearch * 100).toFixed(2)}%</p>
              </div>
              <div>
                <p className="text-gray-400">Web Search Max Cosine Similarity</p>
                <p className="text-white">{(metrics.evidence_retrieval_metrics.web_search_score_max * 100).toFixed(2)}%</p>
              </div>
              <div>
                <p className="text-gray-400">Close Match Milvus Hybrid Search Frequency</p>
                <p className="text-white">{(metrics.evidence_retrieval_metrics.frq_close_match_milvus_hybrid_search * 100).toFixed(2)}%</p>
              </div>
              <div>
                <p className="text-gray-400">Milvus Hybrid Search Max Rank Score</p>
                <p className="text-white">{(metrics.evidence_retrieval_metrics.milvus_hybrid_search_score_max * 100).toFixed(2)}%</p>
              </div>
            </div>

            {metrics.evidence_retrieval_metrics.example_claim_high_match_websearch && (
              <div className="mt-4">
                <h4 className="text-lg font-medium text-white mb-2">Example High Match Claim From Web Search</h4>
                <p className="text-gray-300">{metrics.evidence_retrieval_metrics.example_claim_high_match_websearch.claim_text}</p>
              </div>
            )}
            {metrics.evidence_retrieval_metrics.example_claim_no_evidence_web_search && (
              <div className="mt-4">
                <h4 className="text-lg font-medium text-white mb-2">Example No Evidence Claim From Web Search</h4>
                <p className="text-gray-300">{metrics.evidence_retrieval_metrics.example_claim_no_evidence_web_search.claim_text}</p>
              </div>
            )}
            {metrics.evidence_retrieval_metrics.example_claim_no_evidence_milvus_hybrid_search && (
              <div className="mt-4">
                <h4 className="text-lg font-medium text-white mb-2">Example No Evidence Claim From Milvus Hybrid Search</h4>
                <p className="text-gray-300">{metrics.evidence_retrieval_metrics.example_claim_no_evidence_milvus_hybrid_search.claim_text}</p>
              </div>
            )}
            {metrics.evidence_retrieval_metrics.example_claim_high_match_milvus_hybrid_search && (
              <div className="mt-4">
                <h4 className="text-lg font-medium text-white mb-2">Example High Match Claim From Milvus Hybrid Search</h4>
                <p className="text-gray-300">{metrics.evidence_retrieval_metrics.example_claim_high_match_milvus_hybrid_search.claim_text}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 