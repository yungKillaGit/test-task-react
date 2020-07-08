import React, { useState, useRef } from 'react';
import {
  Grid, IconButton,
} from "@material-ui/core";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { Redirect } from 'react-router-dom';
import { useAuth } from "../../context/auth";
import './profile-page.css';
import FormDialog from "../form-dialog/form-dialog";

const ProfilePage = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [fieldName, setFieldName] = useState();
  const childRef = useRef();

  if (!isAuthenticated) {
    return <Redirect to="/" />
  }

  const changeFullName = () => {
    setFieldName('name');
    childRef.current.toggle();
  };
  const changeEmail = () => {
    setFieldName('email');
    childRef.current.toggle();
  };
  const changePassword = () => {
    setFieldName('password');
    childRef.current.toggle();
  }

  return (
    <Grid container direction="row" className="h-100">
      <Grid item container xs={2} direction="column" id="sidebar" className="primary-background h-100">
        <Grid item container direction="row">
          <h1 className="font-weight-bold text-white mt-1">LOGO</h1>
        </Grid>
        <Grid item container direction="row" className="mt-3">
          <AccountCircleIcon/>
          <div>Profile</div>
        </Grid>
      </Grid>
      <Grid item container xs={10} direction="column" alignItems="center" className="w-100" >
        <Grid item container direction="row" alignItems="center" className="dark-background header">
          <Grid item xs={10} container direction="column">
            <div className="ml-4">My Profile</div>
          </Grid>
          <Grid item xs={2} container direction="row" wrap="nowrap" alignItems="center" justify="flex-end" className="pr-4">
            <Grid item xs={2} container direction="column">
              <AccountCircleIcon/>
            </Grid>
            <Grid item xs={8} container direction="column" id="userInfo">
              <div>{ user.fullName }</div>
              <div>Cloud Admin</div>
            </Grid>
            <Grid item xs={2} container direction="column">
              <IconButton className="text-white" onClick={logout}>
                <ExitToAppIcon/>
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
        <Grid item container direction="row">
          <Grid item xs={4} container direction="column" className="profile-content mt-2">
            <div className="profile-input">
              <div className="font-weight-bold">Name</div>
              <div>{ user.fullName }</div>
              <div><a href="#" onClick={changeFullName}>Change name</a></div>
            </div>
            <div className="profile-input">
              <div className="font-weight-bold">Email</div>
              <div>{ user.email }</div>
              <div><a href="#" onClick={changeEmail}>Change email</a></div>
            </div>
            <div className="profile-input">
              <div className="font-weight-bold">Password</div>
              <div><a href="#" onClick={changePassword}>Change password</a></div>
            </div>
          </Grid>
          <Grid item xs={8} container direction="column" justify="flex-end" className="pl-5 w-100">
            <FormDialog fieldName={fieldName} ref={childRef} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ProfilePage;
