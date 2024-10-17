import React, { useState, useEffect } from 'react';
import { generateWithContext, updateContext } from '../services/ragService';
import StoryCard from './StoryCard';

interface ScriptContext {
  characters: string[];
  scenes: string[];
  plotPoints: string[];
}

const ScriptsPage: React.FC = () => {
  const [scriptContext, setScriptContext] = useState<ScriptContext>({
    characters: [],
    scenes: [],
    plotPoints: [],
  });
  const [currentScript, setCurrentScript] = useState('');
  const [useAnthropic, setUseAnthropic] = useState(false);
  const [showAnthropicOption, setShowAnthropicOption] = useState(false);

  useEffect(() => {
    // Check if the Anthropic API key is available
    const anthropicApiKey = process.env.REACT_APP_ANTHROPIC_API_KEY;
    setShowAnthropicOption(!!anthropicApiKey);
  }, []);

  const handleStoryCardComplete = (storyContext: any) => {
    const newContext = updateContext(scriptContext, {
      characters: storyContext.characters,
      plotPoints: [storyContext.logline],
    });
    setScriptContext(newContext);
  };

  const handleScriptChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentScript(event.target.value);
  };

  const handleGenerateIdea = async () => {
    try {
      const idea = await generateWithContext('Generate a new scene idea', scriptContext, useAnthropic);
      setCurrentScript(prevScript => prevScript + '\n\n' + idea);
    } catch (error) {
      console.error('Error generating idea:', error);
    }
  };

  const handleSaveProject = () => {
    const project = {
      id: Date.now(),
      title: 'New Project', // You might want to prompt the user for a title
      script: currentScript,
      context: scriptContext,
    };
    const savedProjects = JSON.parse(localStorage.getItem('savedProjects') || '[]');
    savedProjects.push(project);
    localStorage.setItem('savedProjects', JSON.stringify(savedProjects));
    alert('Project saved successfully!');
  };

  const handleModelChange = () => {
    setUseAnthropic(prev => !prev);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Scripts</h1>
      <StoryCard onComplete={handleStoryCardComplete} onLogUpdate={console.log} />
      <div className="mt-8">
        <textarea
          value={currentScript}
          onChange={handleScriptChange}
          className="w-full h-64 p-2 border rounded"
          placeholder="Start writing your script here..."
        />
      </div>
      <div className="mt-4 flex justify-between">
        <button
          onClick={handleGenerateIdea}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Generate Idea
        </button>
        {showAnthropicOption && (
          <div className="flex items-center">
            <span className="mr-2">Use Anthropic:</span>
            <label className="switch">
              <input type="checkbox" checked={useAnthropic} onChange={handleModelChange} />
              <span className="slider round"></span>
            </label>
          </div>
        )}
        {!showAnthropicOption && (
          <div className="text-gray-500">
            Anthropic model is not available without the API key.
          </div>
        )}
        <button
          onClick={handleSaveProject}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Save Project
        </button>
      </div>
    </div>
  );
};

export default ScriptsPage;
