import 'dotenv/config';
import nodemailer from 'nodemailer';

// Dynamic SMTP configuration getter
export const getSmtpConfig = () => {
  const host = (process.env.SMTP_HOST || '').trim();
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const user = (process.env.SMTP_USER || '').trim();
  const pass = (process.env.SMTP_PASS || '').trim();
  const fromName = 'AcademicHub';
  const fromAddress = user || 'noreply@academichub.edu';

  return {
    host,
    port,
    user,
    pass,
    fromName,
    fromAddress,
    from: { name: fromName, address: fromAddress },
    isConfigured: Boolean(host && user && pass)
  };
};

let transporter = null;

// Initialize or retrieve email transporter with live/mock fallback support
export const getTransporter = () => {
  const config = getSmtpConfig();

  if (config.isConfigured) {
    if (!transporter || transporter.isMock) {
      transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.port === 465,
        auth: {
          user: config.user,
          pass: config.pass,
        },
      });
      transporter.isMock = false;

      transporter.verify((err) => {
        if (err) {
          console.warn('⚠️ EmailService SMTP verification error:', err.message);
        } else {
          console.log(`📧 EmailService: Live Gmail SMTP Verified & Ready (Sending as ${config.user} on port ${config.port})`);
        }
      });
    }
    return transporter;
  }

  // Development/Mock fallback if no SMTP configured
  if (!transporter) {
    transporter = {
      isMock: true,
      sendMail: async (mailOptions) => {
        const otpMatch = mailOptions.text?.match(/:\s*([0-9]{6})/) || mailOptions.text?.match(/([0-9]{6})/);
        console.log('\n==================================================');
        console.log('📬 [AcademicHub Email Service - Development / Console Mode]');
        console.log(`To: ${mailOptions.to}`);
        console.log(`Subject: ${mailOptions.subject}`);
        console.log(`Security Code (OTP): ${otpMatch ? otpMatch[1] : '[Sent via Email]'}`);
        console.log('==================================================\n');
        return { messageId: `mock-${Date.now()}`, isMock: true };
      }
    };
    console.log('📧 EmailService: Running in development mode (email logs to console).');
  }

  return transporter;
};

// Immediate transporter setup on module load
getTransporter();

/**
 * Send email with anti-spam RFC headers and automatic resilient fallback
 */
export const sendMailSafe = async (mailOptions) => {
  const config = getSmtpConfig();
  const currentTransporter = getTransporter();

  // Create clean RFC-compliant sender address and anti-spam headers
  const finalMailOptions = {
    from: mailOptions.from || config.from,
    sender: config.user,
    replyTo: config.user,
    headers: {
      'Auto-Submitted': 'auto-generated',
      'X-Auto-Response-Suppress': 'All',
      'Precedence': 'bulk',
      'X-Priority': '3',
      'List-Unsubscribe': `<mailto:${config.user}?subject=unsubscribe>`,
      ...mailOptions.headers,
    },
    ...mailOptions,
  };

  try {
    if (currentTransporter && typeof currentTransporter.sendMail === 'function') {
      const result = await currentTransporter.sendMail(finalMailOptions);
      if (!currentTransporter.isMock) {
        console.log(`📨 [EmailService] OTP email successfully delivered to ${finalMailOptions.to} (SMTP MessageId: ${result.messageId || 'ok'})`);
      }
      return { success: true, ...result };
    }
  } catch (err) {
    console.error(`❌ EmailService: Failed to send email via SMTP transporter to ${finalMailOptions.to}:`, err.message);
  }

  // Fallback to console logger so auth and registration are never blocked if SMTP temporary drops
  const otpMatch = (finalMailOptions.text && (finalMailOptions.text.match(/:\s*([0-9]{6})/) || finalMailOptions.text.match(/([0-9]{6})/))) || null;
  console.log('\n==================================================');
  console.log('📬 [AcademicHub Email Service - Fallback Console Delivery]');
  console.log(`To: ${finalMailOptions.to}`);
  console.log(`Subject: ${finalMailOptions.subject}`);
  console.log(`Security Code (OTP): ${otpMatch ? otpMatch[1] : '[Sent via Email]'}`);
  console.log('==================================================\n');
  return { success: false, fallback: true, messageId: `fallback-${Date.now()}` };
};

/**
 * Generate a clean, responsive, anti-spam optimized transactional email layout
 * Uses 100% inline CSS and table structure for universal inbox deliverability.
 */
const generateEmailTemplate = ({ title, headline, bodyText, otpCode, expiryMinutes = 10, noteText }) => {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden;">
          <tr>
            <td style="background-color: #0f172a; padding: 24px 32px; text-align: left;">
              <span style="font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">Academic<span style="color: #6366f1;">Hub</span></span>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 32px 24px 32px;">
              <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #0f172a; line-height: 1.3;">${headline}</h2>
              <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #475569;">${bodyText}</p>
              
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; border-radius: 10px; border: 1px solid #e2e8f0; margin: 24px 0;">
                <tr>
                  <td align="center" style="padding: 20px;">
                    <div style="font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-bottom: 8px;">Verification Code</div>
                    <div style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #4338ca; padding: 4px 0;">${otpCode}</div>
                    <div style="font-size: 12px; color: #64748b; margin-top: 8px;">Valid for ${expiryMinutes} minutes</div>
                  </td>
                </tr>
              </table>

              <p style="margin: 24px 0 0 0; font-size: 13px; line-height: 1.5; color: #64748b;">
                ${noteText || 'If you did not make this request, you can safely disregard this email.'}
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #94a3b8; line-height: 1.5;">
              AcademicHub • Academic Collaboration Platform<br />
              This automated message was sent to confirm your request.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

/**
 * Send Signup Verification OTP
 */
export const sendSignupOtpEmail = async (email, name, otp, expiryMinutes = 10) => {
  const headline = `Welcome to AcademicHub, ${name || 'Scholar'}!`;
  const bodyText = 'Thank you for registering. Please enter the verification code below to verify your email address and activate your account.';
  const noteText = 'If you did not create an account on AcademicHub, you can safely ignore this email.';

  const mailOptions = {
    from: getSmtpConfig().from,
    to: email,
    subject: `${otp} is your AcademicHub verification code`,
    text: `AcademicHub Verification Code: ${otp}\n\n${headline}\n\n${bodyText}\n\nVerification Code: ${otp}\n(Valid for ${expiryMinutes} minutes)\n\n${noteText}\n\n— The AcademicHub Team`,
    html: generateEmailTemplate({
      title: 'Verify Your Email - AcademicHub',
      headline,
      bodyText,
      otpCode: otp,
      expiryMinutes,
      noteText
    }),
  };

  return await sendMailSafe(mailOptions);
};

/**
 * Send Login Verification OTP (2-Factor Authentication)
 */
export const sendLoginOtpEmail = async (email, name, otp, expiryMinutes = 5) => {
  const headline = 'Sign-in Verification';
  const bodyText = `A sign-in attempt was initiated for your AcademicHub account (${email}). Use the one-time code below to complete sign-in.`;
  const noteText = 'If you did not attempt to sign in, please update your password immediately to secure your account.';

  const mailOptions = {
    from: getSmtpConfig().from,
    to: email,
    subject: `${otp} is your AcademicHub sign-in code`,
    text: `AcademicHub Sign-in Code: ${otp}\n\n${headline}\n\n${bodyText}\n\nVerification Code: ${otp}\n(Valid for ${expiryMinutes} minutes)\n\n${noteText}\n\n— The AcademicHub Team`,
    html: generateEmailTemplate({
      title: 'Sign-in Verification - AcademicHub',
      headline,
      bodyText,
      otpCode: otp,
      expiryMinutes,
      noteText
    }),
  };

  return await sendMailSafe(mailOptions);
};

/**
 * Send Password Reset OTP
 */
export const sendPasswordResetOtpEmail = async (email, name, otp, expiryMinutes = 10) => {
  const headline = 'Password Reset Request';
  const bodyText = `We received a request to reset the password for your AcademicHub account (${email}). Use the code below to set your new password.`;
  const noteText = 'If you did not request a password reset, no further action is needed and your account remains secure.';

  const mailOptions = {
    from: getSmtpConfig().from,
    to: email,
    subject: `${otp} is your AcademicHub password reset code`,
    text: `AcademicHub Password Reset Code: ${otp}\n\n${headline}\n\n${bodyText}\n\nReset Code: ${otp}\n(Valid for ${expiryMinutes} minutes)\n\n${noteText}\n\n— The AcademicHub Team`,
    html: generateEmailTemplate({
      title: 'Reset Password - AcademicHub',
      headline,
      bodyText,
      otpCode: otp,
      expiryMinutes,
      noteText
    }),
  };

  return await sendMailSafe(mailOptions);
};
