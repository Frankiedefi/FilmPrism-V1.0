import React, { useState, useEffect } from 'react';
import ProjectCard from './ProjectCard';

const Projects: React.FC = () => {
  const [savedProjects, setSavedProjects] = useState<any[]>([]);

  useEffect(() => {
    const projects = JSON.parse(localStorage.getItem('savedProjects') || '[]');
    setSavedProjects(projects);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Projects</h1>
      {savedProjects.length === 0 ? (
        <p>No projects saved yet.</p>
      ) : (
        savedProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))
      )}
    </div>
  );
};

export default Projects;
