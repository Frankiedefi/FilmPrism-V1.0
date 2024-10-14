import React, { createContext, useState, useContext } from 'react';

type LLMOption = 'cohere';

type LLMContextType = {
  selectedLLM: LLMOption;
  setSelectedLLM: (llm: LLMOption) => void;
};

const LLMContext = createContext<LLMContextType | undefined>(undefined);

export const LLMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedLLM, setSelectedLLM] = useState<LLMOption>('cohere');

  return (
    <LLMContext.Provider value={{ selectedLLM, setSelectedLLM }}>
      {children}
    </LLMContext.Provider>
  );
};

export const useLLM = () => {
  const context = useContext(LLMContext);
  if (context === undefined) {
    throw new Error('useLLM must be used within a LLMProvider');
  }
  return context;
};