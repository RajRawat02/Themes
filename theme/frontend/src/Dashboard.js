import React, { Component,useState,useContext,useEffect } from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { ThemeSelectorContext } from './Theme';
const axios = require('axios');

 const Dashboard = (props) => {
  
    const [token,setToken] =  useState('');

    const { themeName, toggleTheme } = useContext(ThemeSelectorContext);
    const [option, Setoption] = useState(localStorage.getItem('theme'));
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
      if (!token1) {
        props.history.push('/login');
      } else {
        setToken(token1);
      }
    },[])

    /*useEffect(()=>{
      console.log("token",token);
      getTheme();
    },[token]);


    const getTheme = () => {
      setLoading({ loading: true });
      let userId = localStorage.getItem('user_id');
      
      axios.get('http://localhost:2000/get-theme', {
        headers: {
          'token': token
        }
      }).then((res) => {
        Setoption( res.data.theme);
        
      }).catch((err) => {
        swal({
          text: err.response.data.errorMessage,
          icon: "error",
          type: "error"
        });
        setLoading({ loading: false });
      });
    }*/

    const logOut = () => {
      localStorage.setItem('token', null);
      props.history.push('/');
      toggleTheme('Grey');
    }

    return (
      
      <section>
      <h1>My theme is {themeName}</h1>
      <Dropdown
        options={options}
        onChange={(o) => onSelect(o)}
        value={option}
        placeholder="Select an option"
      />
      <button onClick={() => toggleTheme(option)}>Change Theme!</button>
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