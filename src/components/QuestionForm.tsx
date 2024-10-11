import React, { useState, useEffect } from 'react';
import { questions } from '../questions';
import { Answer, SubmissionData } from '../types';
import { HelpCircle, ChevronRight, Check, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const QuestionForm: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(-2);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [userName, setUserName] = useState('');
  const [leadId, setLeadId] = useState('');
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentQuestion]);

  const handleNextQuestion = () => {
    if (currentQuestion === -2) {
      setUserName(currentAnswer);
      setCurrentQuestion(-1);
    } else if (currentQuestion === -1) {
      setLeadId(currentAnswer);
      setCurrentQuestion(0);
    } else {
      setAnswers([...answers, {
        questionId: questions[currentQuestion].id,
        questionText: questions[currentQuestion].text,
        answer: currentAnswer
      }]);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        submitAnswers();
      }
    }
    setCurrentAnswer('');
  };

  const submitAnswers = () => {
    setIsSubmitting(true);
    const submissionData: SubmissionData = {
      id: Date.now().toString(),
      userName,
      leadId,
      answers,
      timestamp: new Date().toISOString(),
      metadata: {
        userAgent: navigator.userAgent,
        screenSize: `${window.screen.width}x${window.screen.height}`,
      },
    };

    const existingData = localStorage.getItem('submissions');
    const submissions = existingData ? JSON.parse(existingData) : [];
    submissions.push(submissionData);
    localStorage.setItem('submissions', JSON.stringify(submissions));

    setTimeout(() => {
      setIsSubmitting(false);
      setShowSummary(true);
    }, 1500);
  };

  const resetForm = () => {
    setCurrentQuestion(-2);
    setAnswers([]);
    setUserName('');
    setLeadId('');
    setCurrentAnswer('');
    setShowSummary(false);
  };

  const getCurrentQuestion = () => {
    if (currentQuestion === -2) {
      return "What is your name?";
    } else if (currentQuestion === -1) {
      return "What is your lead ID?";
    } else {
      return questions[currentQuestion].text;
    }
  };

  const getCurrentDescription = () => {
    if (currentQuestion >= 0 && currentQuestion < questions.length) {
      return questions[currentQuestion].description;
    }
    return "";
  };

  const getCurrentImage = () => {
    if (currentQuestion === -2 || currentQuestion === -1) {
      // Default image for name and lead ID questions
      return "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80";
    } else if (currentQuestion >= 0 && currentQuestion < questions.length) {
      return questions[currentQuestion].imageUrl;
    }
    return "";
  };

  if (showSummary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden p-8">
          <h2 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Summary of Your Answers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {answers.map((answer, index) => (
              <motion.div
                key={answer.questionId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-blue-50 p-6 rounded-lg shadow-md"
              >
                <h3 className="text-lg font-semibold mb-2 text-blue-800">{answer.questionText}</h3>
                <p className="text-gray-700">{answer.answer}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-500 text-white px-8 py-3 rounded-full font-medium transition duration-300 flex items-center mx-auto"
              onClick={resetForm}
            >
              <RefreshCcw size={20} className="mr-2" />
              Start New Questionnaire
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl bg-gray-900 rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 h-64 md:h-auto">
            <img
              src={getCurrentImage()}
              alt="Question illustration"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full md:w-1/2 p-8">
            <h2 className="text-3xl font-bold mb-6 text-white">
              {currentQuestion < 0 ? "Get Started with Us" : `Question ${currentQuestion + 1} of ${questions.length}`}
            </h2>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-4 text-xl font-medium text-white">
                  {getCurrentQuestion()}
                </div>
                {currentQuestion >= 0 && (
                  <div className="mb-6 p-4 bg-gray-800 text-gray-300 rounded-lg flex items-start">
                    <HelpCircle size={24} className="mr-3 flex-shrink-0 mt-1" />
                    <p className="text-sm">{getCurrentDescription()}</p>
                  </div>
                )}
                <textarea
                  className="w-full p-4 bg-gray-800 text-white border-2 border-gray-700 rounded-lg mb-6 h-40 resize-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200 ease-in-out"
                  placeholder="Enter your answer here"
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                />
              </motion.div>
            </AnimatePresence>
            <div className="flex justify-between items-center">
              {currentQuestion >= 0 && (
                <div className="text-sm text-gray-400">
                  Progress: {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
                </div>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`${
                  currentAnswer.trim() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 cursor-not-allowed'
                } text-white px-8 py-3 rounded-full font-medium transition duration-300 flex items-center`}
                onClick={handleNextQuestion}
                disabled={!currentAnswer.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="mr-2"
                    >
                      <Check size={20} />
                    </motion.span>
                    Submitting...
                  </span>
                ) : (
                  <>
                    {currentQuestion < questions.length - 1 ? 'Next' : 'Submit'}
                    <ChevronRight size={20} className="ml-2" />
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>
        {currentQuestion >= 0 && (
          <div className="bg-gray-800 h-2 w-full">
            <motion.div
              className="h-full bg-blue-600"
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default QuestionForm;