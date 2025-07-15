import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, CircularProgress, Fade } from '@mui/material';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

interface ShortUrlStats {
  url: string;
  shortcode: string;
  createdAt: string;
  expiry: string;
  clicks: number;
  clickDetails: Array<{
    timestamp: string;
    referrer: string;
    location: string;
  }>;
}

const StatisticsPage: React.FC = () => {
  const [shortcodes, setShortcodes] = useState<string[]>([]);
  const [stats, setStats] = useState<Record<string, ShortUrlStats | null>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const codes = JSON.parse(sessionStorage.getItem('shortcodes') || '[]');
    setShortcodes(codes);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const newStats: Record<string, ShortUrlStats | null> = {};
      await Promise.all(
        shortcodes.map(async code => {
          try {
            const res = await axios.get(`${BACKEND_URL}/shorturls/${code}`);
            newStats[code] = res.data;
          } catch (err: any) {
            newStats[code] = null;
          }
        })
      );
      setStats(newStats);
      setLoading(false);
    };
    if (shortcodes.length > 0) fetchStats();
  }, [shortcodes]);

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 6, p: { xs: 1, sm: 2 } }}>
      <Fade in timeout={800}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, letterSpacing: 1, mb: 3, textAlign: 'center', color: 'text.primary' }}>
            Shortened URL Statistics
          </Typography>
          {loading && <Box sx={{ display: 'flex', justifyContent: 'center', my: 6 }}><CircularProgress /></Box>}
          {!loading && shortcodes.length === 0 && (
            <Typography sx={{ textAlign: 'center', color: 'text.secondary', mt: 4 }}>
              No short URLs created in this session.
            </Typography>
          )}
          {!loading && shortcodes.map(code => {
            const stat = stats[code];
            return (
              <Fade in timeout={600} key={code}>
                <Paper
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
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Short Link: <a href={`http://localhost:4000/${code}`} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>{`http://localhost:4000/${code}`}</a>
                  </Typography>
                  {stat ? (
                    <>
                      <Typography sx={{ mb: 0.5 }}>Original URL: <span style={{ wordBreak: 'break-all' }}>{stat.url}</span></Typography>
                      <Typography sx={{ mb: 0.5 }}>Created: {new Date(stat.createdAt).toLocaleString()}</Typography>
                      <Typography sx={{ mb: 0.5 }}>Expires: {new Date(stat.expiry).toLocaleString()}</Typography>
                      <Typography sx={{ mb: 1, fontWeight: 500 }}>Total Clicks: {stat.clicks}</Typography>
                      <Box mt={2}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Click Details:</Typography>
                        {stat.clickDetails.length === 0 ? (
                          <Typography>No clicks yet.</Typography>
                        ) : (
                          <Box>
                            {stat.clickDetails.map((c, i) => (
                              <Box key={i} sx={{ mb: 1, p: 1.5, border: '1px solid #eee', borderRadius: 2, background: 'background.default', transition: 'background 0.3s' }}>
                                <Typography sx={{ fontSize: 14 }}>Time: {new Date(c.timestamp).toLocaleString()}</Typography>
                                <Typography sx={{ fontSize: 14 }}>Referrer: {c.referrer || 'N/A'}</Typography>
                                <Typography sx={{ fontSize: 14 }}>Location: {c.location}</Typography>
                              </Box>
                            ))}
                          </Box>
                        )}
                      </Box>
                    </>
                  ) : (
                    <Typography color="error" sx={{ fontWeight: 600 }}>Failed to load stats for this shortcode.</Typography>
                  )}
                </Paper>
              </Fade>
            );
          })}
        </Box>
      </Fade>
    </Box>
  );
};

export default StatisticsPage; 