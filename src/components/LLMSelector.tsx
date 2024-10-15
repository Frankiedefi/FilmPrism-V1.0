import React, { useContext } from 'react';
import { LLMContext } from '../contexts/LLMContext';

const LLMSelector: React.FC = () => {
  const { selectedLLM, setSelectedLLM } = useContext(LLMContext);

  const handleLLMChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLLM(event.target.value);
  };

  return (
    <div className="flex items-center bg-indigo-100 px-4 py-2 rounded">
      <label htmlFor="llm-selector" className="mr-2 font-semibold text-indigo-700">
        AI Model:
      </label>
      <select
        id="llm-selector"
        value={selectedLLM}
        onChange={handleLLMChange}
        className="px-2 py-1 border rounded bg-white"
      >
        <option value="openai">OpenAI</option>
        <option value="cohere">Cohere</option>
        <option value="anthropic">Anthropic</option>
      </select>
    </div>
  );
};

export default LLMSelector;
