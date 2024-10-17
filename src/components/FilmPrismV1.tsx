import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Save, GitFork, Maximize, Zap, RefreshCw, Edit2, Trash2, ChevronLeft, ChevronRight, Film, Check, X, ArrowLeftRight, Swords, MessageCircle, User, Pilcrow } from 'lucide-react';
import jsPDF from 'jspdf';

const ScriptPal = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
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
    </>
  );
};

const FilmPrismV1: React.FC = () => {
  const characterNames = [
    "Ethan Cross", "Lila Montgomery", "Avery Hale", "Jackson Pierce", "Isla Reed",
    "Mason Everett", "Natalia Stone", "Finn Gallagher", "Elena Cruz", "Oliver Bennett",
    "Zara Knight", "Kieran Wolfe", "Rosalind Kane", "Silas Harper", "Daphne Archer",
    "Luca Romano", "Sophie Delacroix", "Leo Hunt", "Amara Fox", "Jasper Quinn"
  ];
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [scriptContent, setScriptContent] = useState<Array<{ id: number; type: string; content: string; editing: boolean }>>([]);
  const [pageCount, setPageCount] = useState(1);
  const [runTime, setRunTime] = useState('0:00');
  const componentRef = useRef<HTMLDivElement>(null);
  const [scenes, setScenes] = useState([{ id: 1, number: 1, heading: 'INT. LOCATION - DAY' }]);
  const nextSceneId = useRef(2);
  const [selectedElement, setSelectedElement] = useState<number | null>(null);
  const [isSceneNavOpen, setIsSceneNavOpen] = useState(true);
  const [editingElementId, setEditingElementId] = useState<number | null>(null);
  const [newContent, setNewContent] = useState('');
  const [hoveredElementId, setHoveredElementId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [newSceneNumber, setNewSceneNumber] = useState('');
  const numberInputRef = useRef<HTMLInputElement>(null);
  const [isTransitionMenuOpen, setIsTransitionMenuOpen] = useState(false);
  const transitionMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (transitionMenuRef.current && !transitionMenuRef.current.contains(event.target as Node)) {
        setIsTransitionMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    updatePageCountAndRunTime(scriptContent);
  }, [scriptContent]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const updatePageCountAndRunTime = (content: Array<{ id: number; type: string; content: string; editing: boolean }>) => {
    const lineCount = content.reduce((acc, item) => acc + item.content.split('\n').length, 0);
    const newPageCount = Math.ceil(lineCount / 55);
    setPageCount(newPageCount);
    setRunTime(`${Math.floor(newPageCount)}:${((lineCount % 55) * 60 / 55).toFixed(0).padStart(2, '0')}`);
  };

  const formatSceneHeading = (scene: { id: number; number: number; heading: string; editing?: boolean }) => {
    return (
      <div className="scene-container flex items-center mb-2">
        <span className="scene-number mr-2">{scene.number}</span>
        <span className="mr-2">{'\u00A0'.repeat(2)}</span>
        <span
          className="scene-heading flex-grow cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 px-2 py-1 rounded"
          onClick={() => commitSceneHeading(scene.id)}
        >
          {scene.heading}
        </span>
        <div className="flex items-center">
          {scene.editing !== true ? (
            <>
              <Edit2 onClick={() => handleSceneHeadingEdit(scene.id)} className="h-4 w-4 ml-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded text-blue-600 dark:text-blue-400" />
              <Trash2 onClick={() => deleteScene(scene.id)} className="h-4 w-4 ml-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded text-red-600 dark:text-red-400" />
            </>
          ) : (
            <>
              <Check onClick={() => handleSaveEdit(scene.id)} className="h-4 w-4 ml-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded text-green-600 dark:text-green-400" />
              <X onClick={() => handleCancelEdit(scene.id)} className="h-4 w-4 ml-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded text-red-600 dark:text-red-400" />
            </>
          )}
        </div>
      </div>
    );
  };

  const addScene = (newScene: { id: number; number: number; heading: string }) => {
    setScenes([...scenes, newScene]);
    setScriptContent(prevContent => [...prevContent, { id: newScene.id, type: 'scene', content: `${newScene.number}  ${newScene.heading}`, editing: false }]);
  };

  const updateScene = (id: number, updates: Partial<{ number: number; heading: string }>) => {
    setScenes(scenes.map(scene => scene.id === id ? { ...scene, ...updates } : scene));
    setScriptContent(prevContent =>
      prevContent.map(item =>
        item.id === id
          ? { ...item, content: `${updates.number || item.content.split('  ')[0]}  ${updates.heading || item.content.split('  ')[1]}` }
          : item
      )
    );
  };

  const deleteScene = (id: number) => {
    setScenes(scenes.filter(scene => scene.id !== id));
    setScriptContent(prevContent => prevContent.filter(item => item.id !== id));
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
      setScriptContent(prevContent => [...prevContent, { id: scene.id, type: 'scene', content: `${scene.number}  ${scene.heading}`, editing: false }]);
    }
  };

  const addScriptElement = (type: string) => {
    const newId = scriptContent.length + 1;
    let newContent = type.trim().toUpperCase();
    let newType = type.toLowerCase();

    if (type === 'Logline') {
      const loglines = [
        "A gripping tale of suspense and intrigue unfolds in the heart of a city that never sleeps.",
        "In a world where trust is a commodity, one person risks it all for the truth.",
        "As the past catches up with them, secrets unravel and lives are changed forever.",
        "Amidst a brewing storm, one hero rises to defy the odds and fight for what's right.",
        "A daring adventure that spans time and space, testing the limits of courage and fate."
      ];
      const randomIndex = Math.floor(Math.random() * loglines.length);
      newContent = loglines[randomIndex];
    } else if (type === 'Character') {
      const randomIndex = Math.floor(Math.random() * characterNames.length);
      newContent = characterNames[randomIndex];
      newType = 'character';
    } else if (type === 'Parenthetical') {
      newContent = '(beat)';
      newType = 'parenthetical';
    } else if (type === 'Dialogue') {
      const dialogues = [
        "I've waited a lifetime for this moment.",
        "You think you know me, but you have no idea.",
        "If we don't act now, there won't be another chance.",
        "I never asked to be a hero, but sometimes fate doesn't give you a choice.",
        "This isn't just about me. It's about all of us."
      ];
      const randomIndex = Math.floor(Math.random() * dialogues.length);
      newContent = dialogues[randomIndex];
      newType = 'dialogue';
    } else if (type === 'Scene Heading') {
      const sceneHeadings = [
        "EXT. ABANDONED WAREHOUSE - NIGHT",
        "INT. CROWDED CAFÉ - DAY",
        "EXT. SNOW-COVERED FOREST - DUSK",
        "INT. UNDERGROUND BUNKER - MIDNIGHT",
        "EXT. CITY ROOFTOP - SUNSET"
      ];
      const randomIndex = Math.floor(Math.random() * sceneHeadings.length);
      newContent = sceneHeadings[randomIndex];
      newType = 'sceneheading';
    }

    if (type === 'Scene Heading') {
      const newSceneNumber = scenes.length > 0 ? scenes[scenes.length - 1].number + 1 : 1;
      const newScene = { id: nextSceneId.current++, number: newSceneNumber, heading: 'INT. LOCATION - DAY', editing: false };
      addScene(newScene);
    } else {
      setScriptContent(prevContent => [...prevContent, { id: newId, type: newType, content: newContent, editing: false }]);
    }
  };

  const handleEditClick = (id: number) => {
    const element = scriptContent.find(item => item.id === id);
    setEditingElementId(id);
    if (element && element.type === 'scene') {
      const parts = element.content.split('  ');
      setNewContent(parts[1]);
      setNewSceneNumber(parts[0]);
    } else {
      setNewContent(element?.content || '');
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
    if (numberInputRef.current) {
      numberInputRef.current.focus();
    }
  };

  const handleInputChange = (id: number, value: string) => {
    setNewContent(value);
    const trimmedValue = value.trim();
    setScriptContent(prevContent => prevContent.map(item => item.id === id ? { ...item, content: trimmedValue } : item));
    const sceneIndex = scenes.findIndex(scene => scene.id === id);
    if (sceneIndex !== -1) {
      setScenes(scenes.map(scene => scene.id === id ? { ...scene, heading: trimmedValue } : scene));
    }
  };

  const handleInputNumberChange = (id: number, value: string) => {
    setNewSceneNumber(value);
    setScriptContent(prevContent => prevContent.map(item => item.id === id ? { ...item, content: `${value}  ${newContent}` } : item));
    const sceneIndex = scenes.findIndex(scene => scene.id === id);
    if (sceneIndex !== -1) {
      setScenes(scenes.map(scene => scene.id === id ? { ...scene, number: parseInt(value, 10) } : scene));
    }
  };

  const handleSaveEdit = (id: number) => {
    setEditingElementId(null);
    setNewContent('');
    setNewSceneNumber('');
    setScenes(scenes.map(scene => scene.id === id ? {...scene, editing: false} : scene));
  };

  const handleCancelEdit = (id: number) => {
    setEditingElementId(null);
    setNewContent('');
    setNewSceneNumber('');
    const originalContent = scriptContent.find(item => item.id === id)?.content;
    setScriptContent(prevContent => prevContent.map(item => item.id === id ? { ...item, content: originalContent || '' } : item));
    setScenes(scenes.map(scene => scene.id === id ? {...scene, editing: false} : scene));
  };

  const handleDeleteClick = (id: number) => {
    setScriptContent(prevContent => prevContent.filter(item => item.id !== id));
  };

  const scriptElements = [
    { icon: <Film className="h-5 w-5" />, type: 'Scene Heading' },
    { icon: <Swords className="h-5 w-5" />, type: 'Logline' },
    { icon: <User className="h-5 w-5" />, type: 'Character' },
    { icon: <MessageCircle className="h-5 w-5" />, type: 'Dialogue' },
    { icon: <Pilcrow className="h-5 w-5" />, type: 'Parenthetical' },
    { icon: <ArrowLeftRight className="h-5 w-5" />, type: 'Transition' }
  ];

  const transitions = [
    'CUT TO:',
    'DISSOLVE TO:',
    'FADE IN:',
    'FADE OUT:',
    'SMASH CUT TO:'
  ];

  const handleTransitionSelect = (transition: string) => {
    addScriptElement(transition);
    setIsTransitionMenuOpen(false);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    let yOffset = 10;

    doc.setFontSize(20);
    doc.text('Film Script', 10, yOffset);
    yOffset += 10;

    doc.setFontSize(12);
    scriptContent.forEach(item => {
      doc.text(item.content, 10, yOffset);
      yOffset += 10;
    });

    doc.save('script.pdf');
  };

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
            <button className={`p-2 rounded-full ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`}>
              <Maximize className="h-5 w-5" />
            </button>
            <ScriptPal />
          </div>
          <div className="flex items-center space-x-2">
            <span>Pages: {pageCount}</span>
            <span>Run Time: {runTime}</span>
            <button onClick={handleExportPDF} className="flex items-center px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300">
              <Save className="h-4 w-4 mr-1" />
              Export 
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
                <div key={index} className="relative inline-block">
                  <button
                    onClick={() => {
                      setSelectedElement(index);
                      if (element.type !== 'Transition') {
                        addScriptElement(element.type);
                      } else {
                        setIsTransitionMenuOpen(!isTransitionMenuOpen);
                      }
                    }}
                    className={`px-2 py-1 text-xs rounded mx-1 ${
                      selectedElement === index ? 'bg-indigo-700' : 'bg-indigo-600'
                    } text-white hover:bg-indigo-700 transition duration-300 flex items-center`}
                    title={element.type}
                  >
                    {element.icon}
                  </button>
                  {element.type === 'Transition' && isTransitionMenuOpen && (
                    <div ref={transitionMenuRef} className="absolute left-0 mt-2 py-2 w-48 bg-white rounded-md shadow-lg z-10">
                      {transitions.map((transition) => (
                        <button
                          key={transition}
                          onClick={() => handleTransitionSelect(transition)}
                          className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                        >
                          {transition}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div
              className={`script-content-container flex-grow w-full p-4 rounded font-mono text-sm mt-2 ${
                theme === 'light' ? 'bg-gray-100 text-gray-900' : 'bg-gray-800 text-white'
              } overflow-y-auto whitespace-pre-wrap relative`}
              style={{
                lineHeight: '1.5',
                textAlign: 'left',
                maxWidth: '8.5in',
                margin: '0 auto',
                overflowWrap: 'break-word',
                wordWrap: 'break-word',
                paddingLeft: 'calc(1.3in)',
                paddingRight: '4.5rem',
                paddingTop: '3.5rem',
                paddingBottom: '1.5rem',
              }}
            >
              {scriptContent.map((item, index) => (
                <div
                  key={index}
                  className={`${item.type} mb-4`}
                  onMouseEnter={() => setHoveredElementId(item.id)}
                  onMouseLeave={() => setHoveredElementId(null)}
                  style={{
                    textAlign: transitions.includes(item.content) ? 'right' : 'left',
                    ...(item.type === 'dialogue' && { marginLeft: '10.5rem', marginRight: '14.5rem' }),
                    ...(transitions.includes(item.content) && { 
                      width: '100%',
                      paddingRight: '0',
                      marginRight: '0.5rem', 
                      textTransform: 'uppercase'
                    }),
                    marginBottom: item.type === 'character' || item.type === 'parenthetical' ? '0' : '1rem',
                    ...(item.type === 'logline' && { marginLeft: '1.5rem', marginRight: '3rem' }),
                  }}
                >
                  {editingElementId === item.id ? (
                    <div className="flex items-center justify-center">
                      {item.type === 'scene' ? (
                        <>
                          <input
                            type="text"
                            ref={numberInputRef}
                            value={newSceneNumber}
                            onChange={(e) => handleInputNumberChange(item.id, e.target.value)}
                            className={`bg-${theme === 'light' ? 'gray-100' : 'gray-700'} border border-gray-300 rounded px-2 py-1 text-${theme === 'light' ? 'gray-900' : 'gray-100'} mr-2 mt-2`}
                            style={{ opacity: 0.8, width: '3rem' }}
                          />
                          <input
                            type="text"
                            ref={inputRef}
                            value={newContent}
                            onChange={(e) => handleInputChange(item.id, e.target.value)}
                            className={`bg-${theme === 'light' ? 'gray-100' : 'gray-700'} border border-gray-300 rounded px-2 py-1 text-${theme === 'light' ? 'gray-900' : 'gray-100'} mt-2`}
                            style={{ opacity: 0.8, width: 'calc(100% - 4rem)' }}
                          />
                        </>
                      ) : (
                        <input
                          type="text"
                          ref={inputRef}
                          value={newContent}
                          onChange={(e) => handleInputChange(item.id, e.target.value)}
                          className={`bg-${theme === 'light' ? 'gray-100' : 'gray-700'} border border-gray-300 rounded px-2 py-1 text-${theme === 'light' ? 'gray-900' : 'gray-100'} mt-2`}
                          style={{ opacity: 0.8, width: '100%' }}
                        />
                      )}
                      <Check onClick={() => handleSaveEdit(item.id)} className="h-4 w-4 ml-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded text-green-600 dark:text-green-400" />
                      <X onClick={() => handleCancelEdit(item.id)} className="h-4 w-4 ml-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded text-red-600 dark:text-red-400" />
                    </div>
                  ) : (
                    <div className={`flex items-center ${
                      item.type === 'character' || item.type === 'parenthetical' || item.type === 'dialogue'
                        ? 'justify-center'
                        : item.type === 'transition' || item.type === 'fade in'
                          ? 'justify-end'
                          : ''
                    }`}>
                  <span
                    className={`text-${theme === 'light' ? 'gray-900' : 'gray-100'}`}
                    style={{
                      ...(item.type === 'dialogue' && { textAlign: 'justify', width: '100%' }),
                      ...(transitions.includes(item.content) && { display: 'inline-block', width: '100%' }),
                    }}
                  >
                    {item.content}
                  </span>
                      {hoveredElementId === item.id && (
                        <>
                          <Edit2 onClick={() => handleEditClick(item.id)} className="h-4 w-4 ml-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded text-blue-600 dark:text-blue-400" />
                          {item.type !== 'scene' && (
                            <Trash2 onClick={() => handleDeleteClick(item.id)} className="h-4 w-4 ml-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded text-red-600 dark:text-red-400" />
                          )}
                        </>
                      )}
                    </div>
                  )}
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
