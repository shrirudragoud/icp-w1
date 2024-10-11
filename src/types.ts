export interface Answer {
  questionId: number;
  questionText: string;
  answer: string;
}

export interface SubmissionData {
  id: string;
  userName: string;
  leadId: string;
  answers: Answer[];
  timestamp: string;
  metadata: {
    userAgent: string;
    screenSize: string;
  };
}

export interface Question {
  id: number;
  text: string;
  description: string;
  imageUrl: string;
}