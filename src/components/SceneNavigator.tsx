import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Edit, Trash } from 'lucide-react';
import { generateRandomScene } from '../services/llm';

interface SceneNavigatorProps {
  content: string;
  onAddScene: (scene: string) => void;
  onUpdateScene: (index: number, updatedScene: string) => void;
  onRemoveScene: (index: number) => void;
}

function SceneNavigator({ content, onAddScene, onUpdateScene, onRemoveScene }: SceneNavigatorProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newSceneHeading, setNewSceneHeading] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  
  const scenes = content.split('\n').filter(line => line.trim().startsWith('INT.') || line.trim().startsWith('EXT.'));

  const handleGenerateRandomScene = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const randomScene = await generateRandomScene();
      onAddScene(randomScene);
    } catch (error) {
      console.error('Error generating random scene:', error);
      setError('Failed to generate a random scene. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddScene = () => {
    if (newSceneHeading.trim()) {
      onAddScene(newSceneHeading.trim());
      setNewSceneHeading('');
    }
  };

  const handleEditScene = (index: number) => {
    setEditingIndex(index);
  };

  const handleSaveEdit = (index: number, updatedScene: string) => {
    onUpdateScene(index, updatedScene);
    setEditingIndex(null);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Scene Navigator</h3>
        <button onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
      </div>
      {isExpanded && (
        <>
          <div className="mb-4">
            <input
              type="text"
              value={newSceneHeading}
              onChange={(e) => setNewSceneHeading(e.target.value)}
              placeholder="New scene heading (e.g., INT. COFFEE SHOP - DAY)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 mb-2"
            />
            <div className="flex">
              <button
                onClick={handleAddScene}
                className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300 mr-2"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </button>
              <button
                onClick={handleGenerateRandomScene}
                disabled={isGenerating}
                className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300 disabled:opacity-50"
              >
                <Plus className="h-4 w-4 mr-1" />
                {isGenerating ? 'Generating...' : 'Generate Random'}
              </button>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
          <ul className="max-h-60 overflow-y-auto">
            {scenes.map((scene, index) => (
              <li key={index} className="mb-2 p-2 border border-gray-200 rounded-md">
                {editingIndex === index ? (
                  <SceneEditForm
                    scene={scene}
                    onSave={(updatedScene) => handleSaveEdit(index, updatedScene)}
                    onCancel={handleCancelEdit}
                  />
                ) : (
                  <div className="flex justify-between items-center">
                    <span className="cursor-pointer hover:text-indigo-600">{scene}</span>
                    <div>
                      <button
                        onClick={() => handleEditScene(index)}
                        className="text-blue-600 hover:text-blue-800 mr-2"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onRemoveScene(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

interface SceneEditFormProps {
  scene: string;
  onSave: (scene: string) => void;
  onCancel: () => void;
}

function SceneEditForm({ scene, onSave, onCancel }: SceneEditFormProps) {
  const [editedScene, setEditedScene] = useState(scene);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedScene);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={editedScene}
        onChange={(e) => setEditedScene(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 mb-2"
      />
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-2 text-gray-600 hover:text-gray-800 mr-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
        >
          Save
        </button>
      </div>
    </form>
  );
}

export default SceneNavigator;