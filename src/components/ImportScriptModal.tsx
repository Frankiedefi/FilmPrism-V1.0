import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ImportScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (scriptData: { title: string; description: string; productionType: string; scriptTitle: string }) => void;
}

function ImportScriptModal({ isOpen, onClose, onImport }: ImportScriptModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [productionType, setProductionType] = useState('');
  const [scriptTitle, setScriptTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onImport({ title, description, productionType, scriptTitle });
    setTitle('');
    setDescription('');
    setProductionType('');
    setScriptTitle('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Import Script</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Project Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              rows={3}
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="productionType" className="block text-sm font-medium text-gray-700 mb-1">
              Production Type
            </label>
            <select
              id="productionType"
              value={productionType}
              onChange={(e) => setProductionType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Select a type</option>
              <option value="Feature Film">Feature Film</option>
              <option value="TV Series">TV Series</option>
              <option value="Short Film">Short Film</option>
              <option value="Documentary">Documentary</option>
            </select>
          </div>
          <div className="mb-6">
            <label htmlFor="scriptTitle" className="block text-sm font-medium text-gray-700 mb-1">
              Script File
            </label>
            <input
              type="file"
              id="scriptTitle"
              onChange={(e) => setScriptTitle(e.target.files?.[0]?.name || '')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              accept=".pdf,.fdx"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-4 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300"
            >
              Import
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ImportScriptModal;