import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, useTheme } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import logo from './logo.svg';
import ShortenerPage from './pages/ShortenerPage';
import StatisticsPage from './pages/StatisticsPage';

interface AppProps {
  mode: 'light' | 'dark';
  setMode: React.Dispatch<React.SetStateAction<'light' | 'dark'>>;
}

const App: React.FC<AppProps> = ({ mode, setMode }) => {
  const theme = useTheme();

  return (
    <Router>
      <AppBar position="static" color="default" elevation={1} sx={{ background: theme.palette.background.paper, boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)' }}>
        <Toolbar>
          <img src={logo} alt="Logo" height={32} style={{ marginRight: 16 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, color: theme.palette.text.primary }}>
            FireLinks URL Shortener
          </Typography>
          <Button color="primary" component={Link} to="/">Shorten URLs</Button>
          <Button color="primary" component={Link} to="/stats">Statistics</Button>
          <IconButton sx={{ ml: 1 }} onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')} color="primary">
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          minHeight: '100vh',
          width: '100%',
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(90deg, #222 0%, #333 100%)'
            : 'linear-gradient(90deg, #fffde7 0%, #fff 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          py: { xs: 4, sm: 8 },
        }}
      >
        <Routes>
          <Route path="/" element={<ShortenerPage />} />
          <Route path="/stats" element={<StatisticsPage />} />
        </Routes>
      </Box>
    </Router>
  );
};

export default App;
