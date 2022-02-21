import React,{ useState, useReducer, useEffect } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Loading from './components/Loading';
import axios from 'axios';
import './css/app.scss';
import { BrowserRouter,Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { deepPurple, cyan } from '@mui/material/colors';
import { ContextProvider, VcardDefaultValues } from './context';
import Login from './pages/Login';
import Register from './pages/Register';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.withCredentials = true;

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: deepPurple,
    secondary: cyan,
    customColors: {
      main: '#E5E9F2',
      color1: '#0C1B32'
    }
  },
  typography:{
    fontFamily: "'Roboto', sans-serif"
  }
});

const reducer = (state,{type, payload}) => {
  switch (type) {
    case 'LOGIN':
      return {
        ...state,
        authenticated: true,
        user:payload
      }
    case 'LOGOUT':
      return {
        ...state,
        authenticated: false,
        user: null
      }
    case 'STOP_LOADING':
      return {
        ...state,
        loading: false
      }
  
    default:
      throw new Error(`Unknown action type ${type}`);
  }
}

function Application() {
  const [vcardValues, setVcardValues] = useState(VcardDefaultValues);
  const [state, dispatch] = useReducer(reducer, {
    authenticated: false,
    user:null,
    loading: true
  });

  const [socialGrids, setSocialGrids] = useState({
    amount: 1,
    socials: {}
  })

  const getMyCard = () => {
    axios.get('/vcard/show/mycard').then(({data}) => {
      setVcardValues({
        ...data,
        logoImg: process.env.REACT_APP_URL+'/uploads/'+data.logoImg,
        profilePicture: process.env.REACT_APP_URL+'/uploads/'+data.profilePicture
      })
      let socials = {}
      Object.keys(data.socials).forEach(i => {
        socials = {
          ...socials,
          [i] : data.socials[i].socialMedia
        }
      });
      setSocialGrids({
        amount: Object.keys(data.socials).length,
        socials: socials
      })
    }).catch((err) => {
        console.log(err)
    })
  }

  useEffect(() => {
    axios.get('/auth/me')
    .then(({data}) => {
      dispatch({ type: 'LOGIN', payload: data });
      if(window.location.pathname === '/') getMyCard();
    })
    .catch((err) => null)
    .finally(() => dispatch({type: 'STOP_LOADING'}))
      
  }, [state.authenticated])

  return (
    <ContextProvider.Provider value={{ vcardValues, setVcardValues, socialMediaGrids: { socialGrids, setSocialGrids } , authstate: state, authdispatch: dispatch }}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route path="/">
              <Route path=":vcardId" element={<App />} />
              <Route path="" 
                element={
                  state.loading ?
                  <Loading />
                  :
                  (state.authenticated ? <App /> : <Login />)
                }
              />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </ContextProvider.Provider>
  )
}

ReactDOM.render(
  <Application />,
  document.getElementById('root')
);