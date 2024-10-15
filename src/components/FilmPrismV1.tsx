import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Save, GitFork, Maximize, Minimize, Zap, RefreshCw } from 'lucide-react';

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
  const [scriptContent, setScriptContent] = useState<string>('');
  const [pageCount, setPageCount] = useState(1);
  const [runTime, setRunTime] = useState('0:00');
  const [previewElement, setPreviewElement] = useState<string | null>(null);
  const componentRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);

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

  const updatePageCountAndRunTime = (content: string) => {
    const lineCount = content.split('\n').length;
    const newPageCount = Math.ceil(lineCount / 55);
    setPageCount(newPageCount);
    setRunTime(`${Math.floor(newPageCount)}:${((lineCount % 55) * 60 / 55).toFixed(0).padStart(2, '0')}`);
  };

  const getNextSceneNumber = (content: string): number => {
    const sceneRegex = /^\d+\s/gm;
    const matches = content.match(sceneRegex);
    if (matches) {
      const lastSceneNumber = parseInt(matches[matches.length - 1], 10);
      return lastSceneNumber + 1;
    }
    return 1;
  };

  const formatSceneHeading = (sceneNumber: number, description: string) => {
    const leftPart = `${sceneNumber}     ${description}`;
    const rightPart = `${sceneNumber}`;
    const totalWidth = 70;
    const padding = ' '.repeat(Math.max(0, totalWidth - leftPart.length - rightPart.length));
    return `${leftPart}${padding}${rightPart}`;
  };

  const addScriptElement = (type: string) => {
    let newElement = '';
    switch (type) {
      case 'Scene Heading':
        const nextSceneNumber = getNextSceneNumber(scriptContent);
        newElement = `\n${formatSceneHeading(nextSceneNumber, 'INT. LOCATION - DAY')}\n`;
        break;
      case 'Action':
        newElement = '\n      Character does something.\n'; // Removed 6 spaces here
        break;
      case 'Character':
        newElement = '\n                           CHARACTER NAME';
        break;
      case 'Dialogue':
        newElement = '\n                  Character\'s dialogue goes here.\n';
        break;
      case 'Parenthetical':
        newElement = '\n                          (under breath)';
        break;
      case 'Transition':
        newElement = '\n\n                                                            CUT TO:\n\n';
        break;
      case 'FADE IN:':
        newElement = '\n                                                            FADE IN:\n\n';
        break;
    }
    setScriptContent(prev => prev + newElement);
    setPreviewElement(null);
  };

  const handlePreview = (type: string) => {
    let previewText = '';
    switch (type) {
      case 'Scene Heading':
        const nextSceneNumber = getNextSceneNumber(scriptContent);
        previewText = formatSceneHeading(nextSceneNumber, 'INT. LOCATION - DAY');
        break;
      case 'Action':
        previewText = '      Character does something.'; // Removed 6 spaces here
        break;
      case 'Character':
        previewText = '                           CHARACTER NAME';
        break;
      case 'Dialogue':
        previewText = '                  Character\'s dialogue goes here.';
        break;
      case 'Parenthetical':
        previewText = '                          (under breath)';
        break;
      case 'Transition':
        previewText = '                                                            CUT TO:';
        break;
      case 'FADE IN:':
        previewText = '                                                            FADE IN:';
        break;
    }
    setPreviewElement(previewText);
  };

  const handleScriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setScriptContent(newContent);
  };

  const handleEditorClick = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const cursorPosition = textarea.selectionStart;
    const lines = textarea.value.slice(0, cursorPosition).split('\n');
    const currentLineStart = textarea.value.lastIndexOf('\n', cursorPosition - 1) + 1;

    if (cursorPosition === currentLineStart) {
      const currentLine = lines[lines.length - 1];
      if (!currentLine.match(/^\d+\s/) && currentLine.trim() === '') {
        const newContent = textarea.value.slice(0, cursorPosition) + '      ' + textarea.value.slice(cursorPosition); // Removed 6 spaces here
        setScriptContent(newContent);
        
        setTimeout(() => {
          textarea.setSelectionRange(cursorPosition + 6, cursorPosition + 6); // Updated to 6 spaces
        }, 0);
      }
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

        <div className="flex-grow flex flex-col items-center p-4">
          <div className="mb-4 flex flex-wrap justify-center gap-2 w-full max-w-3xl">
            {scriptElements.map((element, index) => (
              <button
                key={index}
                onClick={() => addScriptElement(element)}
                onMouseEnter={() => handlePreview(element)}
                onMouseLeave={() => setPreviewElement(null)}
                className="px-2 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700 transition duration-300"
              >
                {element}
              </button>
            ))}
          </div>

          <div className="w-full max-w-3xl relative">
            <textarea
              ref={editorRef}
              value={previewElement !== null ? scriptContent + '\n' + previewElement : scriptContent}
              onChange={handleScriptChange}
              onClick={handleEditorClick}
              className={`w-full h-[calc(100vh-200px)] p-4 rounded font-mono text-sm ${
                theme === 'light' ? 'bg-gray-100 text-gray-900' : 'bg-gray-800 text-white'
              } resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 whitespace-pre-wrap`}
              placeholder="Start writing your script here..."
              style={{
                lineHeight: '1.5',
                textAlign: 'left',
                paddingLeft: 'calc(1.2in + 1rem)',
                paddingRight: 'calc(0.5in + 1rem)',
                maxWidth: '8.5in',
                margin: '0 auto',
                overflowWrap: 'break-word',
                wordWrap: 'break-word',
              }}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default FilmPrismV1;
