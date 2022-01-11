import React, { createContext, useState, useEffect } from 'react';
import swal from 'sweetalert';
const axios = require('axios');

const themes = {
  Dark: {
    primary: '#dddddd',
    separatorColor: 'rgba(255,255,255,0.20)',
    textColor: 'white',
    backgroundColor: '#121212',
    buttonColor: 'rgba(255,255,255,0.05)',
    blockquoteColor: 'rgba(255,255,255,0.20)',
    icon: 'white',
  },
  Light: {
    primary: '#999999',
    separatorColor: 'rgba(0,0,0,0.08)',
    textColor: 'black',
    backgroundColor: 'white',
    buttonColor: '#f6f6f6',
    blockquoteColor: 'rgba(0,0,0,0.80)',
    icon: '#121212',
  },
  Grey: {
    primary: '#582713',
    separatorColor: 'rgba(0,0,0,0.08)',
    textColor: 'grey',
    backgroundColor: 'brown',
    buttonColor: '#f6f6f6',
    blockquoteColor: 'rgba(0,0,0,0.80)',
    icon: '#121212',
  },
};

const setCSSVariables = (theme) => {
  for (const value in theme) {
    console.log(value);
    document.documentElement.style.setProperty(`--${value}`, theme[value]);
  }
};

export const ThemeSelectorContext = createContext({
  themeName: 'Dark',
  toggleTheme: () => {},
});

const addtheme = (option) => {

    axios.patch('http://localhost:2000/add-theme', { name:option }, {
      headers: {
        'content-type': 'application/json',
        'token': localStorage.getItem('token')
      }
    }).then((res) => {
      console.log("res",res);
      swal({
        text: res.data.title,
        icon: "success",
        type: "success"
      });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
     
    });

  }

export default ({ children }) => {
  const [themeName, setThemeName] = useState('Light');
  const [theme, setTheme] = useState(themes[themeName]);

  const toggleTheme = (value) => {
    console.log("****************************",value)
      addtheme(value);
    setTheme(themes[value]);
    setThemeName(value);
  };

  useEffect(() => {
    setCSSVariables(theme);
  });

  return (
    <ThemeSelectorContext.Provider value={{ themeName, toggleTheme }}>
      {children}
    </ThemeSelectorContext.Provider>
  );
};
