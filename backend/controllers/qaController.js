import { initialData } from '../data/mockDb.js';

let questions = [...initialData.questions];

export const getQuestions = (req, res) => {
  const { search, courseId, tag } = req.query;
  let result = [...questions];

  if (courseId) {
    result = result.filter(q => q.courseId === courseId);
  }
  if (tag) {
    result = result.filter(q => q.tags.includes(tag));
  }
  if (search) {
    const s = search.toLowerCase();
    result = result.filter(q => q.title.toLowerCase().includes(s) || q.content.toLowerCase().includes(s));
  }

  res.json({ success: true, count: result.length, data: result });
};

export const createQuestion = (req, res) => {
  const { title, content, courseId, courseName, tags, authorName, authorAvatar } = req.body;
  const user = req.user;
  const newQ = {
    id: `q-${Date.now()}`,
    title,
    content,
    courseId: courseId || "cs-201",
    courseName: courseName || "CS201 - Data Structures",
    authorId: user?.id || "anonymous",
    authorName: user?.name || authorName || "Scholar",
    authorAvatar: user?.avatar || authorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    votes: 1,
    answersCount: 0,
    isSolved: false,
    tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : ["General"],
    createdAt: new Date().toISOString(),
    answers: []
  };

  questions.unshift(newQ);
  res.status(201).json({ success: true, data: newQ });
};

export const addAnswer = (req, res) => {
  const { id } = req.params;
  const { content, authorName, authorRole, authorAvatar } = req.body;
  const user = req.user;

  const question = questions.find(q => q.id === id);
  if (!question) {
    return res.status(404).json({ success: false, message: "Question not found" });
  }

  const answer = {
    id: `ans-${Date.now()}`,
    authorId: user?.id || "anonymous",
    authorName: user?.name || authorName || "Scholar",
    authorRole: user?.role || authorRole || "student",
    authorAvatar: user?.avatar || authorAvatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    content,
    votes: 1,
    isAccepted: false,
    createdAt: new Date().toISOString()
  };

  question.answers.push(answer);
  question.answersCount = question.answers.length;

  res.status(201).json({ success: true, data: question });
};

export const voteQuestion = (req, res) => {
  const { id } = req.params;
  const { delta } = req.body; // +1 or -1
  const question = questions.find(q => q.id === id);
  if (question) {
    question.votes += delta || 1;
  }
  res.json({ success: true, votes: question ? question.votes : 0 });
};
