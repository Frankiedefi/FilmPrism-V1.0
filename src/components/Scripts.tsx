import React, { useState } from 'react';
import ScriptEditor from './ScriptEditor';
import CharacterSidebar from './CharacterSidebar';
import AIComposer from './AIComposer';
import SceneNavigator from './SceneNavigator';
import StoryCard from './StoryCard';
import ScriptVersions from './ScriptVersions';
import { useLLM } from '../contexts/LLMContext';

interface Character {
  name: string;
  bio: string;
}

interface StoryContext {
  genre: string;
  setting: string;
  mainCharacter: string;
  conflict: string;
  theme: string;
}

function Scripts() {
  const [currentScript, setCurrentScript] = useState('');
  const [characters, setCharacters] = useState<Character[]>([]);
  const { selectedLLM } = useLLM();
  const [storyContext, setStoryContext] = useState<StoryContext | null>(null);
  const [logEntries, setLogEntries] = useState<string[]>([]);

  const handleScriptChange = (newContent: string) => {
    setCurrentScript(newContent);
    addLogEntry('Script content updated');
  };

  const addCharacter = (character: Character) => {
    setCharacters([...characters, character]);
    addLogEntry(`Character added: ${character.name}`);
  };

  const updateCharacter = (index: number, updatedCharacter: Character) => {
    const newCharacters = [...characters];
    newCharacters[index] = updatedCharacter;
    setCharacters(newCharacters);
    addLogEntry(`Character updated: ${updatedCharacter.name}`);
  };

  const removeCharacter = (index: number) => {
    const removedCharacter = characters[index];
    const newCharacters = characters.filter((_, i) => i !== index);
    setCharacters(newCharacters);
    addLogEntry(`Character removed: ${removedCharacter.name}`);
  };

  const insertDialogue = (dialogue: string) => {
    setCurrentScript(currentScript + '\n\n' + dialogue);
    addLogEntry('Dialogue inserted');
  };

  const addScene = (scene: string) => {
    setCurrentScript(currentScript + '\n\n' + scene);
    addLogEntry('Scene added');
  };

  const updateScene = (index: number, updatedScene: string) => {
    const scriptLines = currentScript.split('\n');
    const sceneLines = scriptLines.filter(line => line.trim().startsWith('INT.') || line.trim().startsWith('EXT.'));
    scriptLines[scriptLines.indexOf(sceneLines[index])] = updatedScene;
    setCurrentScript(scriptLines.join('\n'));
    addLogEntry('Scene updated');
  };

  const removeScene = (index: number) => {
    const scriptLines = currentScript.split('\n');
    const sceneLines = scriptLines.filter(line => line.trim().startsWith('INT.') || line.trim().startsWith('EXT.'));
    const sceneToRemove = sceneLines[index];
    const sceneStartIndex = scriptLines.indexOf(sceneToRemove);
    let sceneEndIndex = scriptLines.findIndex((line, i) => i > sceneStartIndex && (line.trim().startsWith('INT.') || line.trim().startsWith('EXT.')));
    if (sceneEndIndex === -1) sceneEndIndex = scriptLines.length;
    scriptLines.splice(sceneStartIndex, sceneEndIndex - sceneStartIndex);
    setCurrentScript(scriptLines.join('\n'));
    addLogEntry('Scene removed');
  };

  const handleStoryComplete = (completedStoryContext: StoryContext) => {
    setStoryContext(completedStoryContext);
    addLogEntry('Story context updated');
  };

  const addLogEntry = (entry: string) => {
    setLogEntries(prevEntries => [`${new Date().toLocaleString()} - ${entry}`, ...prevEntries]);
  };

  const scenes = currentScript.split('\n').filter(line => line.trim().startsWith('INT.') || line.trim().startsWith('EXT.'));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Script Editor</h2>
      </div>
      <StoryCard onComplete={handleStoryComplete} onLogUpdate={addLogEntry} />
      <div className="flex">
        <div className="w-3/4 pr-4">
          <ScriptEditor content={currentScript} onChange={handleScriptChange} selectedLLM={selectedLLM} />
        </div>
        <div className="w-1/4">
          <CharacterSidebar
            characters={characters}
            onAddCharacter={addCharacter}
            onUpdateCharacter={updateCharacter}
            onRemoveCharacter={removeCharacter}
            storyContext={storyContext}
          />
          <SceneNavigator
            content={currentScript}
            onAddScene={addScene}
            onUpdateScene={updateScene}
            onRemoveScene={removeScene}
          />
          <AIComposer
            scriptContent={currentScript}
            characters={characters}
            scenes={scenes}
            onInsertDialogue={insertDialogue}
            selectedLLM={selectedLLM}
            storyContext={storyContext}
          />
        </div>
      </div>
      <ScriptVersions
        currentContent={currentScript}
        onLoadVersion={setCurrentScript}
        logEntries={logEntries}
        addLogEntry={addLogEntry}
      />
    </div>
  );
}

export default Scripts;