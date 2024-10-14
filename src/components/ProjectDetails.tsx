import React from 'react';
import { useParams } from 'react-router-dom';
import { Film, User, Users, FileText, BarChart } from 'lucide-react';
import { scripts } from '../data/scripts';

interface ProjectStats {
  characters: number;
  locations: number;
  scenes: number;
  dialoguePercentage: number;
}

const fakeProjectStats: Record<string, ProjectStats> = {
  '1': {
    characters: 3,
    locations: 2,
    scenes: 3,
    dialoguePercentage: 40,
  },
  '2': {
    characters: 4,
    locations: 3,
    scenes: 4,
    dialoguePercentage: 60,
  },
};

function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const project = {
    id: id,
    title: id === '1' ? 'The Great Adventure' : 'City Nights',
    description: id === '1' ? 'An epic journey across uncharted lands' : 'A gritty crime drama set in the urban jungle',
    productionType: id === '1' ? 'Feature Film' : 'TV Series',
    scriptTitle: id === '1' ? 'great_adventure.pdf' : 'city_nights_pilot.fdx',
  };
  const stats = fakeProjectStats[id || '1'];
  const scriptContent = id === '1' ? scripts.great_adventure : scripts.city_nights;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">{project.title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Project Overview</h3>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 mb-4">{project.description}</p>
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <Film className="h-5 w-5 mr-2" />
              <span className="font-medium mr-2">Type:</span>
              {project.productionType}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <FileText className="h-5 w-5 mr-2" />
              <span className="font-medium mr-2">Script:</span>
              {project.scriptTitle}
            </div>
          </div>

          <h3 className="text-xl font-semibold mt-8 mb-4">Script Statistics</h3>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-indigo-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Characters</p>
                  <p className="text-xl font-semibold">{stats.characters}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Film className="h-8 w-8 text-indigo-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Scenes</p>
                  <p className="text-xl font-semibold">{stats.scenes}</p>
                </div>
              </div>
              <div className="flex items-center">
                <User className="h-8 w-8 text-indigo-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Locations</p>
                  <p className="text-xl font-semibold">{stats.locations}</p>
                </div>
              </div>
              <div className="flex items-center">
                <BarChart className="h-8 w-8 text-indigo-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Dialogue</p>
                  <p className="text-xl font-semibold">{stats.dialoguePercentage}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Script Preview</h3>
          <div className="bg-white rounded-lg shadow-md p-6 h-[600px] overflow-y-auto">
            <pre className="text-sm font-mono whitespace-pre-wrap">{scriptContent}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetails;