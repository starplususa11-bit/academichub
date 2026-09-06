import express from 'express';
import multer from 'multer';
import path from 'path';


import * as auth from '../controllers/authController.js';
import * as resource from '../controllers/resourceController.js';
import * as dept from '../controllers/departmentController.js';
import * as qa from '../controllers/qaController.js';
import * as group from '../controllers/groupController.js';
import * as admin from '../controllers/adminController.js';
import * as ai from '../controllers/aiController.js';

import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure Multer file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

import { protect, optionalAuth, authorizeRoles } from '../middleware/authMiddleware.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';
import {
  validateLogin,
  validateRegister,
  validateForgotPassword,
  validateResourceUpload
} from '../middleware/validator.js';

const router = express.Router();

// Auth & OTP Routes (Protected with Rate Limiting & Input Validation)
router.get('/auth/me', protect, auth.getCurrentUser);
router.post('/auth/login', authRateLimiter, validateLogin, auth.login);
router.post('/auth/verify-login-otp', authRateLimiter, auth.verifyLoginOtp);
router.post('/auth/register', authRateLimiter, validateRegister, auth.register);
router.post('/auth/signup', authRateLimiter, validateRegister, auth.register);
router.post('/auth/verify-signup-otp', authRateLimiter, auth.verifySignupOtp);
router.post('/auth/resend-otp', authRateLimiter, auth.resendOtp);
router.post('/auth/forgot-password', authRateLimiter, validateForgotPassword, auth.forgotPassword);
router.post('/auth/reset-password', authRateLimiter, auth.resetPassword);
router.post('/auth/switch-role', auth.switchRole);

// Super Admin Privileged Approval Routes
router.get('/admin/pending-approvals', protect, authorizeRoles('admin'), auth.getPendingApprovals);
router.post('/admin/approve-user/:id', protect, authorizeRoles('admin'), auth.approveUser);
router.post('/admin/reject-user/:id', protect, authorizeRoles('admin'), auth.rejectUser);

// Department & Course Routes
router.get('/departments', dept.getDepartments);
router.post('/departments', dept.createDepartment);
router.get('/courses', dept.getCourses);
router.post('/courses', dept.createCourse);

// Resource Routes
router.get('/resources', resource.getResources);
router.get('/resources/bookmarks', optionalAuth, resource.getBookmarks);
router.get('/resources/collections', resource.getCollections);
router.post('/resources/collections', resource.createCollection);
router.get('/resources/:id', resource.getResourceById);
router.post('/resources', protect, upload.single('file'), validateResourceUpload, resource.createResource);
router.patch('/resources/:id/status', resource.updateResourceStatus);
router.post('/resources/:id/reviews', resource.addReview);
router.post('/resources/:id/bookmark', optionalAuth, resource.toggleBookmark);
router.post('/resources/:id/download', resource.incrementDownload);

// Academic Q&A Routes
router.get('/questions', optionalAuth, qa.getQuestions);
router.post('/questions', optionalAuth, qa.createQuestion);
router.post('/questions/:id/answers', optionalAuth, qa.addAnswer);
router.post('/questions/:id/vote', qa.voteQuestion);

// Study Groups Routes
router.get('/groups', optionalAuth, group.getStudyGroups);
router.post('/groups', protect, group.createStudyGroup);
router.delete('/groups/:id', protect, group.deleteStudyGroup);
router.post('/groups/:id/join', optionalAuth, group.joinStudyGroup);

// Admin & Moderation Routes
router.get('/admin/analytics', admin.getAnalytics);
router.get('/announcements', admin.getAnnouncements);
router.post('/announcements', admin.createAnnouncement);
router.get('/reports', admin.getReports);
router.post('/reports/:id/resolve', admin.resolveReport);

// AI Features Routes
router.post('/ai/summarize', upload.single('file'), ai.summarizeResource);
router.post('/ai/notes', ai.generateNotes);
router.post('/ai/mcqs', ai.generateMcqs);
router.post('/ai/ask', ai.askAcademicAssistant);
router.post('/ai/explain', ai.explainConcept);
router.post('/ai/flashcards', ai.generateFlashcards);
router.get('/ai/status', ai.getAiStatus);

export default router;
