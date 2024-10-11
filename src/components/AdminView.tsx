import React, { useState, useEffect } from 'react';
import { SubmissionData } from '../types';

const AdminView: React.FC = () => {
  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sortedSubmissions, setSortedSubmissions] = useState<Record<string, SubmissionData[]>>({});

  useEffect(() => {
    if (isAuthenticated) {
      const storedSubmissions = localStorage.getItem('submissions');
      if (storedSubmissions) {
        const parsedSubmissions = JSON.parse(storedSubmissions);
        setSubmissions(parsedSubmissions);
        
        // Sort submissions by user
        const sorted = parsedSubmissions.reduce((acc: Record<string, SubmissionData[]>, submission: SubmissionData) => {
          if (!acc[submission.userName]) {
            acc[submission.userName] = [];
          }
          acc[submission.userName].push(submission);
          return acc;
        }, {});
        setSortedSubmissions(sorted);
      }
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const password = (e.currentTarget.elements.namedItem('password') as HTMLInputElement).value;
    if (password === 'admin123') { // In a real app, use proper authentication
      setIsAuthenticated(true);
    } else {
      alert('Invalid password');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            name="password"
            placeholder="Enter admin password"
            className="w-full p-2 border rounded-md mb-4"
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-10 p-6 bg-white rounded-lg shadow-md overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4">Admin View - Submissions by User</h2>
      {Object.entries(sortedSubmissions).map(([userName, userSubmissions]) => (
        <div key={userName} className="mb-8 border-b pb-4">
          <h3 className="text-xl font-semibold mb-2">User: {userName}</h3>
          {userSubmissions.map((submission) => (
            <div key={submission.id} className="mb-4 bg-gray-100 p-4 rounded-lg">
              <p><strong>Submission ID:</strong> {submission.id}</p>
              <p><strong>Lead ID:</strong> {submission.leadId}</p>
              <p><strong>Timestamp:</strong> {new Date(submission.timestamp).toLocaleString()}</p>
              <p><strong>User Agent:</strong> {submission.metadata.userAgent}</p>
              <p><strong>Screen Size:</strong> {submission.metadata.screenSize}</p>
              <table className="w-full mt-4 border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">Question</th>
                    <th className="border p-2">Answer</th>
                  </tr>
                </thead>
                <tbody>
                  {submission.answers.map((answer) => (
                    <tr key={answer.questionId}>
                      <td className="border p-2">{answer.questionText}</td>
                      <td className="border p-2">{answer.answer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default AdminView;