import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, RefreshCw, Film, Tv, Mic, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { generateDialogue } from '../services/llm';

interface StoryCardProps {
  onComplete: (storyContext: StoryContext) => void;
  onLogUpdate: (entry: string) => void;
}

interface StoryContext {
  scriptType: string;
  genres: string[];
  timePeriod: string;
  logline: string;
  title: string;
}

const initialAnswers: StoryContext = {
  scriptType: '',
  genres: [],
  timePeriod: '',
  logline: '',
  title: '',
};

const scriptTypes = ['Film', 'TV', 'Podcast'];
const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Thriller', 'Romance', 'Fantasy', 'Sci-Fi', 'Mystery', 'Adventure'];
const timePeriods = ['Ancient History', 'Medieval', 'Renaissance', 'Industrial Revolution', 'Roaring Twenties', 'Great Depression', 'World War II', 'Cold War', 'Modern Day', 'Near Future', 'Distant Future'];

const StoryCard: React.FC<StoryCardProps> = ({ onComplete, onLogUpdate }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<StoryContext>(initialAnswers);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [generatedIdea, setGeneratedIdea] = useState<string | null>(null);

  const handleNext = useCallback(() => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete(answers);
    }
  }, [currentStep, answers, onComplete]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const handleScriptTypeSelect = useCallback((type: string) => {
    setAnswers(prev => ({ ...prev, scriptType: type }));
    onLogUpdate(`Script type selected: ${type}`);
    handleNext();
  }, [handleNext, onLogUpdate]);

  const handleGenreSelect = useCallback((genre: string) => {
    setAnswers(prev => {
      const newGenres = prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre].slice(0, 3);
      onLogUpdate(`Genres updated: ${newGenres.join(', ')}`);
      return { ...prev, genres: newGenres };
    });
  }, [onLogUpdate]);

  const handleTimePeriodSelect = useCallback((period: string) => {
    setAnswers(prev => ({ ...prev, timePeriod: period }));
    onLogUpdate(`Time period selected: ${period}`);
  }, [onLogUpdate]);

  const handleInputChange = useCallback((key: keyof StoryContext, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
    onLogUpdate(`${key.charAt(0).toUpperCase() + key.slice(1)} updated: ${value}`);
  }, [onLogUpdate]);

  const generateLogline = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Generate a compelling logline for a ${answers.scriptType} script in the ${answers.genres.join(', ')} genre(s), set in the ${answers.timePeriod} time period.`;
      const logline = await generateDialogue(prompt, [], JSON.stringify(answers));
      setAnswers(prev => ({ ...prev, logline }));
      onLogUpdate('Logline generated');
    } catch (error) {
      console.error('Error generating logline:', error);
      setAnswers(prev => ({ ...prev, logline: 'Failed to generate a logline. Please try again or enter your own.' }));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateIdea = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Generate a detailed story idea for a ${answers.scriptType} script with the following details:
      Genres: ${answers.genres.join(', ')}
      Time Period: ${answers.timePeriod}
      Logline: ${answers.logline}
      Title: ${answers.title}`;
      const idea = await generateDialogue(prompt, [], JSON.stringify(answers));
      setGeneratedIdea(idea);
      onLogUpdate('Story idea generated');
    } catch (error) {
      console.error('Error generating story idea:', error);
      setGeneratedIdea('Failed to generate a story idea. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold">Story Card</h3>
        <button onClick={() => setIsExpanded(!isExpanded)} className="text-gray-500 hover:text-gray-700">
          {isExpanded ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
        </button>
      </div>
      {isExpanded && (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 0 && (
              <div>
                <h4 className="text-lg font-semibold mb-2">Select Script Type</h4>
                <div className="flex space-x-4">
                  {scriptTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => handleScriptTypeSelect(type)}
                      className={`flex items-center justify-center p-4 rounded-lg ${
                        answers.scriptType === type ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {type === 'Film' && <Film className="h-6 w-6 mr-2" />}
                      {type === 'TV' && <Tv className="h-6 w-6 mr-2" />}
                      {type === 'Podcast' && <Mic className="h-6 w-6 mr-2" />}
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {currentStep === 1 && (
              <div>
                <h4 className="text-lg font-semibold mb-2">Select Genres (up to 3)</h4>
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => handleGenreSelect(genre)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        answers.genres.includes(genre)
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {currentStep === 2 && (
              <div>
                <h4 className="text-lg font-semibold mb-2">Select Time Period</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {timePeriods.map((period) => (
                    <button
                      key={period}
                      onClick={() => handleTimePeriodSelect(period)}
                      className={`flex items-center justify-center p-2 rounded-lg ${
                        answers.timePeriod === period ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      {period}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {currentStep === 3 && (
              <div>
                <h4 className="text-lg font-semibold mb-2">Generate or Enter Logline</h4>
                <textarea
                  value={answers.logline}
                  onChange={(e) => handleInputChange('logline', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 mb-2"
                  placeholder="Enter a brief logline for your story or generate one"
                  rows={3}
                />
                <button
                  onClick={generateLogline}
                  disabled={isGenerating}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-5 w-5 mr-2" />
                      Generate Logline
                    </>
                  )}
                </button>
              </div>
            )}
            {currentStep === 4 && (
              <div>
                <h4 className="text-lg font-semibold mb-2">Enter Title</h4>
                <input
                  type="text"
                  value={answers.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your story title"
                />
              </div>
            )}
            {currentStep === 5 && (
              <div>
                <h4 className="text-lg font-semibold mb-2">Generate Story Idea</h4>
                <button
                  onClick={handleGenerateIdea}
                  disabled={isGenerating}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-5 w-5 mr-2" />
                      Generate Story Idea
                    </>
                  )}
                </button>
              </div>
            )}
            <div className="flex justify-between mt-4">
              {currentStep > 0 && (
                <button
                  onClick={handleBack}
                  className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-300"
                >
                  <ChevronLeft className="h-5 w-5 mr-2" />
                  Back
                </button>
              )}
              {currentStep < 5 && (
                <button
                  onClick={handleNext}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300 ml-auto"
                >
                  Next
                  <ChevronRight className="h-5 w-5 ml-2" />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
      {generatedIdea && (
        <div className="mt-4 p-4 bg-indigo-100 rounded-md">
          <h4 className="font-semibold mb-2">Generated Story Idea:</h4>
          <p>{generatedIdea}</p>
        </div>
      )}
    </div>
  );
};

export default StoryCard;