import crypto from 'crypto';

// In-memory OTP cache: key -> { otpHash, expiresAt, attempts, lastSentAt, type, payload }
const otpStore = new Map();

const OTP_LENGTH = 6;
const DEFAULT_EXPIRY_MINUTES = 10;
const MAX_VERIFICATION_ATTEMPTS = 5;
const RESEND_COOLDOWN_SECONDS = process.env.NODE_ENV === 'development' ? 10 : 30;

/**
 * Generate a cryptographically secure 6-digit numeric OTP
 */
export const generateNumericOtp = () => {
  // Use crypto.randomInt for uniform distribution between 100000 and 999999
  const otpNumber = crypto.randomInt(100000, 999999);
  return otpNumber.toString();
};

/**
 * Hash OTP for secure storage
 */
export const hashOtp = (otp) => {
  return crypto.createHash('sha256').update(String(otp).trim()).digest('hex');
};

/**
 * Store OTP in memory with expiration, attempt limit, and payload
 */
export const createOtpRecord = ({ email, type, payload = {}, expiryMinutes = DEFAULT_EXPIRY_MINUTES }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const key = `${type}:${normalizedEmail}`;

  // Check cooldown if existing record was sent recently
  const existing = otpStore.get(key);
  const now = Date.now();
  if (existing && existing.lastSentAt && (now - existing.lastSentAt) < RESEND_COOLDOWN_SECONDS * 1000) {
    const remainingSeconds = Math.ceil((RESEND_COOLDOWN_SECONDS * 1000 - (now - existing.lastSentAt)) / 1000);
    throw new Error(`Please wait ${remainingSeconds} seconds before requesting a new code.`);
  }

  const rawOtp = generateNumericOtp();
  const otpHash = hashOtp(rawOtp);
  const expiresAt = now + expiryMinutes * 60 * 1000;

  otpStore.set(key, {
    otpHash,
    expiresAt,
    attempts: 0,
    lastSentAt: now,
    type,
    payload: {
      ...payload,
      email: normalizedEmail
    }
  });

  return { rawOtp, expiresAt, expiryMinutes };
};

/**
 * Verify OTP against stored record
 */
export const verifyOtpRecord = ({ email, type, enteredOtp }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const key = `${type}:${normalizedEmail}`;
  const record = otpStore.get(key);

  if (!record) {
    return {
      success: false,
      message: 'No active verification code found. Please request a new code.',
      reason: 'NOT_FOUND'
    };
  }

  const now = Date.now();
  if (now > record.expiresAt) {
    otpStore.delete(key);
    return {
      success: false,
      message: 'Verification code has expired. Please request a new code.',
      reason: 'EXPIRED'
    };
  }

  if (record.attempts >= MAX_VERIFICATION_ATTEMPTS) {
    otpStore.delete(key);
    return {
      success: false,
      message: 'Maximum verification attempts exceeded. Please request a new code.',
      reason: 'TOO_MANY_ATTEMPTS'
    };
  }

  const enteredHash = hashOtp(enteredOtp);
  if (enteredHash !== record.otpHash) {
    record.attempts += 1;
    const remaining = MAX_VERIFICATION_ATTEMPTS - record.attempts;
    return {
      success: false,
      message: `Invalid verification code. ${remaining > 0 ? `${remaining} attempt(s) remaining.` : 'Code has been invalidated.'}`,
      reason: 'INVALID_CODE',
      attemptsRemaining: remaining
    };
  }

  // Verification succeeded - consume and clear the OTP record immediately to prevent reuse
  const verifiedPayload = { ...record.payload };
  otpStore.delete(key);

  return {
    success: true,
    message: 'Verification successful.',
    payload: verifiedPayload
  };
};

/**
 * Invalidate an active OTP record
 */
export const invalidateOtpRecord = ({ email, type }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const key = `${type}:${normalizedEmail}`;
  otpStore.delete(key);
};

/**
 * Get the payload from an active OTP record without consuming it
 */
export const getOtpPayload = ({ email, type }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const key = `${type}:${normalizedEmail}`;
  const record = otpStore.get(key);
  if (!record) return null;
  return { ...record.payload };
};

/**
 * Get active pending OTP status (e.g. cooldown info)
 */
export const getOtpStatus = ({ email, type }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const key = `${type}:${normalizedEmail}`;
  const record = otpStore.get(key);

  if (!record) return null;

  const now = Date.now();
  const remainingCooldown = Math.max(0, Math.ceil((RESEND_COOLDOWN_SECONDS * 1000 - (now - (record.lastSentAt || 0))) / 1000));
  const isExpired = now > record.expiresAt;

  return {
    exists: true,
    isExpired,
    remainingCooldown,
    attempts: record.attempts
  };
};

// Automatic cleanup every 5 minutes for expired entries
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of otpStore.entries()) {
    if (now > value.expiresAt) {
      otpStore.delete(key);
    }
  }
}, 5 * 60 * 1000);
