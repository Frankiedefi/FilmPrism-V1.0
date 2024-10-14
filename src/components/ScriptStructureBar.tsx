import React from 'react';

interface ScriptStructureBarProps {
  content: string;
}

function ScriptStructureBar({ content }: ScriptStructureBarProps) {
  const scenes = content.split('\n').filter(line => line.trim().startsWith('INT.') || line.trim().startsWith('EXT.'));
  const totalScenes = scenes.length;

  return (
    <div className="mb-4 bg-gray-200 h-8 rounded-full overflow-hidden">
      {scenes.map((scene, index) => (
        <div
          key={index}
          className="h-full bg-indigo-600"
          style={{ width: `${(1 / totalScenes) * 100}%`, display: 'inline-block' }}
          title={scene}
        />
      ))}
    </div>
  );
}

export default ScriptStructureBar;