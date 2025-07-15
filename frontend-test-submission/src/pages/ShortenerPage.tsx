import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Fade, IconButton, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import axios from 'axios';

interface UrlForm {
  url: string;
  validity: string;
  shortcode: string;
  error: string;
  result?: { shortLink: string; expiry: string };
  copied?: boolean;
}

const MAX_URLS = 5;
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
function isValidShortcode(code: string): boolean {
  return !code || /^[a-zA-Z0-9]{4,16}$/.test(code);
}
function isValidValidity(val: string): boolean {
  return !val || (/^\d+$/.test(val) && parseInt(val) > 0);
}

const ShortenerPage: React.FC = () => {
  const [forms, setForms] = useState<UrlForm[]>([
    { url: '', validity: '', shortcode: '', error: '' },
  ]);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (idx: number, field: keyof UrlForm, value: string) => {
    const updated = [...forms];
    (updated[idx] as any)[field] = value;
    updated[idx].error = '';
    setForms(updated);
  };

  const addForm = () => {
    if (forms.length < MAX_URLS) {
      setForms([...forms, { url: '', validity: '', shortcode: '', error: '' }]);
    }
  };

  const removeForm = (idx: number) => {
    if (forms.length > 1) {
      setForms(forms.filter((_, i) => i !== idx));
    }
  };

  const validate = (form: UrlForm): string => {
    if (!form.url) return 'URL is required';
    if (!isValidUrl(form.url)) return 'Invalid URL format';
    if (!isValidValidity(form.validity)) return 'Validity must be a positive integer';
    if (!isValidShortcode(form.shortcode)) return 'Shortcode must be 4-16 alphanumeric chars';
    return '';
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const updated = [...forms];
    let newShortcodes: string[] = [];
    await Promise.all(
      updated.map(async (form, idx) => {
        const error = validate(form);
        if (error) {
          updated[idx].error = error;
          return;
        }
        try {
          const payload: any = { url: form.url };
          if (form.validity) payload.validity = parseInt(form.validity);
          if (form.shortcode) payload.shortcode = form.shortcode;
          const res = await axios.post(`${BACKEND_URL}/shorturls`, payload);
          updated[idx].result = res.data;
          updated[idx].error = '';
          // Extract shortcode from shortLink
          const code = res.data.shortLink.split('/').pop();
          if (code) newShortcodes.push(code);
        } catch (err: any) {
          updated[idx].error = err?.response?.data?.error || 'Error creating short URL';
        }
      })
    );
    // Save new shortcodes to sessionStorage
    if (newShortcodes.length > 0) {
      const prev = JSON.parse(sessionStorage.getItem('shortcodes') || '[]');
      const merged = Array.from(new Set([...prev, ...newShortcodes]));
      sessionStorage.setItem('shortcodes', JSON.stringify(merged));
    }
    setForms(updated);
    setSubmitting(false);
  };

  const handleCopy = async (idx: number, link: string) => {
    await navigator.clipboard.writeText(link);
    const updated = [...forms];
    updated[idx].copied = true;
    setForms(updated);
    setTimeout(() => {
      updated[idx].copied = false;
      setForms([...updated]);
    }, 1200);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 6, p: { xs: 1, sm: 2 } }}>
      <Fade in timeout={800}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, letterSpacing: 1, mb: 3, textAlign: 'center', color: 'text.primary' }}>
            URL Shortener
          </Typography>
          {forms.map((form, idx) => (
            <Paper
              key={idx}
              sx={{
                p: { xs: 2, sm: 3 },
                mb: 3,
                borderRadius: 4,
                boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)',
                background: 'background.paper',
                transition: 'box-shadow 0.3s, background 0.3s',
                '&:hover': {
                  boxShadow: '0 4px 16px 0 rgba(0,0,0,0.08)',
                  background: 'background.default',
                },
              }}
              elevation={2}
            >
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                <Box sx={{ flex: '1 1 40%' }}>
                  <TextField
                    label="Long URL"
                    value={form.url}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(idx, 'url', e.target.value)}
                    fullWidth
                    required
                    error={!!form.error && form.error.includes('URL')}
                    helperText={form.error && form.error.includes('URL') ? form.error : ''}
                  />
                </Box>
                <Box sx={{ flex: '1 1 15%' }}>
                  <TextField
                    label="Validity (min)"
                    value={form.validity}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(idx, 'validity', e.target.value)}
                    fullWidth
                    error={!!form.error && form.error.includes('Validity')}
                    helperText={form.error && form.error.includes('Validity') ? form.error : ''}
                  />
                </Box>
                <Box sx={{ flex: '1 1 15%' }}>
                  <TextField
                    label="Shortcode (opt)"
                    value={form.shortcode}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(idx, 'shortcode', e.target.value)}
                    fullWidth
                    error={!!form.error && form.error.includes('Shortcode')}
                    helperText={form.error && form.error.includes('Shortcode') ? form.error : ''}
                  />
                </Box>
                <Box sx={{ flex: '1 1 15%' }}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => removeForm(idx)}
                    disabled={forms.length === 1}
                    fullWidth
                  >
                    Remove
                  </Button>
                </Box>
              </Box>
              {form.result && (
                <Fade in timeout={600}>
                  <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
                      Short Link: <a href={form.result.shortLink} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>{form.result.shortLink}</a>
                    </Typography>
                    <Tooltip title={form.copied ? 'Copied!' : 'Copy to clipboard'}>
                      <span>
                        <IconButton
                          size="small"
                          color={form.copied ? 'success' : 'primary'}
                          onClick={() => handleCopy(idx, form.result!.shortLink)}
                          disabled={form.copied}
                          sx={{ ml: 1 }}
                        >
                          {form.copied ? <CheckIcon /> : <ContentCopyIcon />}
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Typography variant="body2" sx={{ ml: 2 }}>
                      Expires: {new Date(form.result.expiry).toLocaleString()}
                    </Typography>
                  </Box>
                </Fade>
              )}
              {form.error && !form.error.includes('URL') && !form.error.includes('Validity') && !form.error.includes('Shortcode') && (
                <Fade in timeout={400}>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="error" sx={{ fontWeight: 600 }}>
                      {form.error}
                    </Typography>
                  </Box>
                </Fade>
              )}
            </Paper>
          ))}
          <Box sx={{ display: 'flex', gap: 2, mb: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={addForm}
              disabled={forms.length >= MAX_URLS}
              sx={{ fontWeight: 600, borderRadius: 3, px: 3, boxShadow: '0 2px 8px 0 rgba(255, 152, 0, 0.10)', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: '0 4px 16px 0 rgba(255, 152, 0, 0.18)' } }}
            >
              Add URL
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={submitting}
              sx={{ fontWeight: 600, borderRadius: 3, px: 3, boxShadow: '0 2px 8px 0 rgba(255, 152, 0, 0.10)', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: '0 4px 16px 0 rgba(255, 152, 0, 0.18)' } }}
            >
              Shorten URLs
            </Button>
          </Box>
        </Box>
      </Fade>
    </Box>
  );
};

export default ShortenerPage; 