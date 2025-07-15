import express from 'express';
import { Log } from 'logging-middleware/dist/logger';
import axios from 'axios';
import { nanoid } from 'nanoid';
import dotenv from 'dotenv';
dotenv.config();

const LOG_TOKEN = process.env.LOG_TOKEN || '';
console.log('Loaded LOG_TOKEN:', LOG_TOKEN ? LOG_TOKEN.slice(0, 8) + '...' : '(empty)');

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000;
const HOST = `http://localhost:${PORT}`;

app.use(express.json());

// In-memory storage
interface UrlEntry {
  url: string;
  shortcode: string;
  createdAt: Date;
  expiry: Date;
  clicks: number;
  clickDetails: Array<{
    timestamp: Date;
    referrer: string;
    location: string;
  }>;
}
const urlMap = new Map<string, UrlEntry>();

// Helper: Validate URL
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
// Helper: Validate shortcode
function isValidShortcode(code: string): boolean {
  return /^[a-zA-Z0-9]{4,16}$/.test(code);
}

// POST /shorturls - Create short URL
app.post('/shorturls', async (req, res) => {
  const { url, validity, shortcode } = req.body;
  await Log('backend', 'info', 'handler', 'POST /shorturls called', LOG_TOKEN);

  // Validate input
  if (!url || typeof url !== 'string' || !isValidUrl(url)) {
    await Log('backend', 'error', 'handler', 'Invalid URL provided', LOG_TOKEN);
    return res.status(400).json({ error: 'Invalid URL' });
  }
  let code = shortcode;
  if (code) {
    if (!isValidShortcode(code)) {
      await Log('backend', 'error', 'handler', 'Invalid shortcode format', LOG_TOKEN);
      return res.status(400).json({ error: 'Invalid shortcode format' });
    }
    if (urlMap.has(code)) {
      await Log('backend', 'error', 'handler', 'Shortcode collision', LOG_TOKEN);
      return res.status(409).json({ error: 'Shortcode already exists' });
    }
  } else {
    // Generate unique shortcode
    do {
      code = nanoid(6);
    } while (urlMap.has(code));
  }
  // Validity
  let minutes = 30;
  if (validity !== undefined) {
    if (typeof validity !== 'number' || validity <= 0) {
      await Log('backend', 'error', 'handler', 'Invalid validity', LOG_TOKEN);
      return res.status(400).json({ error: 'Invalid validity' });
    }
    minutes = validity;
  }
  const now = new Date();
  const expiry = new Date(now.getTime() + minutes * 60000);
  // Store entry
  urlMap.set(code, {
    url,
    shortcode: code,
    createdAt: now,
    expiry,
    clicks: 0,
    clickDetails: [],
  });
  await Log('backend', 'info', 'repository', `Short URL created: ${code}`, LOG_TOKEN);
  return res.status(201).json({
    shortLink: `${HOST}/${code}`,
    expiry: expiry.toISOString(),
  });
});

// GET /shorturls/:shortcode - Get stats
app.get('/shorturls/:shortcode', async (req, res) => {
  const { shortcode } = req.params;
  await Log('backend', 'info', 'handler', `GET /shorturls/${shortcode} called`, LOG_TOKEN);
  const entry = urlMap.get(shortcode);
  if (!entry) {
    await Log('backend', 'error', 'handler', 'Shortcode not found', LOG_TOKEN);
    return res.status(404).json({ error: 'Shortcode not found' });
  }
  if (entry.expiry < new Date()) {
    await Log('backend', 'warn', 'handler', 'Shortcode expired', LOG_TOKEN);
    return res.status(410).json({ error: 'Shortcode expired' });
  }
  return res.json({
    url: entry.url,
    shortcode: entry.shortcode,
    createdAt: entry.createdAt.toISOString(),
    expiry: entry.expiry.toISOString(),
    clicks: entry.clicks,
    clickDetails: entry.clickDetails.map(c => ({
      timestamp: c.timestamp.toISOString(),
      referrer: c.referrer,
      location: c.location,
    })),
  });
});

// GET /:shortcode - Redirect
app.get('/:shortcode', async (req, res) => {
  const { shortcode } = req.params;
  await Log('backend', 'info', 'handler', `GET /${shortcode} called`, LOG_TOKEN);
  const entry = urlMap.get(shortcode);
  if (!entry) {
    await Log('backend', 'error', 'handler', 'Shortcode not found', LOG_TOKEN);
    return res.status(404).json({ error: 'Shortcode not found' });
  }
  if (entry.expiry < new Date()) {
    await Log('backend', 'warn', 'handler', 'Shortcode expired', LOG_TOKEN);
    return res.status(410).json({ error: 'Shortcode expired' });
  }
  // Analytics: get location
  let location = 'unknown';
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const geoRes = await axios.get(`https://ipapi.co/${ip}/country_name/`);
    location = geoRes.data || 'unknown';
  } catch {
    // ignore location errors
  }
  entry.clicks++;
  entry.clickDetails.push({
    timestamp: new Date(),
    referrer: req.get('referer') || '',
    location,
  });
  await Log('backend', 'info', 'repository', `Shortcode ${shortcode} clicked`, LOG_TOKEN);
  return res.redirect(entry.url);
});

app.listen(PORT, async () => {
  await Log('backend', 'info', 'service', `Server started on port ${PORT}`, LOG_TOKEN);
}); 