import { createTheme } from '@mui/material/styles';

const getTheme = (mode: 'light' | 'dark') => createTheme({
  palette: {
    mode,
    primary: {
      main: '#ff9800', // Yellow
      contrastText: '#fff',
    },
    secondary: {
      main: '#fffde7', // Lightest yellow/white
      contrastText: mode === 'dark' ? '#222' : '#333',
    },
    background: {
      default: mode === 'dark' ? '#222' : '#fff',
      paper: mode === 'dark' ? '#333' : '#f5f5f5',
    },
    text: {
      primary: mode === 'dark' ? '#fff' : '#333',
      secondary: mode === 'dark' ? '#fffde7' : '#888',
    },
  },
  typography: {
    fontFamily: '"Funnel Display", Poppins, Inter, Roboto, Arial, sans-serif',
    h2: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)',
        },
      },
    },
  },
});

export default getTheme; 