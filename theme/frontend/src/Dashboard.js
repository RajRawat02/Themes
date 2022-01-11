import React, { Component,useState,useContext,useEffect } from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { ThemeSelectorContext } from './Theme';
const axios = require('axios');

 const Dashboard = (props) => {
    let theme = localStorage.length !==0? localStorage.getItem('theme'):'Grey';
    const [token,setToken] =  useState('');

    const { themeName, toggleTheme, addtheme } = useContext(ThemeSelectorContext);
    const [option, Setoption] = useState(theme);
    const options = [
      { value: 'one', label: 'Grey' },
      { value: 'two', label: 'Dark' },
      { value: 'three', label: 'Light' },
    ];
  
    const onSelect = (option) => {
      Setoption(option.label);
    };

    useEffect (() => {
      let token1 = localStorage.getItem('token');
      toggleTheme(theme);
      if (!token1) {
        props.history.push('/login');
      } else {
        setToken(token1);
      }
    },[])

    const logOut = () => {
      localStorage.clear();
      props.history.push('/');
      toggleTheme('Grey');
    }

    return (
      
      <section>
      <Dropdown
        options={options}
        onChange={(o) => onSelect(o)}
        value={option}
        placeholder="Select an option"
      />
      <button onClick = {() => addtheme(option)}>Change Theme!</button>
      <button onClick={logOut}>log out </button>
      <p>
        This just happens to be the color pallette I use for my blog, but really
        the sky is the limit when it comes to themes, so feel free to
        experiment.
      </p>
    </section>  
    );
  
}

export default Dashboard;