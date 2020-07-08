import React, { forwardRef, useState, useImperativeHandle } from 'react';
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';

function getModalStyle() {
  const top = 73;
  const left = 92;
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 280,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2, 4, 3),
    borderRadius: 5,
    outline: 'none',
    fontSize: 'small',
    boxShadow: '5px 5px 5px 5px #5d5d5d',
  },
  error: {
    color: 'red',
  },
  success: {
    color: 'green',
  }
}));

const PasswordTooltip = forwardRef((props, ref) => {
  const classes = useStyles();

  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [attributes, setAttributes] = useState({
    'required-length': {
      className: classes.error,
      isError: true,
    },
    'upper-lower': {
      className: classes.error,
      isError: true,
    },
    'required-number': {
      className: classes.error,
      isError: true,
    }
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useImperativeHandle(ref, () => ({
    validate: (password) => {
      const newAttributes = {...attributes};
      let successCount = 0;
      if (password.length >= 8) {
        newAttributes["required-length"].className = classes.success;
        newAttributes["required-length"].isError = false;
        successCount++;
      } else {
        newAttributes["required-length"].className = classes.error
        newAttributes["required-length"].isError = true;
      }
      if (/^(?=.*[a-zа-яё])(?=.*[A-ZА-ЯЁ]).+$/.test(password)) {
        newAttributes["upper-lower"].className = classes.success;
        newAttributes["upper-lower"].isError = false;
        successCount++;
      } else {
        newAttributes["upper-lower"].className = classes.error;
        newAttributes["upper-lower"].isError = true;
      }
      if (/\d/.test(password)) {
        newAttributes["required-number"].className = classes.success;
        newAttributes["required-number"].isError = false;
        successCount++;
      } else {
        newAttributes["required-number"].className = classes.error;
        newAttributes["required-number"].isError = true;
      }
      const passwordStrengthIndicator = document.getElementById('password-strength');
      passwordStrengthIndicator.innerHTML = null;
      passwordStrengthIndicator.style.color = null;
      if (successCount === 1) {
        passwordStrengthIndicator.innerHTML = 'Weak';
        passwordStrengthIndicator.style.color = 'red';
      }
      if (successCount === 2) {
        passwordStrengthIndicator.innerHTML = 'Medium';
        passwordStrengthIndicator.style.color = 'orange';
      }
      if (successCount === 3) {
        passwordStrengthIndicator.innerHTML = 'Strong';
        passwordStrengthIndicator.style.color = 'green';
      }
      setAttributes(newAttributes);
    },
    processServerValidation: ({ errors }) => {
      const newAttributes = {...attributes};
      errors.forEach((error) => {
        newAttributes[error.type].className = classes.error;
        newAttributes[error.type].isError = true;
      });
      setAttributes(newAttributes);
      setOpen(true);
    },
  }));

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <div>Your new password must have:</div>
      <div id="required-length" {...attributes['required-length']}>
        { attributes['required-length'].isError ? <ClearIcon/> : <CheckIcon/> }
         8 or more characters
      </div>
      <div id="upper-lower" {...attributes['upper-lower']}>
        { attributes['upper-lower'].isError ? <ClearIcon/> : <CheckIcon/> }
         Upper and lowercase letters
      </div>
      <div id="required-number" {...attributes['required-number']}>
        { attributes['required-number'].isError ? <ClearIcon/> : <CheckIcon/> }
         At least one number
      </div>
    </div>
  );
  return (
    <>
      <IconButton className="pr-0" onClick={handleOpen}><HelpOutlineOutlinedIcon/></IconButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </>
  )
});

export default PasswordTooltip;
