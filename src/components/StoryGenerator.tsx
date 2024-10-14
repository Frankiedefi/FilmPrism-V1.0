import React, { useState } from 'react';
import { X, Edit2, Check, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';

interface StoryCard {
  id: string;
  title: string;
  tone: string;
  beat: string;
  atmosphere: string;
  plotContext: string;
}

interface StoryGeneratorProps {
  onGenerateStory: (prompt?: string) => Promise<{ story: StoryCard; characters: any[] }>;
  onRemoveStory: () => void;
  onUpdateStory: (story: StoryCard) => void;
}

const StoryGenerator: React.FC<StoryGeneratorProps> = ({ onGenerateStory, onRemoveStory, onUpdateStory }) => {
  const [story, setStory] = useState<StoryCard | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [customPrompt, setCustomPrompt] = useState('');

  const handleGenerate = async (useCustomPrompt: boolean = false) => {
    setIsGenerating(true);
    try {
      const { story: newStory } = await onGenerateStory(useCustomPrompt ? customPrompt : undefined);
      setStory(newStory);
      setIsExpanded(true);
      if (useCustomPrompt) {
        setCustomPrompt('');
      }
    } catch (error) {
      console.error('Error generating story:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (story) {
      onUpdateStory(story);
      setIsEditing(false);
    }
  };

  const handleChange = (field: keyof StoryCard, value: string) => {
    if (story) {
      setStory({ ...story, [field]: value });
    }
  };

  const handleRemove = () => {
    onRemoveStory();
    setStory(null);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  if (!story) {
    return (
      <div className="mb-4">
        <textarea
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="Enter a custom prompt for your story (optional)"
          className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          rows={3}
        />
        <div className="flex space-x-2">
          <button
            onClick={() => handleGenerate()}
            disabled={isGenerating}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300 disabled:opacity-50"
          >
            {isGenerating ? 'Generating...' : 'Generate Random Story'}
          </button>
          <button
            onClick={() => handleGenerate(true)}
            disabled={isGenerating || !customPrompt.trim()}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300 disabled:opacity-50"
          >
            {isGenerating ? 'Generating...' : 'Generate Custom Story'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Story Card</h3>
        <div className="flex items-center">
          {!isEditing && (
            <>
              <button onClick={() => handleGenerate()} className="text-green-600 hover:text-green-800 mr-2" title="Generate New Random Story">
                <RefreshCw size={18} />
              </button>
              <button onClick={handleEdit} className="text-blue-600 hover:text-blue-800 mr-2">
                <Edit2 size={18} />
              </button>
            </>
          )}
          <button onClick={handleRemove} className="text-red-600 hover:text-red-800 mr-2">
            <X size={18} />
          </button>
          <button onClick={toggleExpand} className="text-gray-600 hover:text-gray-800">
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>
      {isEditing ? (
        <>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Working Title</label>
            <input
              type="text"
              value={story.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          {isExpanded && (
            <>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">Story Tone</label>
                <input
                  type="text"
                  value={story.tone}
                  onChange={(e) => handleChange('tone', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">Beat</label>
                <input
                  type="text"
                  value={story.beat}
                  onChange={(e) => handleChange('beat', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">Atmosphere</label>
                <input
                  type="text"
                  value={story.atmosphere}
                  onChange={(e) => handleChange('atmosphere', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">Plot Context</label>
                <textarea
                  value={story.plotContext}
                  onChange={(e) => handleChange('plotContext', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  rows={3}
                />
              </div>
            </>
          )}
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
          >
            <Check size={18} className="inline mr-1" /> Save
          </button>
        </>
      ) : (
        <>
          <p><strong>Working Title:</strong> {story.title}</p>
          {isExpanded && (
            <>
              <p><strong>Story Tone:</strong> {story.tone}</p>
              <p><strong>Beat:</strong> {story.beat}</p>
              <p><strong>Atmosphere:</strong> {story.atmosphere}</p>
              <p><strong>Plot Context:</strong> {story.plotContext}</p>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default StoryGenerator;