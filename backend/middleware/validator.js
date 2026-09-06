/**
 * Input Validation & Sanitization Middleware
 * Enforces strict input validation to prevent invalid data submissions and injection
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates login payload
 */
export const validateLogin = (req, res, next) => {
  let { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Both email and password are required.'
    });
  }

  email = String(email).trim().toLowerCase();
  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address.'
    });
  }

  req.body.email = email;
  next();
};

/**
 * Validates registration / signup payload
 */
export const validateRegister = (req, res, next) => {
  let { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and password are required.'
    });
  }

  name = String(name).trim();
  if (name.length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Name must be at least 2 characters long.'
    });
  }

  email = String(email).trim().toLowerCase();
  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid academic email address.'
    });
  }

  if (String(password).length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long.'
    });
  }

  req.body.name = name;
  req.body.email = email;
  next();
};

/**
 * Validates forgot password request
 */
export const validateForgotPassword = (req, res, next) => {
  let { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email address is required.'
    });
  }

  email = String(email).trim().toLowerCase();
  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address.'
    });
  }

  req.body.email = email;
  next();
};

/**
 * Validates resource upload metadata
 */
export const validateResourceUpload = (req, res, next) => {
  const { title, departmentId, courseId, category } = req.body;

  if (!title || String(title).trim().length < 3) {
    return res.status(400).json({
      success: false,
      message: 'Resource title is required and must be at least 3 characters.'
    });
  }

  if (!category) {
    return res.status(400).json({
      success: false,
      message: 'Resource category is required.'
    });
  }

  next();
};

export default {
  validateLogin,
  validateRegister,
  validateForgotPassword,
  validateResourceUpload
};
