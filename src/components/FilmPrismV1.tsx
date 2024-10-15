import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Save, GitFork, Maximize, Minimize, Zap, RefreshCw, Edit2, Trash2, ChevronLeft, ChevronRight, Film } from 'lucide-react';

const ScriptPal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <React.Fragment>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300"
      >
        <Zap className="h-4 w-4 mr-1" />
        Script Pal
      </button>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Enhance Script with AI</h3>
            <p className="mb-4">
              Use Script Pal to give AI context when generating content for your script. 
              This will allow you to generate locations, characters, dialogue, and more, 
              along with any storyboard elements.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300"
              >
                <RefreshCw className="h-4 w-4 mr-2 inline" />
                Sync
              </button>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

const FilmPrismV1: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [scriptContent, setScriptContent] = useState<Array<{ type: string; content: string }>>([]);
  const [pageCount, setPageCount] = useState(1);
  const [runTime, setRunTime] = useState('0:00');
  const componentRef = useRef<HTMLDivElement>(null);
  const [scenes, setScenes] = useState([{ id: 1, number: 1, heading: 'INT. LOCATION - DAY' }]);
  const nextSceneId = useRef(2);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isSceneNavOpen, setIsSceneNavOpen] = useState(true);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(document.fullscreenElement === componentRef.current);
    };
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  useEffect(() => {
    updatePageCountAndRunTime(scriptContent);
  }, [scriptContent]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      componentRef.current?.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const updatePageCountAndRunTime = (content: Array<{ type: string; content: string }>) => {
    const lineCount = content.reduce((acc, item) => acc + item.content.split('\n').length, 0);
    const newPageCount = Math.ceil(lineCount / 55);
    setPageCount(newPageCount);
    setRunTime(`${Math.floor(newPageCount)}:${((lineCount % 55) * 60 / 55).toFixed(0).padStart(2, '0')}`);
  };

  const formatSceneHeading = (scene: { id: number; number: number; heading: string }) => {
    return (
      <div className="scene-container flex items-center mb-2">
        <span className="scene-number mr-2">{scene.number}.</span>
        <span 
          className="scene-heading flex-grow cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 px-2 py-1 rounded"
          onClick={() => commitSceneHeading(scene.id)}
        >
          {scene.heading}
        </span>
        <button 
          className="edit-button ml-2 p-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition duration-300"
          onClick={() => handleSceneHeadingEdit(scene.id)}
        >
          <Edit2 size={16} />
        </button>
        <button 
          className="delete-button ml-2 p-1 rounded bg-red-600 text-white hover:bg-red-700 transition duration-300"
          onClick={() => deleteScene(scene.id)}
        >
          <Trash2 size={16} />
        </button>
      </div>
    );
  };

  const addScene = () => {
    const newSceneNumber = scenes.length > 0 ? scenes[scenes.length - 1].number + 1 : 1;
    setScenes([...scenes, { id: nextSceneId.current++, number: newSceneNumber, heading: 'INT. LOCATION - DAY' }]);
  };

  const updateScene = (id: number, updates: Partial<{ number: number; heading: string }>) => {
    setScenes(scenes.map(scene => scene.id === id ? { ...scene, ...updates } : scene));
    
    setScriptContent(prevContent => 
      prevContent.map(item => 
        item.type === 'scene' && item.content.startsWith(`${id}.`) 
          ? { ...item, content: `${id}. ${updates.heading}` }
          : item
      )
    );
  };

  const deleteScene = (id: number) => {
    setScenes(scenes.filter(scene => scene.id !== id));
    
    setScriptContent(prevContent => 
      prevContent.filter(item => !(item.type === 'scene' && item.content.startsWith(`${id}.`)))
    );
  };

  const handleSceneHeadingEdit = (id: number) => {
    const sceneIndex = scenes.findIndex((scene) => scene.id === id);
    if (sceneIndex !== -1) {
      const scene = scenes[sceneIndex];
      const newHeading = prompt("Edit Scene Heading:", scene.heading);
      if (newHeading !== null) {
        updateScene(id, { heading: newHeading });
      }
    }
  };

  const commitSceneHeading = (id: number) => {
    const scene = scenes.find(scene => scene.id === id);
    if (scene) {
      setScriptContent(prevContent => [...prevContent, { type: 'scene', content: `${scene.number}. ${scene.heading}` }]);
    }
  };

  const addScriptElement = (type: string) => {
    if (type === 'Scene Heading') {
      addScene();
    } else {
      setScriptContent(prevContent => [...prevContent, { type: type.toLowerCase(), content: type.toUpperCase() + ':' }]);
    }
  };

  const scriptElements = [
    'Scene Heading', 'Action', 'Character', 'Dialogue', 'Parenthetical', 'Transition', 'FADE IN:'
  ];

  return (
    <React.Fragment>
      <div 
        ref={componentRef}
        className={`h-screen flex flex-col ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'} transition-colors duration-300`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <button onClick={toggleTheme} className={`p-2 rounded-full ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`}>
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            <button onClick={toggleFullScreen} className={`p-2 rounded-full ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`}>
              {isFullScreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
            </button>
            <ScriptPal />
          </div>
          <div className="flex items-center space-x-2">
            <span>Pages: {pageCount}</span>
            <span>Run Time: {runTime}</span>
            <button className="flex items-center px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300">
              <Save className="h-4 w-4 mr-1" />
              Save
            </button>
            <button className="flex items-center px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300">
              <GitFork className="h-4 w-4 mr-1" />
              Fork
            </button>
          </div>
        </div>

        <div className="flex-grow flex p-4">
          <div className={`transition-all duration-300 ${isSceneNavOpen ? 'w-1/4' : 'w-12'} flex flex-col`}>
            <div className="flex items-center justify-between mb-2">
              <Film className="h-6 w-6" />
              <button
                onClick={() => setIsSceneNavOpen(!isSceneNavOpen)}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {isSceneNavOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
              </button>
            </div>
            {isSceneNavOpen && (
              <div className="overflow-y-auto flex-grow">
                <h3 className="text-lg font-semibold mb-2">Scene Navigator</h3>
                {scenes.map((scene) => (
                  <div key={scene.id}>
                    {formatSceneHeading(scene)}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className={`transition-all duration-300 ${isSceneNavOpen ? 'w-3/4' : 'flex-grow'} flex flex-col`}>
            <div className="mb-4 flex justify-center">
              {scriptElements.map((element, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedElement(element);
                    addScriptElement(element);
                  }}
                  className={`px-2 py-1 text-xs rounded mx-1 ${
                    selectedElement === element ? 'bg-indigo-700' : 'bg-indigo-600'
                  } text-white hover:bg-indigo-700 transition duration-300`}
                >
                  {element}
                </button>
              ))}
            </div>
            <div
              className={`flex-grow w-full p-4 rounded font-mono text-sm ${
                theme === 'light' ? 'bg-gray-100 text-gray-900' : 'bg-gray-800 text-white'
              } overflow-y-auto whitespace-pre-wrap`}
              style={{
                lineHeight: '1.5',
                textAlign: 'left',
                maxWidth: '8.5in',
                margin: '0 auto',
                overflowWrap: 'break-word',
                wordWrap: 'break-word',
              }}
            >
              {scriptContent.map((item, index) => (
                <div key={index} className={item.type}>
                  {item.content}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default FilmPrismV1;
