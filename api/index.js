// api/index.js
// Vercel Serverless entry point — proxies requests to backend

export default function handler(req, res) {
  res.status(200).json({
    message: 'AcademicHub API — Vercel Serverless',
    note: 'For full API, use /api/* routes routed to backend/server.js via vercel.json',
    timestamp: new Date().toISOString()
  });
}
