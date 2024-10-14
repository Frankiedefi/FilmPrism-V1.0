import React, { useState } from 'react';

interface ProjectCardProps {
  project: {
    id: number;
    title: string;
    script: string;
    context: {
      characters: string[];
      scenes: string[];
      plotPoints: string[];
    };
  };
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <h3 className="text-xl font-bold mb-2">{project.title}</h3>
      <p className="text-gray-600 mb-2">Characters: {project.context.characters.join(', ')}</p>
      <p className="text-gray-600 mb-2">Plot Points: {project.context.plotPoints.join(', ')}</p>
      <button
        onClick={toggleExpand}
        className="text-blue-500 hover:text-blue-700"
      >
        {isExpanded ? 'Hide Details' : 'Show Details'}
      </button>
      {isExpanded && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Script:</h4>
          <pre className="bg-gray-100 p-2 rounded whitespace-pre-wrap">
            {project.script}
          </pre>
          <h4 className="font-semibold mt-4 mb-2">Scenes:</h4>
          <ul className="list-disc list-inside">
            {project.context.scenes.map((scene, index) => (
              <li key={index}>{scene}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
