import React, { useState } from 'react';
import QuestionForm from './components/QuestionForm';
import AdminView from './components/AdminView';
import { Clipboard, ShieldCheck } from 'lucide-react';

function App() {
  const [view, setView] = useState<'form' | 'admin'>('form');

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-white text-3xl font-bold">
            ICP Worksheet Module
          </h1>
          <div>
            <button
              onClick={() => setView('form')}
              className={`mr-4 px-6 py-2 rounded-md transition duration-300 ${
                view === 'form'
                  ? 'bg-white text-blue-600'
                  : 'bg-blue-500 text-white hover:bg-blue-400'
              }`}
            >
              <Clipboard className="inline-block mr-2" size={20} />
              Questionnaire
            </button>
            <button
              onClick={() => setView('admin')}
              className={`px-6 py-2 rounded-md transition duration-300 ${
                view === 'admin'
                  ? 'bg-white text-blue-600'
                  : 'bg-blue-500 text-white hover:bg-blue-400'
              }`}
            >
              <ShieldCheck className="inline-block mr-2" size={20} />
              Admin
            </button>
          </div>
        </div>
      </nav>
      <div className="container mx-auto p-4">
        {view === 'form' ? <QuestionForm /> : <AdminView />}
      </div>
    </div>
  );
}

export default App;
