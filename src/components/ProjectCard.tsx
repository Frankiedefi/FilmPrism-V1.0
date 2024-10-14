import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Film } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  productionType: string;
  scriptTitle: string;
}

interface ProjectCardProps {
  project: Project;
}

function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
      <div className="flex items-center mb-4">
        <Film className="h-8 w-8 text-indigo-600 mr-3" />
        <h3 className="text-xl font-semibold">{project.title}</h3>
      </div>
      <p className="text-gray-600 mb-4">{project.description}</p>
      <div className="flex items-center text-sm text-gray-500 mb-2">
        <span className="font-medium mr-2">Type:</span>
        {project.productionType}
      </div>
      <div className="flex items-center text-sm text-gray-500">
        <FileText className="h-4 w-4 mr-2" />
        {project.scriptTitle}
      </div>
      <Link
        to={`/dashboard/projects/${project.id}`}
        className="mt-4 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition duration-300 text-center"
      >
        View Project
      </Link>
    </div>
  );
}

export default ProjectCard;