import { Alert, Collapse, IconButton } from '@mui/material';
import React,{useState} from 'react'
import CloseIcon from "@mui/icons-material/Close";

const ErrorAlert = ({errAlert,setErrAlert}) => {
  return (
    <div>
            <Collapse in={errAlert.display}>
          <Alert
            severity="error"
            style={{ zIndex: "1" }}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setErrAlert({display:false,msg:""});
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {errAlert.msg}
          </Alert>
        </Collapse>

    </div>
  )
}

export default React.memo(ErrorAlert)