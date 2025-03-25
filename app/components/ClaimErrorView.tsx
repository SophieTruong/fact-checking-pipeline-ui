interface ClaimErrorViewProps {
  error: string;
  onBack: () => void;
}

export default function ClaimErrorView({ error, onBack }: ClaimErrorViewProps) {
  return (
    <div className="p-4 bg-red-100 text-red-700 rounded-md">
      <p className="mb-4">{error}</p>
      <button
        onClick={onBack}
        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
      >
        Back to ClaimInput
      </button>
    </div>
  );
} 