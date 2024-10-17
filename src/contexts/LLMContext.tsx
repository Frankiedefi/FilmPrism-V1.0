import React, { createContext, useState, ReactNode } from 'react';

interface LLMContextValue {
  selectedLLM: string;
  setSelectedLLM: (llm: string) => void;
}

export const LLMContext = createContext<LLMContextValue>({
  selectedLLM: 'openai',
  setSelectedLLM: () => {},
});

interface LLMProviderProps {
  children: ReactNode;
}

export const LLMProvider: React.FC<LLMProviderProps> = ({ children }) => {
  const [selectedLLM, setSelectedLLM] = useState<string>('openai');

  return (
    <LLMContext.Provider value={{ selectedLLM, setSelectedLLM }}>
      {children}
    </LLMContext.Provider>
  );
};

export const useLLM = () => React.useContext(LLMContext);
