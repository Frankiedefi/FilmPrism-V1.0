import { Routes, Route, Link } from 'react-router-dom';
import { Film, FileText, DollarSign, Calendar, Users, LogOut, Sparkles } from 'lucide-react';
import Projects from './Projects';
import ProjectDetails from './ProjectDetails';
import Scripts from './Scripts';
import LLMSelector from './LLMSelector';
import FilmPrismV1 from './FilmPrismV1';

const Budget = () => <div>Budget Component</div>;
const Schedule = () => <div>Schedule Component</div>;
const Team = () => <div>Team Component</div>;

function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-800 text-white">
        <div className="flex items-center justify-center h-16 bg-indigo-900">
          <Film className="h-8 w-8 mr-2" />
          <span className="text-xl font-semibold">FilmPro AI</span>
        </div>
        <nav className="mt-8">
          <Link to="/dashboard" className="flex items-center px-6 py-2 hover:bg-indigo-700">
            <FileText className="h-5 w-5 mr-3" />
            Projects
          </Link>
          <Link to="/dashboard/scripts" className="flex items-center px-6 py-2 mt-4 hover:bg-indigo-700">
            <FileText className="h-5 w-5 mr-3" />
            Scripts
          </Link>
          <Link to="/dashboard/film-prism-v1" className="flex items-center px-6 py-2 mt-4 hover:bg-indigo-700">
            <Sparkles className="h-5 w-5 mr-3" />
            Film Prism V1
          </Link>
          <Link to="/dashboard/budget" className="flex items-center px-6 py-2 mt-4 hover:bg-indigo-700">
            <DollarSign className="h-5 w-5 mr-3" />
            Budget
          </Link>
          <Link to="/dashboard/schedule" className="flex items-center px-6 py-2 mt-4 hover:bg-indigo-700">
            <Calendar className="h-5 w-5 mr-3" />
            Schedule
          </Link>
          <Link to="/dashboard/team" className="flex items-center px-6 py-2 mt-4 hover:bg-indigo-700">
            <Users className="h-5 w-5 mr-3" />
            Team
          </Link>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center p-4 bg-white border-b border-gray-200">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <div className="flex items-center">
            <LLMSelector />
            <Link to="/" className="flex items-center text-gray-600 hover:text-gray-800 ml-4">
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
          <Routes>
            <Route index element={<Projects />} />
            <Route path="projects/:id" element={<ProjectDetails />} />
            <Route path="scripts" element={<Scripts />} />
            <Route path="film-prism-v1" element={<FilmPrismV1 />} />
            <Route path="budget" element={<Budget />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="team" element={<Team />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
