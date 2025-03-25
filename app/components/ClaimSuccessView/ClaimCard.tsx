import { useState } from 'react';

interface ClaimCardProps {
  isEditing: boolean;
  currentText: string;
  currentInference: boolean;
  isUpdating: boolean;
  onTextChange: (text: string) => void;
  onInferenceChange: (label: boolean) => void;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onFactCheck: (claim: string, checkDate?: string) => void;
}

export function ClaimCard({
  isEditing,
  currentText,
  currentInference,
  isUpdating,
  onTextChange,
  onInferenceChange,
  onEdit,
  onCancel,
  onSave,
  onFactCheck
}: ClaimCardProps) {
  const [isFactChecking, setIsFactChecking] = useState(false);
  const [checkDate, setCheckDate] = useState('');

  const handleFactCheckSubmit = () => {
    onFactCheck(currentText, checkDate || undefined);
    setIsFactChecking(false);
    setCheckDate('');
  };

  const handleCancelFactCheck = () => {
    setIsFactChecking(false);
    setCheckDate('');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-900">Claim Text</h3>
          {isEditing ? (
            <textarea
              value={currentText}
              onChange={(e) => onTextChange(e.target.value)}
              className="w-full p-2 border rounded-md text-gray-900"
              disabled={isUpdating}
            />
          ) : (
            <p className="text-gray-700">{currentText}</p>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-900">Is Checkable Claim?</h3>
          {isEditing ? (
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-gray-900">
                <input
                  type="radio"
                  checked={currentInference}
                  onChange={() => onInferenceChange(true)}
                  disabled={isUpdating}
                />
                <span>True</span>
              </label>
              <label className="flex items-center space-x-2 text-gray-900">
                <input
                  type="radio"
                  checked={!currentInference}
                  onChange={() => onInferenceChange(false)}
                  disabled={isUpdating}
                />
                <span>False</span>
              </label>
            </div>
          ) : (
            <p className={`font-semibold ${currentInference ? 'text-green-600' : 'text-red-600'}`}>
              {currentInference ? 'True' : 'False'}
            </p>
          )}
        </div>

        {isEditing ? (
          <div className="flex gap-4">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={isUpdating}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
            >
              {isUpdating ? 'Saving...' : 'Save'}
            </button>
          </div>
        ) : isFactChecking ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="checkDate" className="block text-sm font-medium text-gray-900 mb-2">
                Check Up To Date (Optional)
              </label>
              <input
                type="date"
                id="checkDate"
                value={checkDate}
                onChange={(e) => setCheckDate(e.target.value)}
                className="w-full p-2 border rounded-md text-gray-900"
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleCancelFactCheck}
                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleFactCheckSubmit}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Submit
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-4">
            <button
              onClick={onEdit}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Edit
            </button>
            <button
              onClick={() => setIsFactChecking(true)}
              className="flex-1 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Fact Check
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 