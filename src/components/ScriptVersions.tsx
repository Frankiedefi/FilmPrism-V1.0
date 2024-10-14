import React, { useState } from 'react';
import { Clock, Save, FileText, ChevronDown, ChevronUp } from 'lucide-react';

interface Version {
  id: number;
  timestamp: string;
  content: string;
}

interface ScriptVersionsProps {
  currentContent: string;
  onLoadVersion: (content: string) => void;
  logEntries: string[];
  addLogEntry: (entry: string) => void;
}

const ScriptVersions: React.FC<ScriptVersionsProps> = ({ currentContent, onLoadVersion, logEntries, addLogEntry }) => {
  const [activeTab, setActiveTab] = useState<'versions' | 'log'>('versions');
  const [versions, setVersions] = useState<Version[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);

  const saveVersion = () => {
    const newVersion: Version = {
      id: versions.length + 1,
      timestamp: new Date().toLocaleString(),
      content: currentContent,
    };
    setVersions([newVersion, ...versions]);
    addLogEntry(`Version ${newVersion.id} saved`);
  };

  const loadVersion = (version: Version) => {
    onLoadVersion(version.content);
    addLogEntry(`Loaded version ${version.id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md mt-4">
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded-md ${activeTab === 'versions' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveTab('versions')}
          >
            Versions
          </button>
          <button
            className={`px-4 py-2 rounded-md ${activeTab === 'log' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveTab('log')}
          >
            Log
          </button>
        </div>
        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <ChevronUp /> : <ChevronDown />}
        </button>
      </div>
      {isExpanded && (
        <div className="p-4">
          {activeTab === 'versions' && (
            <div>
              <button
                className="mb-4 flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
                onClick={saveVersion}
              >
                <Save className="h-5 w-5 mr-2" />
                Save Current Version
              </button>
              <div className="max-h-60 overflow-y-auto">
                {versions.map((version) => (
                  <div key={version.id} className="flex justify-between items-center mb-2 p-2 border rounded">
                    <div>
                      <span className="font-semibold">Version {version.id}</span>
                      <span className="ml-2 text-sm text-gray-500">{version.timestamp}</span>
                    </div>
                    <button
                      className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300"
                      onClick={() => loadVersion(version)}
                    >
                      Load
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'log' && (
            <div className="max-h-60 overflow-y-auto">
              {logEntries.map((entry, index) => (
                <div key={index} className="mb-2 p-2 border-b">
                  <span className="text-sm text-gray-500">{new Date().toLocaleString()}</span>
                  <p>{entry}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScriptVersions;