import React, { useState } from 'react';
import {
  Container, Grid, TextField, Button, OutlinedInput, FormControl, InputAdornment, IconButton
} from '@material-ui/core';
import axios from 'axios';
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import { Redirect } from 'react-router-dom';
import { Visibility, VisibilityOff } from "@material-ui/icons";
import './login-page.css';
import { useAuth } from "../../context/auth";

const LoginPage = () => {
  const { setAuthInfo, setUserInfo } = useAuth();

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [alertMessage, setAlertMessage] = useState();
  const [isLogged, setLogged] = useState(false);
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/login', {
      email,
      password,
    }).then((response) => {
      const { authToken, user } = response.data;
      setAuthInfo(authToken);
      setUserInfo(user);
      setLogged(true);
    }).catch((err) => {
      const { response } = err;
      if (!response) {
        setAlertMessage('Start the server');
      } else if (response.status === 500) {
        setAlertMessage('Internal server error');
      } else if (response.status === 400) {
        setAlertMessage('Not all fields are filled');
      } else if (response.status === 401) {
        setAlertMessage('Incorect password');
      } else if (response.status === 404) {
        setAlertMessage('Incorect email');
      }
    });
  };

  if (isLogged) {
    return <Redirect to="/profile"/>
  }

  return (
    <Container component="form" maxWidth="sm" id="login-form" className="mt-5">
      <Grid container direction="column" className="">
        <h1 className="text-center font-weight-bold primary-color">LOGO</h1>
        <div className="font-weight-bold mt-4">Login</div>
        <TextField
          variant="outlined"
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="font-weight-bold mt-4">Password</div>
        <FormControl>
          <OutlinedInput
            id="standard-adornment-password"
            type={isPasswordVisible ? 'text' : 'password'}
            onChange={(e) => setPassword(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  className="pr-0"
                  onClick={() => setPasswordVisible(!isPasswordVisible)}
                >
                  {isPasswordVisible ? <Visibility className="primary-color" /> : <VisibilityOff className="primary-color" />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        <Button type="submit" onClick={login} className="w-25 mt-4 primary-button">
          Login
        </Button>
        {
          alertMessage ? (
            <Alert className="mt-3" severity="error" onClose={() => setAlertMessage(null)}>
              <AlertTitle>Error</AlertTitle>
              {alertMessage}
            </Alert>
          ) : null
        }
      </Grid>
    </Container>
  );
};

export default LoginPage;
