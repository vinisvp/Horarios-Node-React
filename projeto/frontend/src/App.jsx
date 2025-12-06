import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout/Layout';
import ConsultaHorarios from './components/ConsultaHorarios/ConsultaHorarios';
import { Box } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <Box sx={{ p: 2 }}>
          <ConsultaHorarios />
        </Box>
      </Layout>
    </ThemeProvider>
  );
}

export default App;