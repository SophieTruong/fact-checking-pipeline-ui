'use client';

import { useState } from 'react';

interface DocToClaimInputProps {
  onSubmit: (text: string) => void;
  isDisabled?: boolean;
}

export default function DocToClaimInput({ onSubmit, isDisabled = false }: DocToClaimInputProps) {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isDisabled) return;

    setIsLoading(true);
    try {
      await onSubmit(text);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <hr className="border-t border-gray-700" />
      <div>
      <h1 className="text-2xl font-bold text-white mb-4">Detect Claims from Text</h1>
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
        {/* <label htmlFor="text" className="block text-sm font-medium text-gray-200 mb-2">
          Enter a text document to detect claims from
        </label> */}
        <textarea
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-64 p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
          placeholder="Enter a text document to detect claims from..."
          disabled={isDisabled}
        />
      </div>
      <div className="flex gap-4">
        <button
          type="button"
          onClick={handleClear}
          disabled={isDisabled || !text.trim()}
          className="flex-1 px-4 py-2 bg-gray-500 text-black rounded-md hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Clear
        </button>
        <button
          type="submit"
          disabled={isLoading || !text.trim() || isDisabled}
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Processing...' : isDisabled ? 'Processing Claims...' : 'Submit'}
        </button>
      </div>
    </form>
  );
} 