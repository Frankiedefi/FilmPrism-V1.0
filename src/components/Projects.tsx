import React, { useState } from 'react';
import { Plus, FileText, Film } from 'lucide-react';
import ProjectCard from './ProjectCard';
import ImportScriptModal from './ImportScriptModal';

interface Project {
  id: string;
  title: string;
  description: string;
  productionType: string;
  scriptTitle: string;
}

const initialProjects: Project[] = [
  {
    id: '1',
    title: 'The Great Adventure',
    description: 'An epic journey across uncharted lands',
    productionType: 'Feature Film',
    scriptTitle: 'great_adventure.pdf',
  },
  {
    id: '2',
    title: 'City Nights',
    description: 'A gritty crime drama set in the urban jungle',
    productionType: 'TV Series',
    scriptTitle: 'city_nights_pilot.fdx',
  },
];

function Projects() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const handleImportScript = (scriptData: { title: string; description: string; productionType: string; scriptTitle: string }) => {
    const newProject: Project = {
      id: Date.now().toString(),
      ...scriptData,
    };
    setProjects([...projects, newProject]);
    setIsImportModalOpen(false);
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Projects</h2>
        <button
          onClick={() => setIsImportModalOpen(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300"
        >
          <Plus className="h-5 w-5 mr-2" />
          Import Script
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <p className="text-xl text-gray-600">No projects yet. Import a script to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      <ImportScriptModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportScript}
      />
    </div>
  );
}

export default Projects;