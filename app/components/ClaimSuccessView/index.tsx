import { useState } from 'react';
import { ClaimCard } from './ClaimCard';
import { LogPanel } from './LogPanel';
import { ClaimDetectionResponse } from '../../types/claim';
import { API_CONFIG } from './api';
import { FactCheckResponse } from './FactCheckResponse';
import type { FactCheckResponse as FactCheckResponseType } from './types';

interface ClaimSuccessViewProps {
  data: ClaimDetectionResponse;
  onBack: () => void;
  onFactCheck: (claim: string, checkDate?: string) => void;
  factCheckResponse: FactCheckResponseType | null;
}

export default function ClaimSuccessView({ data, onBack, onFactCheck, factCheckResponse }: ClaimSuccessViewProps) {
  const [claims, setClaims] = useState(data.claims);
  const [logs, setLogs] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [editedClaims, setEditedClaims] = useState<Record<string, { text: string; inference: boolean }>>({});
  const [emptyClaimIds, setEmptyClaimIds] = useState<Set<string>>(new Set());

  const addLog = (message: string) => {
    console.log(message);
    const timestamp = typeof window !== 'undefined' ? new Date().toISOString() : '';
    setLogs(prev => [...prev, `${timestamp}: ${message}`]);
  };

  const logInferenceSummary = () => {
    addLog('=== Inference Label Summary ===');
    claims.forEach(claimWithInference => {
      addLog(`Claim ID: ${claimWithInference.claim.id}`);
      addLog(`- Text: ${claimWithInference.claim.text}`);
      addLog(`- Source Document ID: ${claimWithInference.claim.source_document_id}`);
      addLog(`- Created At: ${claimWithInference.claim.created_at}`);
      addLog(`- Updated At: ${claimWithInference.claim.updated_at}`);
      addLog(`- Inference Label: ${claimWithInference.inference.label ? 'True' : 'False'}`);
      addLog(`- Inference ID: ${claimWithInference.inference.id}`);
      addLog(`- Claim Detection Model ID: ${claimWithInference.inference.claim_detection_model_id}`);
      addLog(`- Inference Created At: ${claimWithInference.inference.created_at}`);
      addLog(`- Inference Updated At: ${claimWithInference.inference.updated_at}`);
      addLog('---');
    });
    addLog('=============================');
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    const claim = claims.find(c => c.claim.id === id);
    if (claim) {
      setEditedText(claim.claim.text);
    }
  };

  const handleCancel = (id: string) => {
    setEditingId(null);
    // Clear any edited changes for this claim
    setEditedClaims(prev => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
  };

  const handleInferenceChange = (id: string, newLabel: boolean) => {
    const claim = claims.find(c => c.claim.id === id);
    if (!claim) return;

    setEditedClaims(prev => ({
      ...prev,
      [id]: {
        text: prev[id]?.text ?? claim.claim.text,
        inference: newLabel
      }
    }));
  };

  const handleTextChange = (text: string) => {
    if (!editingId) return;
    
    setEditedText(text);
    setEditedClaims(prev => ({
      ...prev,
      [editingId]: {
        text,
        inference: prev[editingId]?.inference ?? claims.find(c => c.claim.id === editingId)?.inference.label ?? false
      }
    }));
  };

  const handleSave = async (id: string) => {
    const editedClaim = editedClaims[id];
    if (!editedClaim) return;

    const claim = claims.find(c => c.claim.id === id);
    if (!claim) {
      throw new Error('Claim not found');
    }

    setIsUpdating(true);
    try {
      // Check if text or inference has changed
      const textChanged = editedClaim.text !== claim.claim.text;
      const inferenceChanged = editedClaim.inference !== claim.inference.label;

      addLog(`Changes detected for claim ${id}:`);
      addLog(`- Text changed: ${textChanged}`);
      addLog(`- Inference changed: ${inferenceChanged}`);

      if (!textChanged && !inferenceChanged) {
        addLog('No changes detected, skipping API calls');
        setEditingId(null);
        setEditedText('');
        setEditedClaims(prev => {
          const newState = { ...prev };
          delete newState[id];
          return newState;
        });
        return;
      }

      // Update claim text if changed
      if (textChanged) {
        const updateData = [{
          text: editedClaim.text,
          source_document_id: claim.claim.source_document_id,
          id: claim.claim.id,
          created_at: claim.claim.created_at,
          updated_at: new Date().toISOString()
        }];

        addLog('Claim Update Request:');
        addLog(JSON.stringify(updateData, null, 2));

        const updateResponse = await fetch(`${API_CONFIG.baseUrl}/claim_detection/update`, {
          method: 'POST',
          headers: API_CONFIG.headers,
          body: JSON.stringify(updateData)
        });

        if (!updateResponse.ok) {
          const errorText = await updateResponse.text();
          addLog(`Claim Update Error Response: ${errorText}`);
          throw new Error(`Failed to update claim text: ${errorText}`);
        }
        const responseText = await updateResponse.text();
        addLog(`Claim text updated successfully: ${responseText}`);
      }

      // Update inference label if changed
      if (inferenceChanged) {
        const inferenceData = {
          claims: [{
            source_document_id: claim.claim.source_document_id,
            claim_id: claim.claim.id,
            claim_text: claim.claim.text,
            binary_label: editedClaim.inference,
            text_label: ""
          }]
        };

        addLog('Inference Update Request:');
        addLog(JSON.stringify(inferenceData, null, 2));

        const inferenceResponse = await fetch(`${API_CONFIG.baseUrl}/claim_annotation/insert`, {
          method: 'POST',
          headers: API_CONFIG.headers,
          body: JSON.stringify(inferenceData)
        });

        if (!inferenceResponse.ok) {
          const errorText = await inferenceResponse.text();
          addLog(`Inference Update Error Response: ${errorText}`);
          throw new Error(`Failed to update inference label: ${errorText}`);
        }
        addLog('Inference label updated successfully');
      }

      // Update local state only after API calls succeed
      setClaims(prevClaims => 
        prevClaims.map(claim => 
          claim.claim.id === id
            ? {
                ...claim,
                claim: { ...claim.claim, text: editedClaim.text },
                inference: { ...claim.inference, label: editedClaim.inference }
              }
            : claim
        )
      );

      // Track empty claims
      if (editedClaim.text.length === 0) {
        addLog(`Claim ${id} is empty, adding to filter list`);
        setEmptyClaimIds(prev => new Set([...prev, id]));
      } else {
        addLog(`Claim ${id} is not empty, removing from filter list`);
        setEmptyClaimIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }

      // Log inference summary after any changes
      logInferenceSummary();

      addLog(` ${id}:`);
      if (textChanged) addLog(`- New text: ${editedClaim.text}`);
      if (inferenceChanged) addLog(`- New inference: ${editedClaim.inference}`);
      addLog('---');

      // Clear edited changes for this claim
      setEditedClaims(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });

      setEditingId(null);
    } catch (error) {
      addLog(`Error updating claim ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      // Revert changes on error
      setEditedClaims(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFactCheck = async (claim: string, checkDate?: string) => {
    onFactCheck(claim, checkDate);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Claims</h2>
        <div className="flex gap-4">
          <button
            onClick={async () => {
              addLog('=== Verifying Claim Labels ===');
              logInferenceSummary();
              addLog('=== End Verification ===');

              // Prepare claims data for submission
              const claimsData = {
                claims: claims.map(claimWithInference => ({
                  source_document_id: claimWithInference.claim.source_document_id,
                  claim_id: claimWithInference.claim.id,
                  claim_text: claimWithInference.claim.text,
                  binary_label: claimWithInference.inference.label,
                  text_label: ""
                }))
              };

              addLog('Submitting claim annotations...');
              addLog(JSON.stringify(claimsData, null, 2));

              try {
                const response = await fetch('https://craicis-dime.cs.aalto.fi/claim_annotation/insert', {
                  method: 'POST',
                  headers: {
                    'accept': 'application/json',
                    'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(claimsData)
                });

                if (!response.ok) {
                  const errorText = await response.text();
                  addLog(`Error submitting annotations: ${errorText}`);
                  throw new Error(`Failed to submit annotations: ${errorText}`);
                }

                const responseText = await response.text();
                addLog(`Successfully submitted annotations: ${responseText}`);
              } catch (error) {
                addLog(`Error submitting annotations: ${error instanceof Error ? error.message : 'Unknown error'}`);
              }
            }}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 relative group"
            title="Hint"
          >
           <div className="flex items-center gap-1 relative group">
              Claim labels are accurate
              <span className="cursor-help">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061 3 3 0 112.871 5.026v.345a.75.75 0 01-1.5 0v-.5c0-.72.57-.75 1.5-.75a1.5 1.5 0 100-3zm.5 6.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" clipRule="evenodd" />
                </svg>
              </span>
              <span className="absolute bottom-full mb-2 left-0 bg-gray-800 text-white px-3 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg">
                Click this Button when all &apos;Is Checkable Claim?&apos; labels are correct after you have a chance to review and edit them
              </span>
            </div>
          </button>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Back
          </button>
        </div>
      </div>
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-3 flex items-center">What is a claim?
          <span className="relative group inline-flex">
            <sup className="text-blue-400 cursor-help ml-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061 3 3 0 112.871 5.026v.345a.75.75 0 01-1.5 0v-.5c0-.72.57-.75 1.5-.75a1.5 1.5 0 100-3zm.5 6.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" clipRule="evenodd" />
              </svg>
            </sup>
            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-96 p-4 bg-gray-900 rounded-lg shadow-lg text-sm text-gray-300 z-10">
              <p className="font-medium mb-2">L. Konstantinovskiy, O. Price, M. Babakar, and A. Zubiaga, &quot;Toward automated factchecking: Developing an annotation schema and benchmark for consistent automated claim detection,&quot; <em>Digital Threats: Research and Practice</em>, vol. 2, no. 2, pp. 1-16, 2021.</p>
            </div>
          </span>
        </h2>
        <p className="text-gray-300 mb-4">In our annotation framework, a claim falls into one of these categories:</p>
        <ul className="space-y-3">
          <li className="flex items-start">
            <span className="text-blue-400 mr-2">•</span>
            <div>
              <span className="text-gray-200 font-medium">Quantity in the past or present</span>
              <p className="text-gray-400 italic mt-1">&quot;1 in 4 people wait longer than 6 weeks to see a doctor.&quot;</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="text-blue-400 mr-2">•</span>
            <div>
              <span className="text-gray-200 font-medium">Correlation or causation</span>
              <p className="text-gray-400 italic mt-1">&quot;Tetanus vaccine causes infertility&quot;</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="text-blue-400 mr-2">•</span>
            <div>
              <span className="text-gray-200 font-medium">Current laws or rules of operation</span>
              <p className="text-gray-400 italic mt-1">&quot;The UK allows a single adult to care for fewer children than other European countries.&quot;</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="text-blue-400 mr-2">•</span>
            <div>
              <span className="text-gray-200 font-medium">Prediction</span>
              <p className="text-gray-400 italic mt-1">&quot;The IFS says that school funding will have fallen by 5% by 2019.&quot;</p>
            </div>
          </li>
        </ul>
      </div>
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-6">
          {claims
            .filter(claimWithInference => !emptyClaimIds.has(claimWithInference.claim.id))
            .map((claimWithInference) => (
            <ClaimCard
              key={claimWithInference.claim.id}
              isEditing={editingId === claimWithInference.claim.id}
              currentText={editingId === claimWithInference.claim.id 
                ? (editedClaims[claimWithInference.claim.id]?.text ?? editedText) 
                : claimWithInference.claim.text}
              currentInference={editingId === claimWithInference.claim.id
                ? (editedClaims[claimWithInference.claim.id]?.inference ?? claimWithInference.inference.label)
                : claimWithInference.inference.label}
              isUpdating={isUpdating}
              onTextChange={handleTextChange}
              onInferenceChange={(label) => handleInferenceChange(claimWithInference.claim.id, label)}
              onEdit={() => handleEdit(claimWithInference.claim.id)}
              onCancel={() => handleCancel(claimWithInference.claim.id)}
              onSave={() => handleSave(claimWithInference.claim.id)}
              onFactCheck={(claim, checkDate) => handleFactCheck(claim, checkDate)}
            />
          ))}
        </div>

        <div className="space-y-6">
          {factCheckResponse && (
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-white">Fact Check Results</h3>
              <FactCheckResponse response={factCheckResponse} />
            </div>
          )}
        </div>
      </div>

      <LogPanel logs={logs} />
    </div>
  );
} 