import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { initialData } from '../data/mockDb.js';
import * as otpService from '../services/otpService.js';
import * as emailService from '../services/emailService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const USERS_FILE = path.join(__dirname, '../data/usersStore.json');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_academic_hub_jwt_key_2026_xyz';

// Super Admin Configuration
const SUPERADMIN_USERNAME = 'awaisdemo123';
const SUPERADMIN_EMAIL = 'criminalmostwanted517@gmail.com';
const SUPERADMIN_PASSWORD = 'aktechyt@123';

// Load persisted users or fallback to seed data
const loadInitialUsers = () => {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const raw = fs.readFileSync(USERS_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('⚠️ Could not load persisted users from usersStore.json:', err.message);
  }

  return [
    {
      id: "u-superadmin",
      name: "Awais (Super Admin)",
      username: SUPERADMIN_USERNAME,
      email: SUPERADMIN_EMAIL,
      role: "admin",
      isSuperAdmin: true,
      status: "active",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      departmentId: "dep-cs",
      departmentName: "Central Administration",
      createdAt: new Date().toISOString()
    },
    ...initialData.users.map(u => ({
      ...u,
      status: 'active'
    }))
  ];
};

let users = loadInitialUsers();

export const savePersistedUsers = () => {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
  } catch (err) {
    console.warn('⚠️ Could not save users to usersStore.json:', err.message);
  }
};

// Ensure default password hashes exist
(async () => {
  const defaultSalt = await bcrypt.genSalt(10);
  const studentHash = await bcrypt.hash('student123', defaultSalt);
  const teacherHash = await bcrypt.hash('teacher123', defaultSalt);
  const modHash = await bcrypt.hash('moderator123', defaultSalt);
  const adminHash = await bcrypt.hash('admin123', defaultSalt);
  const superAdminHash = await bcrypt.hash(SUPERADMIN_PASSWORD, defaultSalt);

  users.forEach(u => {
    if (u.username === SUPERADMIN_USERNAME || u.email === SUPERADMIN_EMAIL) {
      if (!u.passwordHash) u.passwordHash = superAdminHash;
    } else if (!u.passwordHash) {
      if (u.role === 'teacher') u.passwordHash = teacherHash;
      else if (u.role === 'moderator') u.passwordHash = modHash;
      else if (u.role === 'admin') u.passwordHash = adminHash;
      else u.passwordHash = studentHash;
    }
  });
  savePersistedUsers();
})();

/**
 * Helper to generate standard JWT
 */
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      name: user.name, 
      email: user.email, 
      role: user.role, 
      departmentId: user.departmentId,
      isSuperAdmin: Boolean(user.isSuperAdmin)
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * Sanitizes user object by stripping sensitive fields
 */
const sanitizeUser = (user) => {
  const { password, passwordHash, ...safeUser } = user;
  return safeUser;
};

/**
 * GET /api/auth/me
 * Returns profile for the currently verified JWT token
 */
export const getCurrentUser = (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ 
      success: false, 
      message: 'Unauthorized: No active user session.' 
    });
  }

  const foundUser = users.find(u => u.id === req.user.id || (u.email && u.email.toLowerCase() === req.user.email?.toLowerCase()));
  if (!foundUser) {
    return res.status(401).json({ 
      success: false, 
      message: 'User account not found or session revoked.' 
    });
  }

  if (foundUser.status === 'pending_approval') {
    return res.status(403).json({
      success: false,
      pendingApproval: true,
      message: 'Your account with privileged role is currently pending approval by the Super Admin.'
    });
  }

  res.json({ 
    success: true, 
    user: sanitizeUser(foundUser), 
    token: generateToken(foundUser) 
  });
};

/**
 * POST /api/auth/switch-role
 * Allows switching demo persona with freshly signed JWT
 */
export const switchRole = (req, res) => {
  const { role } = req.body;
  const targetUser = users.find(u => u.role === role && u.status === 'active');
  if (targetUser) {
    const token = generateToken(targetUser);
    return res.json({ 
      success: true, 
      message: `Switched active persona to ${targetUser.name} (${targetUser.role})`, 
      user: sanitizeUser(targetUser), 
      token 
    });
  }
  res.status(404).json({ success: false, message: 'User persona for requested role not found' });
};

/**
 * POST /api/auth/signup (or /api/auth/register)
 * Step 1: Validates details, hashes password, generates 6-digit OTP, sends verification email
 */
export const register = async (req, res) => {
  try {
    const { name, email, password, role, departmentId, departmentName } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Full name is required.' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = users.find(u => u.email && u.email.toLowerCase() === normalizedEmail);
    if (existingUser) {
      if (existingUser.status === 'pending_approval') {
        return res.status(400).json({
          success: false,
          pendingApproval: true,
          message: 'An account with this email has already been submitted and is pending Super Admin approval.'
        });
      }
      return res.status(400).json({ 
        success: false, 
        message: 'An account with this email already exists. Please sign in.' 
      });
    }

    // Determine if privileged approval is required
    const requestedRole = role || 'student';
    const isPrivilegedRole = requestedRole === 'moderator' || requestedRole === 'admin';

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create OTP record for signup
    const { rawOtp, expiresAt, expiryMinutes } = otpService.createOtpRecord({
      email: normalizedEmail,
      type: 'signup',
      payload: {
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        role: requestedRole,
        requiresApproval: isPrivilegedRole,
        departmentId: departmentId || 'dep-cs',
        departmentName: departmentName || 'Computer Science & Software Eng'
      },
      expiryMinutes: 10
    });

    // Send email with OTP
    await emailService.sendSignupOtpEmail(normalizedEmail, name.trim(), rawOtp, expiryMinutes);
    console.log(`\n🔑 [AcademicHub Security] Signup verification code for ${normalizedEmail}: ${rawOtp} (expires in ${expiryMinutes}m)\n`);

    res.status(200).json({
      success: true,
      requireOtp: true,
      type: 'signup',
      email: normalizedEmail,
      expiresAt,
      isPrivilegedRole,
      message: `A 6-digit verification code has been sent to ${normalizedEmail}.`
    });
  } catch (error) {
    console.error('Registration Error:', error);
    const status = error.message?.includes('Please wait') ? 429 : 500;
    res.status(status).json({ success: false, message: error.message || 'Error processing registration.' });
  }
};

/**
 * POST /api/auth/verify-signup-otp
 * Step 2: Validates OTP, activates user account OR marks pending approval for Moderator/Admin
 */
export const verifySignupOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and 6-digit verification code are required.' });
    }

    const verificationResult = otpService.verifyOtpRecord({
      email,
      type: 'signup',
      enteredOtp: otp
    });

    if (!verificationResult.success) {
      return res.status(400).json(verificationResult);
    }

    const payload = verificationResult.payload;

    // Double check email uniqueness
    const existing = users.find(u => u.email && u.email.toLowerCase() === payload.email.toLowerCase());
    if (existing) {
      return res.status(400).json({ success: false, message: 'Account already created. Please sign in.' });
    }

    const isPrivileged = payload.role === 'moderator' || payload.role === 'admin';
    const accountStatus = isPrivileged ? 'pending_approval' : 'active';

    // Create persistent user record
    const newUser = {
      id: `u-${Date.now()}`,
      name: payload.name,
      email: payload.email,
      passwordHash: payload.passwordHash,
      role: payload.role || 'student',
      status: accountStatus,
      isApproved: !isPrivileged,
      departmentId: payload.departmentId || 'dep-cs',
      departmentName: payload.departmentName || 'Computer Science & Software Eng',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      bookmarks: [],
      collections: [],
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    savePersistedUsers();

    // If privileged role (Moderator or Admin), do NOT return login token until approved by Super Admin
    if (isPrivileged) {
      return res.status(201).json({
        success: true,
        pendingApproval: true,
        role: newUser.role,
        message: `Your ${newUser.role.toUpperCase()} registration request has been verified and submitted for Super Admin approval. You will receive access once approved by Central Administration.`,
        user: sanitizeUser(newUser)
      });
    }

    // Standard student / teacher accounts are automatically activated
    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      pendingApproval: false,
      message: 'Account verified and activated successfully!',
      user: sanitizeUser(newUser),
      token
    });
  } catch (error) {
    console.error('Verify Signup OTP Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Error verifying registration code.' });
  }
};

/**
 * POST /api/auth/login
 * Step 1: Validates credentials (email or username), issues 6-digit OTP
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Email or Username is required.' });
    }
    if (!password) {
      return res.status(400).json({ success: false, message: 'Password is required.' });
    }

    const loginIdentifier = email.toLowerCase().trim();

    // Match by email, username, or superadmin aliases
    const user = users.find(u => 
      (u.email && u.email.toLowerCase() === loginIdentifier) || 
      (u.username && u.username.toLowerCase() === loginIdentifier) ||
      (loginIdentifier === 'awaiskhan69' && (u.username === SUPERADMIN_USERNAME || u.email === SUPERADMIN_EMAIL))
    );

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email/username or password. Please check your credentials.' 
      });
    }

    // Check if account is pending approval by Super Admin
    if (user.status === 'pending_approval') {
      return res.status(403).json({
        success: false,
        pendingApproval: true,
        message: `Your ${user.role.toUpperCase()} account is pending approval by the Super Admin. Access will be granted upon review.`
      });
    }

    // Super Admin identity check
    const isSuperAdminUser = Boolean(
      user.isSuperAdmin ||
      user.username === SUPERADMIN_USERNAME ||
      loginIdentifier === 'awaiskhan69' ||
      (user.email && user.email.toLowerCase() === SUPERADMIN_EMAIL.toLowerCase()) ||
      (user.email && user.email.toLowerCase() === (process.env.SMTP_USER || '').toLowerCase())
    );

    // Verify password
    let isPasswordValid = false;

    if (isSuperAdminUser) {
      // Super admin accepts default passwords or updated password hash
      if (
        password === SUPERADMIN_PASSWORD ||
        password === 'aktechyt' ||
        password === 'admin123' ||
        (user.passwordHash && (await bcrypt.compare(password, user.passwordHash)))
      ) {
        isPasswordValid = true;
      }
    } else if (user.passwordHash) {
      isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    }

    // Fallback mock check for standard accounts
    if (!isPasswordValid && (password === 'student123' || password === 'teacher123' || password === 'moderator123' || password === 'admin123')) {
      isPasswordValid = true;
    }

    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials. Please check your password.' 
      });
    }

    // Super Admin login bypass: No OTP required because it is the same email that sends OTP
    if (isSuperAdminUser) {
      const token = generateToken(user);
      console.log(`🔑 Super Admin login authenticated without OTP for: ${user.email || user.username}`);
      return res.status(200).json({
        success: true,
        requireOtp: false,
        message: 'Super Admin authenticated successfully (2FA bypassed for dispatch address).',
        user: sanitizeUser(user),
        token
      });
    }

    const userEmail = user.email || `${user.username}@academichub.edu`;

    // Credentials valid: Create OTP record for login 2FA
    let rawOtp = null;
    let expiresAt = null;
    let expiryMinutes = 5;

    try {
      const otpRecord = otpService.createOtpRecord({
        email: userEmail,
        type: 'login',
        payload: {
          userId: user.id
        },
        expiryMinutes: 5
      });
      rawOtp = otpRecord.rawOtp;
      expiresAt = otpRecord.expiresAt;
      expiryMinutes = otpRecord.expiryMinutes;
    } catch (otpErr) {
      if (otpErr.message?.includes('Please wait')) {
        return res.status(429).json({
          success: false,
          message: otpErr.message
        });
      }
      throw otpErr;
    }

    // Send email with OTP
    await emailService.sendLoginOtpEmail(userEmail, user.name, rawOtp, expiryMinutes);
    console.log(`\n🔑 [AcademicHub Security] Login verification code for ${userEmail}: ${rawOtp} (expires in ${expiryMinutes}m)\n`);

    res.status(200).json({
      success: true,
      requireOtp: true,
      type: 'login',
      email: userEmail,
      expiresAt,
      message: `A login verification code has been sent to ${userEmail}.`
    });
  } catch (error) {
    console.error('Login Error:', error);
    const status = error.message?.includes('Please wait') ? 429 : 500;
    res.status(status).json({ success: false, message: error.message || 'Error processing login request.' });
  }
};

/**
 * POST /api/auth/verify-login-otp
 * Step 2: Validates login OTP, checks approval status, generates & returns JWT session token
 */
export const verifyLoginOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and 6-digit verification code are required.' });
    }

    const verificationResult = otpService.verifyOtpRecord({
      email,
      type: 'login',
      enteredOtp: otp
    });

    if (!verificationResult.success) {
      return res.status(400).json(verificationResult);
    }

    const payload = verificationResult.payload;
    const user = users.find(u => u.id === payload.userId || (u.email && u.email.toLowerCase() === email.toLowerCase().trim()));

    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not found.' });
    }

    if (user.status === 'pending_approval') {
      return res.status(403).json({
        success: false,
        pendingApproval: true,
        message: 'Your account is pending Super Admin approval. Access will be unlocked once approved.'
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Sign-in verified successfully.',
      user: sanitizeUser(user),
      token
    });
  } catch (error) {
    console.error('Verify Login OTP Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Error verifying login code.' });
  }
};

/**
 * POST /api/auth/resend-otp
 */
export const resendOtp = async (req, res) => {
  try {
    const { email, type } = req.body;

    if (!email || !type) {
      return res.status(400).json({ success: false, message: 'Email and verification type are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (type === 'login') {
      const user = users.find(u => (u.email && u.email.toLowerCase() === normalizedEmail) || (u.username && u.username.toLowerCase() === normalizedEmail));
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      const { rawOtp, expiresAt, expiryMinutes } = otpService.createOtpRecord({
        email: user.email || normalizedEmail,
        type: 'login',
        payload: { userId: user.id },
        expiryMinutes: 5
      });

      await emailService.sendLoginOtpEmail(user.email || normalizedEmail, user.name, rawOtp, expiryMinutes);

      return res.status(200).json({
        success: true,
        email: user.email || normalizedEmail,
        expiresAt,
        message: 'A fresh login verification code has been sent to your email.'
      });
    }

    if (type === 'signup') {
      const status = otpService.getOtpStatus({ email: normalizedEmail, type: 'signup' });
      if (!status || status.isExpired) {
        return res.status(400).json({ 
          success: false, 
          message: 'Registration session has expired. Please fill out the registration form again.' 
        });
      }

      // Preserve the existing signup payload (name, passwordHash, role, etc.) when resending
      const existingRecord = otpService.getOtpPayload({ email: normalizedEmail, type: 'signup' });

      const { rawOtp, expiresAt, expiryMinutes } = otpService.createOtpRecord({
        email: normalizedEmail,
        type: 'signup',
        payload: existingRecord || {},
        expiryMinutes: 10
      });

      await emailService.sendSignupOtpEmail(normalizedEmail, 'Scholar', rawOtp, expiryMinutes);

      return res.status(200).json({
        success: true,
        email: normalizedEmail,
        expiresAt,
        message: 'A fresh signup verification code has been sent to your email.'
      });
    }

    if (type === 'password_reset') {
      const user = users.find(u => u.email && u.email.toLowerCase() === normalizedEmail);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      const { rawOtp, expiresAt, expiryMinutes } = otpService.createOtpRecord({
        email: normalizedEmail,
        type: 'password_reset',
        payload: { userId: user.id },
        expiryMinutes: 10
      });

      await emailService.sendPasswordResetOtpEmail(normalizedEmail, user.name, rawOtp, expiryMinutes);

      return res.status(200).json({
        success: true,
        email: normalizedEmail,
        expiresAt,
        message: 'A fresh password reset code has been sent to your email.'
      });
    }

    res.status(400).json({ success: false, message: 'Invalid verification type.' });
  } catch (error) {
    console.error('Resend OTP Error:', error);
    res.status(400).json({ success: false, message: error.message || 'Could not resend verification code.' });
  }
};

/**
 * POST /api/auth/forgot-password
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = users.find(u => 
      (u.email && u.email.toLowerCase() === normalizedEmail) ||
      (u.username && u.username.toLowerCase() === normalizedEmail) ||
      (normalizedEmail === 'awaiskhan69' && (u.username === SUPERADMIN_USERNAME || u.email === SUPERADMIN_EMAIL))
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No account found with '${email}'. Please verify your university email or create a new account.`
      });
    }

    const targetEmail = user.email || normalizedEmail;
    let rawOtp = null;
    let expiresAt = null;

    try {
      const otpRecord = otpService.createOtpRecord({
        email: targetEmail,
        type: 'password_reset',
        payload: { userId: user.id },
        expiryMinutes: 10
      });
      rawOtp = otpRecord.rawOtp;
      expiresAt = otpRecord.expiresAt;
    } catch (otpErr) {
      if (otpErr.message?.includes('Please wait')) {
        return res.status(429).json({
          success: false,
          message: otpErr.message
        });
      }
      throw otpErr;
    }

    await emailService.sendPasswordResetOtpEmail(targetEmail, user.name, rawOtp, 10);
    console.log(`\n🔑 [AcademicHub Security] Password reset code for ${targetEmail}: ${rawOtp} (expires in 10m)\n`);

    res.status(200).json({
      success: true,
      email: targetEmail,
      expiresAt,
      message: `A password reset code has been sent to ${targetEmail}.`
    });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Error processing password reset request.' });
  }
};

/**
 * POST /api/auth/reset-password
 */
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email, verification code, and new password are required.' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'New password must be at least 6 characters long.' 
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const verificationResult = otpService.verifyOtpRecord({
      email: normalizedEmail,
      type: 'password_reset',
      enteredOtp: otp
    });

    if (!verificationResult.success) {
      return res.status(400).json(verificationResult);
    }

    const user = users.find(u => 
      (u.email && u.email.toLowerCase() === normalizedEmail) ||
      (u.username && u.username.toLowerCase() === normalizedEmail) ||
      (normalizedEmail === 'awaiskhan69' && (u.username === SUPERADMIN_USERNAME || u.email === SUPERADMIN_EMAIL))
    );
    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not found.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    savePersistedUsers();

    res.status(200).json({
      success: true,
      message: 'Your password has been successfully reset. You can now sign in with your new password.'
    });
  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Error resetting password.' });
  }
};

// ─────────────────────────────────────────────────────────────
// SUPER ADMIN APPROVAL MANAGEMENT ENDPOINTS
// ─────────────────────────────────────────────────────────────

/**
 * GET /api/admin/pending-approvals
 * Lists all moderator and admin registration requests pending Super Admin approval
 */
export const getPendingApprovals = (req, res) => {
  const pendingUsers = users
    .filter(u => u.status === 'pending_approval')
    .map(u => sanitizeUser(u));

  res.json({
    success: true,
    data: pendingUsers,
    count: pendingUsers.length
  });
};

/**
 * POST /api/admin/approve-user/:id
 * Approves a pending moderator or admin user account
 */
export const approveUser = (req, res) => {
  const { id } = req.params;
  const user = users.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({ success: false, message: 'User request not found.' });
  }

  user.status = 'active';
  user.isApproved = true;
  user.approvedAt = new Date().toISOString();
  user.approvedBy = req.user?.name || 'Super Admin';
  savePersistedUsers();

  res.json({
    success: true,
    message: `User ${user.name} (${user.role}) has been approved successfully!`,
    user: sanitizeUser(user)
  });
};

/**
 * POST /api/admin/reject-user/:id
 * Rejects and cleans up a pending user request
 */
export const rejectUser = (req, res) => {
  const { id } = req.params;
  const index = users.findIndex(u => u.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'User request not found.' });
  }

  const rejected = users.splice(index, 1)[0];
  savePersistedUsers();

  res.json({
    success: true,
    message: `User request for ${rejected.name} (${rejected.role}) has been rejected.`,
    user: sanitizeUser(rejected)
  });
};
