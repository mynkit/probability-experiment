import React, { useEffect } from 'react'
import ReactModal from 'react-modal';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  submitalertmodal: {
    position: 'absolute',
    left: '0',
    right: '0',
    margin: 'auto',
    bottom: '0',
    top: '0',
    height: '25px',
    padding: '5px',
    width: '270px',
    color: '#000000',
    backgroundColor: '#fff',
    boxShadow: '0 10px 25px 0 rgba(30, 30, 30, .4)',
    borderRadius: '3px',
    outline: 'transparent',
  },
  submitalertmodalText: {
    position: 'relative',
    textAlign: 'center',
  },
  overlay: {
    position: 'fixed',
    top: '0',
    right: '0',
    bottom: '0',
    left: '0',
  },
}));

type Props = {
  showAlertModal: boolean;
  setShowAlertModal: React.Dispatch<React.SetStateAction<boolean>>;
  alertText: string;
}

const AlertModal: React.FC<Props> = ({ showAlertModal, setShowAlertModal, alertText }) => {
  const classes = useStyles();
  useEffect(() => {
    if (showAlertModal) {
      setTimeout(()=>setShowAlertModal(false), 1000);
    }
  }, [showAlertModal])
  return (
    <ReactModal
      isOpen={showAlertModal}
      onRequestClose={()=>{setShowAlertModal(false)}}
      className={classes.submitalertmodal}
      overlayClassName={classes.overlay}
      ariaHideApp={false}
    >
      <div className={classes.submitalertmodalText}>{alertText}</div>
    </ReactModal>
  )
}

export default AlertModal