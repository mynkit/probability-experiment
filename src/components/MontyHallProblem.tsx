import React, { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid';
import { shuffle, range } from '../utils/arrayFunc';
import AlertModal from './AlertModal';
import ResultModal from './ResultModal';
import Button from '@mui/material/Button';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PlayDisabledIcon from '@mui/icons-material/PlayDisabled';
import CachedIcon from '@mui/icons-material/Cached';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

type Door = number;

type DoorImgProps = {
  door: Door;
  firstSelectedDoor: Door | null;
  setFirstSelectedDoor: React.Dispatch<React.SetStateAction<Door | null>>;
  missingDoors: Door[];
  setShowAlertModal: React.Dispatch<React.SetStateAction<boolean>>;
  bingo: Door;
  finalMissingDoor: Door | null;
  setFinalMissingDoor: React.Dispatch<React.SetStateAction<Door | null>>;
  secondSelectedDoor: Door | null;
  setSecondSelectedDoor: React.Dispatch<React.SetStateAction<Door | null>>;
  finalResult: 0 | 1 | null;
  setFinalResult: React.Dispatch<React.SetStateAction<0 | 1 | null>>;
  setShowResultModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const DoorImg: React.FC<DoorImgProps> = ({ door, firstSelectedDoor, setFirstSelectedDoor, missingDoors, setShowAlertModal, bingo, finalMissingDoor, setFinalMissingDoor, secondSelectedDoor, setSecondSelectedDoor, finalResult, setFinalResult, setShowResultModal }) => {
  const [imgSrc, setImgSrc] = useState('')
  useEffect(() => {
    if (finalResult!==null) {
      setImgSrc('/doors/door_close_resize.png');
    }
    if (missingDoors.includes(door) || finalMissingDoor===door) {
      setImgSrc('/doors/door_open.png');
    } else if (secondSelectedDoor!==null && bingo===door && bingo===secondSelectedDoor) {
      setImgSrc('doors/present_happy_boy_resize.png');
    } else {
      setImgSrc('/doors/door_close_resize.png');
    }
  }, [missingDoors, finalMissingDoor, secondSelectedDoor, finalResult])
  return (
    <img id={`img${door}`} src={imgSrc} width='90%' style={{cursor: 'pointer'}} onClick={()=>{
      if (firstSelectedDoor===null) {
        setFirstSelectedDoor(door);
      } else {
        if (missingDoors.includes(door)) {
          setShowAlertModal(true);
        } else if (bingo!==door) {
          setFinalMissingDoor(door);
          setSecondSelectedDoor(door);
          setFinalResult(0);
          setShowResultModal(true);
        } else {
          // ?????????
          setSecondSelectedDoor(door);
          setFinalResult(1);
          setShowResultModal(true);
        }
      }
    }}/>
  )
}

const firstBingo: Door = shuffle(['A', 'B', 'C'])[0]; // ?????????????????????

const MontyHallProblem: React.FC = () => {
  const [doorCount, setDoorCount] = useState(3);
  const [doors, setDoors] = useState<Door[]>(range(1, doorCount+1));
  const [bingo, setBingo] = useState(firstBingo);
  const [firstSelectedDoor, setFirstSelectedDoor] = useState<Door|null>(null);
  const [missingDoors, setMissingDoors] = useState<Door[]>([]);
  const [secondSelectedDoor, setSecondSelectedDoor] = useState<Door|null>(null);
  const [finalMissingDoor, setFinalMissingDoor] = useState<Door|null>(null);
  const [finalResult, setFinalResult] = useState<1|0|null>(null);
  const [announce, setAnnounce] = useState('');
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [changedBingoCount, setChangedBingoCount] = useState(0);
  const [changedMissCount, setChangedMissCount] = useState(0);
  const [notChangedBingoCount, setNotChangedBingoCount] = useState(0);
  const [notChangedMissCount, setNotChangedMissCount] = useState(0);
  const [autoMode, setAutoMode] = useState(false);
  const [timeId, setTimeId] = useState<NodeJS.Timer|null>(null);
  const [hiddenCommandCount, setHiddenCommandCount] = useState(0);
  const [hiddenButton, setHiddenButton] = useState(false);
  const [clickInterval, setClickInterval] = useState(100); // ??????????????????
  const [bakusokuMode, setBakusokuMode] = useState(false);

  useEffect(() => {
    document.title = '???????????????????????????';
  }, [])

  useEffect(() => {
    setDoors(range(1, doorCount+1));
    init();
  }, [doorCount])

  useEffect(() => {
    setBingo(shuffle(doors)[0]);
  }, [doors])

  useEffect(() => {
    // console.log(`?????????: ${bingo}`);
  }, [bingo])

  const init = () => {
    setFirstSelectedDoor(null);
    setMissingDoors([]);
    setSecondSelectedDoor(null);
    setFinalMissingDoor(null);
    setFinalResult(null);
    setShowAlertModal(false);
    setShowResultModal(false);
    setBingo(shuffle(doors)[0]);
  }

  const initResult = () => {
    setNotChangedBingoCount(0);
    setChangedBingoCount(0);
    setNotChangedMissCount(0);
    setChangedMissCount(0);
  }

  useEffect(() => {
    if (hiddenCommandCount>=15) {
      setHiddenButton(true);
      if (hiddenCommandCount>=25) {
        if (hiddenCommandCount % 2 === 1) {
          setBakusokuMode(true);
        } else {
          setBakusokuMode(false);
        }
      }
    } else {
      setHiddenButton(false);
    }
  }, [hiddenCommandCount])

  useEffect(() => {
    if (bakusokuMode) {
      setClickInterval(10);
    } else {
      setClickInterval(100);
    }
  }, [bakusokuMode])

  useEffect(() => {
    if (firstSelectedDoor!==null) {
      let missingDoors_ = shuffle(doors.filter(door => door!==firstSelectedDoor && door!=bingo)).slice(0, doors.length-2);
      missingDoors_.sort();
      setMissingDoors(missingDoors_);
    }
  }, [firstSelectedDoor])

  useEffect(() => {
    if (missingDoors.length===0) {
      setAnnounce(`???????????????????????????????????????`);
    } else if (finalResult===null) {
      setAnnounce(`??????${doors.filter(door=>!missingDoors.includes(door)).join(', ')}????????????????????????????????????${doors.filter(door=>!missingDoors.includes(door)).join(', ')}????????????????????????????????????`);
    }
  }, [missingDoors, finalMissingDoor, secondSelectedDoor, finalResult])

  useEffect(() => {
    if (finalResult===1) {
      if (firstSelectedDoor===secondSelectedDoor) {
        setNotChangedBingoCount(v => v+1);
      } else {
        setChangedBingoCount(v => v+1);
      }
    }
    if (finalResult===0) {
      if (firstSelectedDoor===secondSelectedDoor) {
        setNotChangedMissCount(v => v+1);
      } else {
        setChangedMissCount(v => v+1);
      }
    }
  }, [finalResult])

  useEffect(() => {
    if (autoMode) {
      let timerId_ = setInterval(()=>{
        if (document.getElementById(`resultmodal`)) {
          (document.getElementById(`resultmodal`) as HTMLElement).click();
        } else {
          let closedDoors: Door[] = [];
          for (let i=0; i<doorCount; i++) {
            let d = document.getElementById(`img${doors[i]}`) as HTMLElement;
            if (d.getAttribute('src')?.includes('close')) {
              closedDoors.push(doors[i]);
            }
          }
          let targetDoor = shuffle(closedDoors)[0];
          (document.getElementById(`img${targetDoor}`) as HTMLElement).click();
        }
      }, clickInterval);
      setTimeId(timerId_)
    } else {
      if (timeId!==null) clearInterval(timeId);
    }
  }, [autoMode])

  return (
    <div style={{padding: '10px'}}>
      <h1 onClick={()=>setHiddenCommandCount(v=>v+1)} style={{backgroundColor: `rgb(${0},${0},${0},${Math.min(hiddenCommandCount/100., 0.1)})`}}>???????????????????????????</h1>
      <div style={{paddingTop: '10px'}}/>
      <Grid container justifyContent='flex-start' alignItems='center'>
        <Button color={autoMode ? "primary" : "inherit"} variant="outlined" startIcon={<RemoveIcon />} onClick={()=>{
          if(doorCount>3) {
            setDoorCount(v=>v-1);
            initResult();
          }
        }} disabled={autoMode} size="medium">
          ??????????????????
        </Button>
        <Button color={autoMode ? "primary" : "inherit"} variant="outlined" startIcon={<AddIcon />} onClick={()=>{
          setDoorCount(v=>v+1);
          initResult();
        }} disabled={autoMode} size="medium">
          ??????????????????
        </Button>
      </Grid>
      <div style={{paddingTop: '10px'}}/>
      <Grid container>
        <div style={{fontSize: '17pt'}}>{`??????${doors.length}????????????????????????????????????????????????????????????`}</div>
        {hiddenButton ? (
          <Button style={{zIndex: 100}} color={autoMode ? "primary" : "inherit"} variant="outlined" startIcon={autoMode ? <PlayDisabledIcon/> : <PlayArrowIcon />} onClick={()=>{setAutoMode(v=>!v)}} disabled={false} size="medium">
            {autoMode ? '????????????' : `????????????${bakusokuMode ? '(??????)' : ''}`}
          </Button>
        ): <></>}
      </Grid>
      <span style={{fontSize: '20pt', textDecoration: 'underline', paddingRight: '10px'}}>
          {announce}
        </span>
      <div style={{padding: '5px'}}/>
      <Grid container maxWidth='100%' width='1000px' alignItems='flex-start' justifyContent='flex-start' style={{textAlign: 'center'}}>
        {doors.map((door) => {
          return (
            <Grid key={door} item xs={doors.length <= 12 ? (12. / doors.length) : doors.length > 24 ? 0.9 : 1}>
              <div style={{
                fontSize: '20pt',
                borderBottom: `${firstSelectedDoor===door ? 'dashed' : 'solid'} 2px ${firstSelectedDoor===door ? 'gray' : secondSelectedDoor===door ? 'red' : 'white'}`,
                borderTop: `${firstSelectedDoor===door ? 'dashed' : 'solid'} 2px ${firstSelectedDoor===door ? 'gray' : secondSelectedDoor===door ? 'red' : 'white'}`,
                borderLeft: `${firstSelectedDoor===door ? 'dashed' : 'solid'} 2px ${firstSelectedDoor===door ? 'gray' : secondSelectedDoor===door ? 'red' : 'white'}`,
                borderRight: `${firstSelectedDoor===door ? 'dashed' : 'solid'} 2px ${firstSelectedDoor===door ? 'gray' : secondSelectedDoor===door ? 'red' : 'white'}`,
                borderRadius: `10px`,
              }}>{door}</div>
              <DoorImg
                door={door}
                firstSelectedDoor={firstSelectedDoor}
                setFirstSelectedDoor={setFirstSelectedDoor}
                missingDoors={missingDoors}
                setShowAlertModal={setShowAlertModal}
                bingo={bingo}
                finalMissingDoor={finalMissingDoor}
                setFinalMissingDoor={setFinalMissingDoor}
                secondSelectedDoor={secondSelectedDoor}
                setSecondSelectedDoor={setSecondSelectedDoor}
                finalResult={finalResult}
                setFinalResult={setFinalResult}
                setShowResultModal={setShowResultModal}
              />
            </Grid>
          );
        })}
      </Grid>
      <div style={{paddingTop: '20px'}}/>
      <Grid container maxWidth='100%' width='700px' alignItems='flex-end' justifyContent='flex-end' style={{textAlign: 'center'}}>
        <Grid item xs={2.4}>
          <Button style={{fontSize: '10pt', paddingLeft: '5px', paddingRight: '5px', paddingTop: '2px', paddingBottom: '2px'}} color={"inherit"} variant="outlined" startIcon={<CachedIcon />} onClick={()=>{
            initResult();
          }}>
            ?????????
          </Button>
        </Grid>
        <Grid item xs={2.4}>
          <span style={{fontSize: '15pt'}}>?????????</span>
        </Grid>
        <Grid item xs={2.4}>
          <span style={{fontSize: '15pt'}}>?????????</span>
        </Grid>
        <Grid item xs={2.4}>
          <span style={{fontSize: '15pt'}}>??????</span>
        </Grid>
        <Grid item xs={2.4}>
          <span style={{fontSize: '15pt'}}>??????(%)</span>
        </Grid>
        <Grid item xs={2.4}>
          <span style={{fontSize: '15pt'}}>?????????</span>
        </Grid>
        <Grid item xs={2.4}>
          <span style={{fontSize: '15pt'}}>{changedBingoCount}</span>
        </Grid>
        <Grid item xs={2.4}>
          <span style={{fontSize: '15pt'}}>{changedMissCount}</span>
        </Grid>
        <Grid item xs={2.4}>
          <span style={{fontSize: '15pt'}}>{changedBingoCount+changedMissCount}</span>
        </Grid>
        <Grid item xs={2.4}>
          <span style={{fontSize: '15pt'}}>{changedBingoCount+changedMissCount>0 ? Math.floor(100*100*changedBingoCount/(changedBingoCount+changedMissCount))/100 : ''}</span>
        </Grid>
        <Grid item xs={2.4}>
          <span style={{fontSize: '15pt'}}>?????????</span>
        </Grid>
        <Grid item xs={2.4}>
          <span style={{fontSize: '15pt'}}>{notChangedBingoCount}</span>
        </Grid>
        <Grid item xs={2.4}>
          <span style={{fontSize: '15pt'}}>{notChangedMissCount}</span>
        </Grid>
        <Grid item xs={2.4}>
          <span style={{fontSize: '15pt'}}>{notChangedBingoCount+notChangedMissCount}</span>
        </Grid>
        <Grid item xs={2.4}>
          <span style={{fontSize: '15pt'}}>{notChangedBingoCount+notChangedMissCount>0 ? Math.floor(100*100*notChangedBingoCount/(notChangedBingoCount+notChangedMissCount))/100 : ''}</span>
        </Grid>
      </Grid>
      <AlertModal showAlertModal={showAlertModal} setShowAlertModal={setShowAlertModal} alertText={`${doors.filter(door=>!missingDoors.includes(door)).join(', ')}???????????????????????????`}/>
      <ResultModal showResultModal={showResultModal} setShowResultModal={setShowResultModal} finalResult={finalResult} init={init}/>
    </div>
  )
}

export default MontyHallProblem