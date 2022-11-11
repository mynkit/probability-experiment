import React, { useState, useEffect } from 'react'
import ReactModal from 'react-modal';
import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

const useStyles = makeStyles((theme) => ({
  modal: {
    position: 'absolute',
    top: '60px',
    right: '15px',
    display: 'block',
    padding: '10px',
    width:  '330px',
    color: '#000000',
    backgroundColor: '#fff',
    boxShadow: '0 10px 25px 0 rgba(0, 0, 0, .2)',
    borderRadius: '10px',
    outline: 'transparent',
    zIndex: 100000,
  },
  overlay: {
    position: 'fixed',
    top: '0',
    right: '0',
    bottom: '0',
    left: '0',
  },
  setting: {
    height: '50px',
    position: 'relative',
    justifyContent: 'center',
    textAlign: 'right',
    cursor: 'pointer',
    '&:hover': {
      borderRadius: '10px',
      background: '#eff2f5',
    }
  },
  displayServiceIcon: {
    position: 'absolute',
    display: 'flex',
    '& > *': {
      // margin: theme.spacing(1),
    },
    alignItems: 'center',
    height: '100%'
  },
  setting_text: {
    fontSize: '17px',
  },
  displayNextIcon: {
    '& > *': {
      // margin: theme.spacing(1),
    },
  },
  signOutButton: {
    padding: '10px',
    marginTop: '35px',
    marginLeft: '10px',
    marginRight: '10px',
    borderRadius: '20px',
    backgroundColor: 'rgb(224, 36, 94)',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '15px',
    '&:hover': {
      backgroundColor: 'rgb(202, 32, 85)'
    }
  },
  signOutModal: {
    position: 'absolute',
    left: '0',
    right: '0',
    top: '0',
    bottom: '0',
    margin: 'auto',
    padding: '5px',
    width: '350px',
    maxWidth: '95%',
    height: '200px',
    color: '#000000',
    backgroundColor: '#eff2f5',
    boxShadow: '0 10px 25px 0 rgba(30, 30, 30, .4)',
    borderRadius: '10px',
  },
  signOutOverlay: {
    position: 'fixed',
    top: '0',
    right: '0',
    bottom: '0',
    left: '0',
    backgroundColor: 'rgba(0,0,0,.4)',
  },
  cardContent: {
    flex: '1 0 auto',
  },
  cancelButton: {
    padding: '10px',
    marginTop: '35px',
    marginLeft: '10px',
    marginRight: '10px',
    borderRadius: '20px',
    backgroundColor: 'rgb(37, 51, 65)',
    color: '#fff',
    fontSize: '15px',
    '&:hover': {
      backgroundColor: 'rgb(59, 71, 84)',
    }
  },
}));

type Props = {
  showInitModal: boolean;
  setShowInitModal: React.Dispatch<React.SetStateAction<boolean>>;
  setNotChangedBingoCount: React.Dispatch<React.SetStateAction<number>>;
  setChangedBingoCount: React.Dispatch<React.SetStateAction<number>>;
  setNotChangedMissCount: React.Dispatch<React.SetStateAction<number>>;
  setChangedMissCount: React.Dispatch<React.SetStateAction<number>>;
}

const InitModal: React.FC<Props> = ({ showInitModal, setShowInitModal, setNotChangedBingoCount, setChangedBingoCount, setNotChangedMissCount, setChangedMissCount }) => {
  const classes = useStyles();
  return (
    <div>
      <ReactModal
        isOpen={showInitModal}
        onRequestClose={()=>{setShowInitModal(false);}}
        className={classes.signOutModal}
        overlayClassName={classes.signOutOverlay}
        ariaHideApp={false}
      >
        <CardContent className={classes.cardContent}>
          <Grid container alignItems='center' justifyContent='center'>
            <Typography component="h5" variant="h5">
              初期化しますか？
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              <br/>すべての回数を0に戻します
            </Typography>
            <Grid
              container
              alignItems='center'
              justifyContent='center'
            >
              <div className={classes.cancelButton} onClick={()=>{
                setShowInitModal(false);
              }}>
                キャンセル
              </div>
              <div className={classes.signOutButton} onClick={async ()=>{
                localStorage.setItem('notChangedBingoCount', '0');
                localStorage.setItem('changedBingoCount', '0');
                localStorage.setItem('notChangedMissCount', '0');
                localStorage.setItem('changedMissCount', '0');
                setNotChangedBingoCount(0);
                setChangedBingoCount(0);
                setNotChangedMissCount(0);
                setChangedMissCount(0);
                setShowInitModal(false);
              }}>
                初期化
              </div>
            </Grid>
          </Grid>
        </CardContent>
      </ReactModal>
    </div>
  )
}

export default InitModal