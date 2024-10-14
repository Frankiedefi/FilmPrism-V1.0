import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, RefreshCw, Film, Tv, Mic, ChevronDown, ChevronUp, Clock, Upload, Music, Video } from 'lucide-react';
import { generateDialogue } from '../services/llm';

interface StoryCardProps {
  onComplete: (storyContext: StoryContext) => void;
  onLogUpdate: (entry: string) => void;
}

interface StoryContext {
  option: string;
  scriptType: string;
  genres: string[];
  timePeriod: string;
  logline: string;
  title: string;
  characters: string[];
  setting: string;
  conflict: string;
  theme: string;
  uploadedScene?: File | null;
  commercialProduct?: string;
  musicLyrics?: string;
}

const initialAnswers: StoryContext = {
  option: '',
  scriptType: '',
  genres: [],
  timePeriod: '',
  logline: '',
  title: '',
  characters: [],
  setting: '',
  conflict: '',
  theme: '',
};

const options = [
  { id: 'createScene', label: 'Create a Scene', icon: Film },
  { id: 'uploadScene', label: 'Upload a Scene', icon: Upload },
  { id: 'createCommercial', label: 'Create a Short TV Commercial', icon: Tv },
  { id: 'createMusicVideo', label: 'Create a Music Video with Lyrics', icon: Music },
];

const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Thriller', 'Romance', 'Fantasy', 'Sci-Fi', 'Mystery', 'Adventure'];
const timePeriods = ['Ancient History', 'Medieval', 'Renaissance', 'Industrial Revolution', 'Roaring Twenties', 'Great Depression', 'World War II', 'Cold War', 'Modern Day', 'Near Future', 'Distant Future'];

const StoryCard: React.FC<StoryCardProps> = ({ onComplete, onLogUpdate }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<StoryContext>(initialAnswers);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showCharacterContext, setShowCharacterContext] = useState(false);

  const handleNext = useCallback(() => {
    const maxSteps = {
      createScene: 8,
      uploadScene: 1,
      createCommercial: 2,
      createMusicVideo: 2,
    };
    if (currentStep < maxSteps[answers.option as keyof typeof maxSteps]) {
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

  const handleOptionSelect = useCallback((option: string) => {
    setAnswers(prev => ({ ...prev, option }));
    onLogUpdate(`Option selected: ${option}`);
    setCurrentStep(1); // Automatically move to the next step
  }, [onLogUpdate]);

  const handleInputChange = useCallback((key: keyof StoryContext, value: string | string[] | File | null) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
    onLogUpdate(`${key.charAt(0).toUpperCase() + key.slice(1)} updated: ${value instanceof File ? value.name : value}`);
  }, [onLogUpdate]);

  const generateLogline = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Generate a compelling logline for a ${answers.scriptType} in the ${answers.genres.join(', ')} genre(s), set in the ${answers.timePeriod} time period.`;
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

  const generateStoryElements = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Based on the following story details:
      Script Type: ${answers.scriptType}
      Genres: ${answers.genres.join(', ')}
      Time Period: ${answers.timePeriod}
      Logline: ${answers.logline}
      Title: ${answers.title}

      Generate the following story elements:
      1. Main characters (comma-separated list)
      2. Setting description
      3. Central conflict
      4. Theme

      Format the response as JSON with keys: characters, setting, conflict, theme`;

      const response = await generateDialogue(prompt, [], JSON.stringify(answers));
      const storyElements = JSON.parse(response);
      
      setAnswers(prev => ({
        ...prev,
        characters: storyElements.characters.split(',').map((char: string) => char.trim()),
        setting: storyElements.setting,
        conflict: storyElements.conflict,
        theme: storyElements.theme
      }));
      
      onLogUpdate('Story elements generated');
    } catch (error) {
      console.error('Error generating story elements:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (answers.option === 'createScene' && currentStep === 7) {
      generateStoryElements();
    }
  }, [currentStep, answers.option]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold">Story Card</h3>
        <button onClick={() => setIsExpanded(!isExpanded)} className="text-gray-500 hover:text-gray-700">
          {isExpanded ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
        </button>
      </div>
      {isExpanded && (
        <div>
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
                  <h4 className="text-lg font-semibold mb-2">Select an Option</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {options.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleOptionSelect(option.id)}
                        className="flex items-center justify-center p-4 rounded-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition duration-300"
                      >
                        <option.icon className="h-6 w-6 mr-2" />
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {/* Add the rest of your step renderings here */}
              {currentStep > 0 && (
                <div className="flex justify-between mt-4">
                  <button
                    onClick={handleBack}
                    className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-300"
                  >
                    <ChevronLeft className="h-5 w-5 mr-2" />
                    Back
                  </button>
                  {currentStep < (answers.option === 'createScene' ? 8 : answers.option === 'uploadScene' ? 1 : 2) && (
                    <button
                      onClick={handleNext}
                      className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300"
                    >
                      Next
                      <ChevronRight className="h-5 w-5 ml-2" />
                    </button>
                  )}
                  {currentStep === (answers.option === 'createScene' ? 8 : answers.option === 'uploadScene' ? 1 : 2) && (
                    <button
                      onClick={() => onComplete(answers)}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
                    >
                      Complete
                      <ChevronRight className="h-5 w-5 ml-2" />
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default StoryCard;
