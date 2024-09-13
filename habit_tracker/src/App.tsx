import './App.css'
import LoginPage from './pages/LoginPage'
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  // Le tue personalizzazioni qui
  palette: {
    primary: {
      main: '#886ED2',
    },
    secondary: {
      main: '#DBD2F3',
    },
  },
});

function App() {

  return (
    <>
     <ThemeProvider theme={theme}>
        <LoginPage />
    </ThemeProvider>
    </>
  )
}

export default App
