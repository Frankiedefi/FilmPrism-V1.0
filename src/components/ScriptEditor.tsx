import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, RefreshCw, HelpCircle } from 'lucide-react';
import { generateDialogue } from '../services/llm';

interface ScriptEditorProps {
  content: string;
  onChange: (content: string) => void;
  selectedLLM: string;
  format: 'film' | 'tv' | 'podcast';
}

function ScriptEditor({ content, onChange, selectedLLM, format }: ScriptEditorProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGuidance, setShowGuidance] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleAiSuggestion = async () => {
    setIsGenerating(true);
    const lastFewLines = content.split('\n').slice(-10).join('\n');
    try {
      const suggestion = await generateDialogue(`Continue the ${format} script`, [], lastFewLines, selectedLLM);
      setAiSuggestion(suggestion);
    } catch (error) {
      console.error('Error generating AI suggestion:', error);
      setAiSuggestion('Failed to generate a suggestion. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const applyAiSuggestion = () => {
    if (aiSuggestion) {
      const newContent = content + '\n' + aiSuggestion;
      onChange(newContent);
      setAiSuggestion(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newContent = content.substring(0, start) + '    ' + content.substring(end);
      onChange(newContent);
      e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 4;
    }
  };

  const formatLine = (line: string) => {
    if (format === 'film' || format === 'tv') {
      if (line.match(/^(INT\.|EXT\.)/)) {
        return line.toUpperCase();
      } else if (line === line.toUpperCase() && !line.startsWith('(')) {
        return line.padStart(line.length + 20);
      } else if (line.startsWith('(') && line.endsWith(')')) {
        return line.padStart(line.length + 16);
      }
    } else if (format === 'podcast') {
      if (line.match(/^[A-Z]+:/)) {
        return line.toUpperCase();
      }
    }
    return line;
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const lines = e.target.value.split('\n');
    const formattedLines = lines.map(formatLine);
    onChange(formattedLines.join('\n'));
  };

  const getFormatGuidance = () => {
    switch (format) {
      case 'film':
        return (
          <div>
            <h4 className="font-bold">Film Script Format:</h4>
            <ul className="list-disc pl-5">
              <li>Scene headings: INT./EXT. LOCATION - TIME</li>
              <li>Action lines: Describe what's happening</li>
              <li>Character names: ALL CAPS before dialogue</li>
              <li>Dialogue: Centered under character name</li>
              <li>Parentheticals: (action or tone) within dialogue</li>
              <li>Transitions: FADE IN:, CUT TO:, etc.</li>
            </ul>
          </div>
        );
      case 'tv':
        return (
          <div>
            <h4 className="font-bold">TV Script Format:</h4>
            <ul className="list-disc pl-5">
              <li>Similar to film format</li>
              <li>Include act breaks and scene numbers</li>
              <li>May have a teaser and tag</li>
              <li>More compact action lines</li>
            </ul>
          </div>
        );
      case 'podcast':
        return (
          <div>
            <h4 className="font-bold">Podcast Script Format:</h4>
            <ul className="list-disc pl-5">
              <li>Speaker names: ALL CAPS followed by a colon</li>
              <li>Dialogue: Regular text after speaker name</li>
              <li>Sound effects: [SFX: description]</li>
              <li>Music cues: [MUSIC: description]</li>
              <li>Narration: [NARRATION: text]</li>
            </ul>
          </div>
        );
    }
  };

  return (
    <div className={`bg-${theme === 'light' ? 'white' : 'gray-800'} rounded-lg shadow-md p-4 transition-colors duration-300`}>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`}
        >
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </button>
        <div className="flex items-center">
          <button
            onClick={handleAiSuggestion}
            disabled={isGenerating}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300 disabled:opacity-50 mr-2"
          >
            {isGenerating ? (
              <span className="flex items-center">
                <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                Imagining...
              </span>
            ) : (
              <>
                <RefreshCw className="h-5 w-5 mr-2" />
                Imagine a scene
              </>
            )}
          </button>
          <button
            onClick={() => setShowGuidance(!showGuidance)}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition duration-300"
          >
            <HelpCircle className="h-5 w-5" />
          </button>
        </div>
      </div>
      {showGuidance && (
        <div className="mb-4 p-4 bg-indigo-100 rounded-md">
          {getFormatGuidance()}
        </div>
      )}
      <textarea
        ref={editorRef}
        className={`w-full h-[600px] p-4 font-mono text-sm border-none focus:outline-none resize-none ${
          theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-800 text-gray-100'
        }`}
        value={content}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={`Start writing your ${format} script here...`}
        style={{
          fontFamily: 'Courier, monospace',
          fontSize: '12pt',
          lineHeight: '1.5',
          whiteSpace: 'pre-wrap',
        }}
      />
      {aiSuggestion && (
        <div className="mt-4 p-4 bg-indigo-100 rounded-md">
          <h4 className="font-semibold mb-2">AI-Generated Scene:</h4>
          <pre className="whitespace-pre-wrap mb-2 font-mono text-sm overflow-x-auto">{aiSuggestion}</pre>
          <button
            onClick={applyAiSuggestion}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300"
          >
            Apply Scene
          </button>
        </div>
      )}
    </div>
  );
}

export default ScriptEditor;