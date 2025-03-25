export interface Claim {
  text: string;
  source_document_id: string;
  id: string;
  created_at: string;
  updated_at: string;
}

export interface Inference {
  claim_id: string;
  claim_detection_model_id: string;
  label: boolean;
  id: string;
  created_at: string;
  updated_at: string;
}

export interface ClaimWithInference {
  claim: Claim;
  inference: Inference;
}

export interface ClaimDetectionResponse {
  claims: ClaimWithInference[];
}

export interface ClaimInferenceItem {
  source_document_id: string;
  claim_id: string;
  claim_text: string;
  binary_label: boolean;
  text_label: string;
}

export interface ClaimInference {
  claims: ClaimInferenceItem[];
} 