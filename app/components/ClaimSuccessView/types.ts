import { ClaimDetectionResponse } from '../../types/claim';

export interface SuccessViewProps {
  data: ClaimDetectionResponse;
  onBack: () => void;
}

export interface EditingState {
  [key: string]: boolean;
}

export interface Claim {
  id: string;
  text: string;
  created_at: string;
}

export interface Inference {
  claim_id: string;
  claim_detection_model_id: string;
  label: boolean;
  created_at: string;
  updated_at: string;
}

export interface ClaimWithInference {
  claim: Claim;
  inference: Inference;
}

export interface ClaimCardProps {
  claimWithInference: ClaimWithInference;
  isEditing: boolean;
  currentText: string;
  isUpdating: boolean;
  onTextChange: (text: string) => void;
  onInferenceChange: (label: boolean) => void;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onFactCheck: (claim: string, checkDate?: string) => void;
}

export interface LogPanelProps {
  logs: string[];
}

export interface VectorDBResult {
  id: string;
  score: number;
  source: string;
  created_at: string;
  text: string;
  label: string;
  url: string;
}

export interface WebSearchResult {
  result: {
    title?: string;
    source: string;
    author: string | null;
    snippet?: string;
    link?: string;
    article_published_time?: string;
    article_modified_time?: string | null;
    processed_text?: string;
    statement?: string;
    statement_originator?: string;
    verdict?: string;
    statement_date?: string;
    statement_source?: string;
    factchecker?: string;
    factcheck_date?: string;
    factcheck_analysis_link?: string;
  };
  similarity: number;
}

export interface FactCheckResponse {
  claim: string;
  vector_db_results: VectorDBResult[];
  web_search_results: WebSearchResult[];
} 