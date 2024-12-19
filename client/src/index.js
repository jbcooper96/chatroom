import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './pages/App'
import { AuthProvider } from './contexts/AuthContext'
import CssBaseline from '@mui/material/CssBaseline'
import '@fontsource/roboto'
import './styles/index.css'
import Layout from "./pages/Layout"
import ThreadPage from "./pages/ThreadPage"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blue } from '@mui/material/colors';


const root = document.getElementById('root');

const theme = createTheme({
  palette: {
    primary: {
      light: "#7EBFD0",
      main: "#3c7a89",
      dark: "#2e4756",
      darker: "#16262e",
    },
  },
});

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<App />} />
              <Route path="message/:id" element={<ThreadPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);
