import fs from 'fs';
import * as geminiService from '../services/geminiService.js';

/**
 * Summarize an academic resource or uploaded document
 * POST /api/ai/summarize
 */
export const summarizeResource = async (req, res) => {
  try {
    const { title, category, courseName, documentText } = req.body || {};
    let fileBuffer = null;
    let mimeType = null;
    let fileName = null;

    if (req.file) {
      fileName = req.file.originalname;
      mimeType = req.file.mimetype;
      try {
        fileBuffer = fs.readFileSync(req.file.path);
      } catch (fErr) {
        console.warn('Could not read uploaded file buffer:', fErr.message);
      }
    }

    const summary = await geminiService.summarizeResource({
      title: title || fileName || 'Uploaded Study Document',
      category: category || 'Document',
      courseName: courseName || 'Academic Course',
      documentText,
      fileBuffer,
      mimeType,
      fileName
    });

    return res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('aiController.summarizeResource error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate summary',
      error: error.message
    });
  }
};

/**
 * Generate high-yield study notes and cheat sheet
 * POST /api/ai/notes
 */
export const generateNotes = async (req, res) => {
  try {
    const { topic, courseName } = req.body;
    const notes = await geminiService.generateNotes(topic, courseName);
    return res.status(200).json({
      success: true,
      data: notes
    });
  } catch (error) {
    console.error('aiController.generateNotes error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate study notes',
      error: error.message
    });
  }
};

/**
 * Generate multiple choice quiz questions
 * POST /api/ai/mcqs
 */
export const generateMcqs = async (req, res) => {
  try {
    const { title, courseName, count } = req.body;
    const mcqs = await geminiService.generateMcqs(title, courseName, count);
    return res.status(200).json({
      success: true,
      data: mcqs
    });
  } catch (error) {
    console.error('aiController.generateMcqs error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate MCQs',
      error: error.message
    });
  }
};

/**
 * Ask the Academic AI Assistant
 * POST /api/ai/ask
 */
export const askAcademicAssistant = async (req, res) => {
  try {
    const { question, context } = req.body;
    if (!question) {
      return res.status(400).json({ success: false, message: 'Question is required' });
    }
    const answer = await geminiService.askAssistant(question, context);
    return res.status(200).json({
      success: true,
      answer
    });
  } catch (error) {
    console.error('aiController.askAcademicAssistant error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to get answer from assistant',
      error: error.message
    });
  }
};

/**
 * Explain an academic concept in depth
 * POST /api/ai/explain
 */
export const explainConcept = async (req, res) => {
  try {
    const { concept, context } = req.body;
    if (!concept) {
      return res.status(400).json({ success: false, message: 'Concept is required' });
    }
    const explanation = await geminiService.explainConcept(concept, context);
    return res.status(200).json({
      success: true,
      explanation
    });
  } catch (error) {
    console.error('aiController.explainConcept error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to explain concept',
      error: error.message
    });
  }
};

/**
 * Generate flashcards for active recall
 * POST /api/ai/flashcards
 */
export const generateFlashcards = async (req, res) => {
  try {
    const { title, topic } = req.body;
    const flashcards = await geminiService.generateFlashcards(title, topic);
    return res.status(200).json({
      success: true,
      data: flashcards
    });
  } catch (error) {
    console.error('aiController.generateFlashcards error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate flashcards',
      error: error.message
    });
  }
};

/**
 * Get AI Service Status
 * GET /api/ai/status
 */
export const getAiStatus = async (req, res) => {
  try {
    const status = geminiService.getGeminiStatus();
    return res.status(200).json({
      success: true,
      status
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to get AI status'
    });
  }
};