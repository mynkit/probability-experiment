import React, { useState, useEffect } from 'react'
import ReactModal from 'react-modal';
import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';

const useStyles = makeStyles((theme) => ({
  modal: {
    position: 'absolute',
    left: '0',
    right: '0',
    margin: 'auto',
    bottom: '0',
    top: '0',
    width: '505px',
    height: '360px',
    maxWidth: '100%',
    padding: '5px',
    color: '#000000',
    backgroundColor: 'rgba(255,255,255,.5)',
    boxShadow: '0 10px 25px 0 rgba(30, 30, 30, .4)',
    borderRadius: '3px',
    outline: 'transparent',
  },
  overlay: {
    position: 'fixed',
    top: '0',
    right: '0',
    bottom: '0',
    left: '0',
    backgroundColor: 'rgba(0,0,0,.4)',
  },
}));

type Props = {
  showResultModal: boolean;
  setShowResultModal: React.Dispatch<React.SetStateAction<boolean>>;
  finalResult: 0|1|null;
  init: () => void;
}

const ResultModal: React.FC<Props> = ({ showResultModal, setShowResultModal, finalResult, init }) => {
  const classes = useStyles();
  return (
    <ReactModal
      isOpen={showResultModal}
      onRequestClose={()=>{
        setShowResultModal(false);
        init();
      }}
      className={classes.modal}
      overlayClassName={classes.overlay}
      ariaHideApp={false}
    >
      <Grid container justifyContent='center' alignItems='center' style={{textAlign: 'center'}}>
        <div onClick={()=>{init()}}>
        {
          finalResult===1 ? (
            <img id='resultmodal' src='/doors/kuji_ken2_atari.png' width='500px' style={{opacity: 0.7}}/>
          ) : (
            <img id='resultmodal' src='/doors/kuji_ken3_hazure.png' width='500px' style={{opacity: 0.7}}/>
          )
        }
        </div>
      </Grid>
    </ReactModal>
  )
}

export default  ResultModal