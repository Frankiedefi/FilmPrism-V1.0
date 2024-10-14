import React from 'react';

type LLMOption = 'cohere';

interface LLMSelectorProps {
  selectedLLM: LLMOption;
  onSelectLLM: (llm: LLMOption) => void;
}

function LLMSelector({ selectedLLM, onSelectLLM }: LLMSelectorProps) {
  return (
    <div className="flex items-center bg-indigo-100 p-2 rounded-md">
      <label htmlFor="llm-select" className="text-sm font-medium text-indigo-700 mr-2">
        AI Model:
      </label>
      <select
        id="llm-select"
        value={selectedLLM}
        onChange={(e) => onSelectLLM(e.target.value as LLMOption)}
        className="block pl-3 pr-10 py-1 text-base border-indigo-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white"
      >
        <option value="cohere">Cohere</option>
      </select>
    </div>
  );
}

export default LLMSelector;