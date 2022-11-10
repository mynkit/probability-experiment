import React, { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid';
import { shuffle } from '../utils/arrayFunc';
import AlertModal from './AlertModal';
import ResultModal from './ResultModal';

type Door = 'A'|'B'|'C';

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
  const [imgSrcA, setImgSrcA] = useState<string>('');
  const [imgSrcB, setImgSrcB] = useState<string>('');
  const [imgSrcC, setImgSrcC] = useState<string>('');
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [changedBingoCount, setChangedBingoCount] = useState(0);
  const [changedMissCount, setChangedMissCount] = useState(0);
  const [notChangedBingoCount, setNotChangedBingoCount] = useState(0);
  const [notChangedMissCount, setNotChangedMissCount] = useState(0);

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
    setImgSrcA('');
    setImgSrcB('');
    setImgSrcC('');
    setShowAlertModal(false);
    setShowResultModal(false);
    setBingo(shuffle(['A', 'B', 'C'])[0]);
  }

  const getImgSrc = (door: Door) => {
    if (missingDoor===door || finalMissingDoor===door) {
      return '/doors/door_open.png';
    } else if (secondSelectedDoor!==null && bingo===door && bingo===secondSelectedDoor) {
      return 'doors/present_happy_boy.png';
    } else {
      return '/doors/door_close_resize.png';
    }
  }

  useEffect(() => {
    if (firstSelectedDoor!==null) {
      setMissingDoor(shuffle(doors.filter(door => door!==firstSelectedDoor && door!=bingo))[0]);
    }
  }, [firstSelectedDoor])

  useEffect(() => {
    setImgSrcA(getImgSrc('A'));
    setImgSrcB(getImgSrc('B'));
    setImgSrcC(getImgSrc('C'));

    if (missingDoor===null) {
      setAnnounce('A, B, Cの中から一つのドアを選んでください');
    } else if (finalResult===null) {
      setAnnounce(`実は${missingDoor}のドアはハズレです！残りの${doors.filter(door=>door!==missingDoor).join(', ')}から一つ選んでください。`);
    }
  }, [missingDoor, finalMissingDoor, secondSelectedDoor, finalResult])

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

  return (
    <div style={{padding: '10px'}}>
      <h1>モンティホール問題</h1>
      <div style={{fontSize: '17pt'}}>次の3つのドアのうち、一つが当たりのドアです。</div>
      <div style={{fontSize: '20pt', textDecoration: 'underline'}}>{announce}</div>
      <div style={{padding: '10px'}}/>
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
          <img src={imgSrcA} width='90%' style={{cursor: 'pointer'}} onClick={()=>{
            if (firstSelectedDoor===null) {
              setFirstSelectedDoor('A');
            } else {
              if (missingDoor==='A') {
                setShowAlertModal(true);
              } else if (bingo!=='A') {
                setFinalMissingDoor('A');
                setSecondSelectedDoor('A');
                setFinalResult(0);
                setShowResultModal(true);
              } else {
                // あたり
                setSecondSelectedDoor('A');
                setFinalResult(1);
                setShowResultModal(true);
              }
            }
          }}/>
        </Grid>
        <Grid item xs={4}>
          <img src={imgSrcB} width='90%' style={{cursor: 'pointer'}} onClick={()=>{
            if (firstSelectedDoor===null) {
              setFirstSelectedDoor('B');
            } else {
              if (missingDoor==='B') {
                setShowAlertModal(true);
              } else if (bingo!=='B') {
                setFinalMissingDoor('B');
                setSecondSelectedDoor('B');
                setFinalResult(0);
                setShowResultModal(true);
              } else {
                // あたり
                setSecondSelectedDoor('B');
                setFinalResult(1);
                setShowResultModal(true);
              }
            }
          }}/>
        </Grid>
        <Grid item xs={4}>
          <img src={imgSrcC} width='90%' style={{cursor: 'pointer'}} onClick={()=>{
            if (firstSelectedDoor===null) {
              setFirstSelectedDoor('C');
            } else {
              if (missingDoor==='C') {
                setShowAlertModal(true);
              } else if (bingo!=='C') {
                // はずれ
                setFinalMissingDoor('C');
                setSecondSelectedDoor('C');
                setFinalResult(0);
                setShowResultModal(true);
              } else {
                // あたり
                setSecondSelectedDoor('C');
                setFinalResult(1);
                setShowResultModal(true);
              }
            }
          }}/>
        </Grid>
      </Grid>
      <div style={{paddingTop: '20px'}}/>
      <Grid container maxWidth='100%' width='700px' alignItems='flex-end' justifyContent='flex-end' style={{textAlign: 'center'}}>
        <Grid item xs={2.4}>
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
    </div>
  )
}

export default MontyHallProblem