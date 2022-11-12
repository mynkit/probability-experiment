import React, { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid';
import { shuffle } from '../utils/arrayFunc';
import AlertModal from './AlertModal';
import ResultModal from './ResultModal';
import Button from '@mui/material/Button';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PlayDisabledIcon from '@mui/icons-material/PlayDisabled';
import InitModal from './InitModal';
import CachedIcon from '@mui/icons-material/Cached';

type Door = 'A'|'B'|'C';

type DoorImgProps = {
  door: Door;
  firstSelectedDoor: Door | null;
  setFirstSelectedDoor: React.Dispatch<React.SetStateAction<Door | null>>;
  missingDoor: Door | null;
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

const DoorImg: React.FC<DoorImgProps> = ({ door, firstSelectedDoor, setFirstSelectedDoor, missingDoor, setShowAlertModal, bingo, finalMissingDoor, setFinalMissingDoor, secondSelectedDoor, setSecondSelectedDoor, finalResult, setFinalResult, setShowResultModal }) => {
  const [imgSrc, setImgSrc] = useState('')
  useEffect(() => {
    if (finalResult!==null) {
      setImgSrc('/doors/door_close_resize.png');
    }
    if (missingDoor===door || finalMissingDoor===door) {
      setImgSrc('/doors/door_open.png');
    } else if (secondSelectedDoor!==null && bingo===door && bingo===secondSelectedDoor) {
      setImgSrc('doors/present_happy_boy.png');
    } else {
      setImgSrc('/doors/door_close_resize.png');
    }
  }, [missingDoor, finalMissingDoor, secondSelectedDoor, finalResult])
  return (
    <img id={`img${door}`} src={imgSrc} width='90%' style={{cursor: 'pointer'}} onClick={()=>{
      if (firstSelectedDoor===null) {
        setFirstSelectedDoor(door);
      } else {
        if (missingDoor===door) {
          setShowAlertModal(true);
        } else if (bingo!==door) {
          setFinalMissingDoor(door);
          setSecondSelectedDoor(door);
          setFinalResult(0);
          setShowResultModal(true);
        } else {
          // あたり
          setSecondSelectedDoor(door);
          setFinalResult(1);
          setShowResultModal(true);
        }
      }
    }}/>
  )
}

const firstBingo: Door = shuffle(['A', 'B', 'C'])[0]; // 当たりの初期値

const MontyHallProblem: React.FC = () => {
  const doors: Door[] = ['A', 'B', 'C'];
  const [bingo, setBingo] = useState(firstBingo);
  const [firstSelectedDoor, setFirstSelectedDoor] = useState<Door|null>(null);
  const [missingDoor, setMissingDoor] = useState<Door|null>(null);
  const [secondSelectedDoor, setSecondSelectedDoor] = useState<Door|null>(null);
  const [finalMissingDoor, setFinalMissingDoor] = useState<Door|null>(null);
  const [finalResult, setFinalResult] = useState<1|0|null>(null);
  const [announce, setAnnounce] = useState('');
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showInitModal, setShowInitModal] = useState(false);
  const [changedBingoCount, setChangedBingoCount] = useState(Number(localStorage.getItem('changedBingoCount')) || 0);
  const [changedMissCount, setChangedMissCount] = useState(Number(localStorage.getItem('changedMissCount')) || 0);
  const [notChangedBingoCount, setNotChangedBingoCount] = useState(Number(localStorage.getItem('notChangedBingoCount')) || 0);
  const [notChangedMissCount, setNotChangedMissCount] = useState(Number(localStorage.getItem('notChangedMissCount')) || 0);
  const [autoMode, setAutoMode] = useState(false);
  const [timeId, setTimeId] = useState<NodeJS.Timer|null>(null);
  const [hiddenCommandCount, setHiddenCommandCount] = useState(0);
  const [hiddenButton, setHiddenButton] = useState(false);
  const [clickInterval, setClickInterval] = useState(100); // 単位はミリ秒
  const [bakusokuMode, setBakusokuMode] = useState(false);

  useEffect(() => {
    document.title = 'モンティホール問題';
  }, [])

  useEffect(() => {
    // console.log(`当たり: ${bingo}`);
  }, [bingo])

  const init = () => {
    setFirstSelectedDoor(null);
    setMissingDoor(null);
    setSecondSelectedDoor(null);
    setFinalMissingDoor(null);
    setFinalResult(null);
    setShowAlertModal(false);
    setShowResultModal(false);
    setBingo(shuffle(['A', 'B', 'C'])[0]);
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
      setMissingDoor(shuffle(doors.filter(door => door!==firstSelectedDoor && door!=bingo))[0]);
    }
  }, [firstSelectedDoor])

  useEffect(() => {
    if (missingDoor===null) {
      setAnnounce('A, B, Cの中から一つのドアを選んでください');
    } else if (finalResult===null) {
      setAnnounce(`実は${missingDoor}のドアはハズレです！残りの${doors.filter(door=>door!==missingDoor).join(', ')}から一つ選んでください。`);
    }
  }, [missingDoor, finalMissingDoor, secondSelectedDoor, finalResult])

  useEffect(() => {
    if (finalResult===1) {
      if (firstSelectedDoor===secondSelectedDoor) {
        localStorage.setItem('notChangedBingoCount', String(notChangedBingoCount+1));
        setNotChangedBingoCount(v => v+1);
      } else {
        localStorage.setItem('changedBingoCount', String(changedBingoCount+1));
        setChangedBingoCount(v => v+1);
      }
    }
    if (finalResult===0) {
      if (firstSelectedDoor===secondSelectedDoor) {
        localStorage.setItem('notChangedMissCount', String(notChangedMissCount+1));
        setNotChangedMissCount(v => v+1);
      } else {
        localStorage.setItem('changedMissCount', String(changedMissCount+1));
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
          let targetDoor = shuffle(['A', 'B', 'C'])[0];
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
      <h1 onClick={()=>setHiddenCommandCount(v=>v+1)} style={{backgroundColor: `rgb(${0},${0},${0},${Math.min(hiddenCommandCount/100., 0.1)})`}}>モンティホール問題</h1>
      <Grid container>
        <div style={{fontSize: '17pt'}}>次の3つのドアのうち、一つが当たりのドアです。</div>
        {hiddenButton ? (
          <Button style={{zIndex: 100}} color={autoMode ? "primary" : "inherit"} variant="outlined" startIcon={autoMode ? <PlayDisabledIcon/> : <PlayArrowIcon />} onClick={()=>{setAutoMode(v=>!v)}} disabled={false} size="medium">
            {autoMode ? '実行停止' : `自動実行${bakusokuMode ? '(爆速)' : ''}`}
          </Button>
        ): <></>}
      </Grid>
      <span style={{fontSize: '20pt', textDecoration: 'underline', paddingRight: '10px'}}>
          {announce}
        </span>
      <div style={{padding: '5px'}}/>
      <Grid container maxWidth='100%' width='1000px' alignItems='flex-end' justifyContent='flex-end' style={{textAlign: 'center'}}>
        <Grid item xs={4}>
          <span style={{fontSize: '20pt'}}>A</span>
          <span style={{fontSize: '11pt'}}>{secondSelectedDoor==='A' ? '(二回目の選択)' : firstSelectedDoor==='A' ? '(一回目の選択)' : ''}</span>
        </Grid>
        <Grid item xs={4}>
          <span style={{fontSize: '20pt'}}>B</span>
          <span style={{fontSize: '11pt'}}>{secondSelectedDoor==='B' ? '(二回目の選択)' : firstSelectedDoor==='B' ? '(一回目の選択)' : ''}</span>
        </Grid>
        <Grid item xs={4}>
          <span style={{fontSize: '20pt'}}>C</span>
          <span style={{fontSize: '11pt'}}>{secondSelectedDoor==='C' ? '(二回目の選択)' : firstSelectedDoor==='C' ? '(一回目の選択)' : ''}</span>
        </Grid>
        <Grid item xs={4}>
          <DoorImg
            door='A'
            firstSelectedDoor={firstSelectedDoor}
            setFirstSelectedDoor={setFirstSelectedDoor}
            missingDoor={missingDoor}
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
        <Grid item xs={4}>
          <DoorImg
            door='B'
            firstSelectedDoor={firstSelectedDoor}
            setFirstSelectedDoor={setFirstSelectedDoor}
            missingDoor={missingDoor}
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
        <Grid item xs={4}>
          <DoorImg
            door='C'
            firstSelectedDoor={firstSelectedDoor}
            setFirstSelectedDoor={setFirstSelectedDoor}
            missingDoor={missingDoor}
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
      </Grid>
      <div style={{paddingTop: '20px'}}/>
      <Grid container maxWidth='100%' width='700px' alignItems='flex-end' justifyContent='flex-end' style={{textAlign: 'center'}}>
        <Grid item xs={2.4}>
          <Button style={{fontSize: '10pt', paddingLeft: '5px', paddingRight: '5px', paddingTop: '2px', paddingBottom: '2px'}} color={"inherit"} variant="outlined" startIcon={<CachedIcon />} onClick={()=>{
            setShowInitModal(true);
          }}>
            初期化
          </Button>
        </Grid>
        <Grid item xs={2.4}>
          <span style={{fontSize: '15pt'}}>当たり</span>
        </Grid>
        <Grid item xs={2.4}>
          <span style={{fontSize: '15pt'}}>はずれ</span>
        </Grid>
        <Grid item xs={2.4}>
          <span style={{fontSize: '15pt'}}>合計</span>
        </Grid>
        <Grid item xs={2.4}>
          <span style={{fontSize: '15pt'}}>勝率(%)</span>
        </Grid>
        <Grid item xs={2.4}>
          <span style={{fontSize: '15pt'}}>変更有</span>
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
          <span style={{fontSize: '15pt'}}>{changedBingoCount+changedMissCount>0 ? Math.floor(100*changedBingoCount/(changedBingoCount+changedMissCount)) : ''}</span>
        </Grid>
        <Grid item xs={2.4}>
          <span style={{fontSize: '15pt'}}>変更無</span>
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
          <span style={{fontSize: '15pt'}}>{notChangedBingoCount+notChangedMissCount>0 ? Math.floor(100*notChangedBingoCount/(notChangedBingoCount+notChangedMissCount)) : ''}</span>
        </Grid>
      </Grid>
      <AlertModal showAlertModal={showAlertModal} setShowAlertModal={setShowAlertModal} alertText={`${doors.filter(door=>door!==missingDoor).join(', ')}から選んでください`}/>
      <ResultModal showResultModal={showResultModal} setShowResultModal={setShowResultModal} finalResult={finalResult} init={init}/>
      <InitModal
        showInitModal={showInitModal}
        setShowInitModal={setShowInitModal}
        setNotChangedBingoCount={setNotChangedBingoCount}
        setChangedBingoCount={setChangedBingoCount}
        setNotChangedMissCount={setNotChangedMissCount}
        setChangedMissCount={setChangedMissCount}
      />
    </div>
  )
}

export default MontyHallProblem