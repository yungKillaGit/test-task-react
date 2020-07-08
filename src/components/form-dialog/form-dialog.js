import React, { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  withStyles,
  Typography,
  Button,
  OutlinedInput,
  InputAdornment, FormControl
} from "@material-ui/core";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';
import axios from 'axios';
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import './form-dialog.css';
import { useAuth } from "../../context/auth";
import PasswordTooltip from "../password-tooltip/password-tooltip";
import Grid from "@material-ui/core/Grid";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(3),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.getContrastText('#FFFFFF')
  },
});

const CustomizedDialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <DialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
});

const CustomizedDialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(DialogActions);

const initialValidationMessages = {};
['email', 'newPassword', 'currentPassword', 'name'].forEach((field) => {
  initialValidationMessages.field = {
    error: false,
    helperText: null,
  }
})

const FormDialog = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState();
  const [currentPassword, setCurrentPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [fullName, setFullName] = useState();
  const { setUserInfo } = useAuth();
  const [validationMessages, setValidationMessages] = useState(initialValidationMessages);
  const [alertMessage, setAlertMessage] = useState();
  const childRef = useRef();

  useImperativeHandle(ref, () => ({
    toggle: () => {
      setOpen(!open);
    }
  }));

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
    childRef.current.validate(e.target.value);
  }

  const successfulCallback = (response) => {
    const { user } = response.data;
    setUserInfo(user);
    closeDialog();
  };
  const callbackInCaseOfError = (err) => {
    const { response } = err;
    if (!response) {
      setAlertMessage('Start the server');
    } else if (response.status === 500) {
      setAlertMessage('Internal server error');
    } else if (response.status === 400) {
      setAlertMessage('Not all fields are filled');
    } else if (response.status === 401) {
      setAlertMessage('Incorect password');
    } else if (response.status === 422) {
      if (props.fieldName !== 'password') {
        const newValidationMessages = {...validationMessages};
        newValidationMessages[props.fieldName] = {
          error: true,
          helperText: response.data.error.message,
        };
        setValidationMessages(newValidationMessages);
      } else {
        childRef.current.processServerValidation(response.data);
      }
    }
  };

  const changeEmail = () => {
    /*if (!contents.email.validate()) {
      return;
    }*/
    axios.patch('http://localhost:5000/users/email', {
      email,
    }).then((response) => {
      successfulCallback(response);
    }).catch((err) => {
      callbackInCaseOfError(err);
    });
  };
  const changeFullName = () => {
    if (!contents.name.validate()) {
      return;
    }
    axios.patch('http://localhost:5000/users/full-name', {
      fullName,
    }).then((response) => {
      successfulCallback(response);
    }).catch((err) => {
      callbackInCaseOfError(err);
    });
  };
  const changePassword = () => {
    axios.patch('http://localhost:5000/users/password', {
      currentPassword,
      newPassword,
    }).then((response) => {
      successfulCallback(response);
    }).catch((err) => {
      callbackInCaseOfError(err);
    });
  };

  const contents = {
    email: {
      element: <TextField
        {...validationMessages.email}
        variant="outlined"
        fullWidth={true}
        onChange={(e) => setEmail(e.target.value)}/>,
      action: changeEmail,
      validate: () => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(email)) {
          const newValidationMessages = {...validationMessages};
          newValidationMessages.email = {
            error: true,
            helperText: 'Enter correct email',
          }
          setValidationMessages(newValidationMessages);
          return false;
        }
        return true;
      },
    },
    name: {
      element: <TextField
        {...validationMessages.name}
        variant="outlined"
        fullWidth={true}
        onChange={(e) => setFullName(e.target.value)}/>,
      action: changeFullName,
      validate: () => {
        if ((fullName && fullName.replace(/\s/g, '').length === 0) || !fullName) {
          const newValidationMessages = {...validationMessages};
          newValidationMessages.name = {
            error: true,
            helperText: 'Enter name',
          }
          setValidationMessages(newValidationMessages);
          return false;
        }
        return true;
      },
    },
    password: {
      element:
        <Grid item container direction="column">
          <div className="font-weight-bold">Current password</div>
          <TextField
            {...validationMessages.currentPassword}
            type="password"
            variant="outlined"
            fullWidth={true}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <Grid item container justify="space-between">
            <Grid item direction="column">
              <div className="mt-4 font-weight-bold">New password</div>
            </Grid>
            <Grid item direction="column">
              <div className="mt-4" id="password-strength"/>
            </Grid>
          </Grid>
          <FormControl fullWidth={true}>
            <OutlinedInput
              id="standard-adornment-password"
              type="password"
              fullWidth={true}
              onChange={handlePasswordChange}
              endAdornment={
                <InputAdornment position="end">
                  <PasswordTooltip password={newPassword} ref={childRef}/>
                </InputAdornment>
              }
            />
          </FormControl>
        </Grid>,
      action: changePassword,
    }
  };

  const closeDialog = () => {
    setEmail(null);
    setFullName(null);
    setCurrentPassword(null);
    setNewPassword(null);
    setValidationMessages(initialValidationMessages);
    setOpen(false);
  }

  return (
    <div className="form-dialog">
      <Dialog fullWidth={true} maxWidth="xs" open={open} onClose={ closeDialog } aria-labelledby="form-dialog-title">
        <CustomizedDialogTitle className="primary-color" id="form-dialog-title" onClose={ closeDialog }>
          { `Change ${props.fieldName}` }
        </CustomizedDialogTitle>
        <DialogContent>
          {
            contents[props.fieldName] ? contents[props.fieldName].element : null
          }
          {
            alertMessage ? (
              <Alert className="mt-3" severity="error" onClose={() => setAlertMessage(null)}>
                <AlertTitle>Error</AlertTitle>
                {alertMessage}
              </Alert>
            ) : null
          }
        </DialogContent>
        <CustomizedDialogActions>
          {
            props.fieldName !== 'password'
              ?
              <Button
                onClick={contents[props.fieldName] ? contents[props.fieldName].action : null}
                size="medium"
                className="primary-button mr-3 mt-4"
                startIcon={<SaveIcon/>}>
                Save
              </Button>
              :
              <Button onClick={contents[props.fieldName] ? contents[props.fieldName].action : null} size="medium" className="primary-button mr-3 mt-4">
                Submit
              </Button>
          }
        </CustomizedDialogActions>
      </Dialog>
    </div>
  );
});

export default React.memo(FormDialog);
