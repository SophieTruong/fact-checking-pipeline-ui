import { LogPanelProps } from './types';

export const LogPanel: React.FC<LogPanelProps> = ({ logs }) => (
  <div className="mt-4">
    <h3 className="text-sm font-medium text-gray-700 mb-2">Update Logs:</h3>
    <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-auto max-h-[200px] text-black">
      {logs.join('\n')}
    </pre>
  </div>
); 