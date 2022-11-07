import React, { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid';
import { shuffle } from '../utils/arrayFunc';
import AlertModal from './AlertModal';
import ResultModal from './ ResultModal';

type Door = 'A'|'B'|'C';

const MontyHallProblem: React.FC = () => {
  const doors: Door[] = ['A', 'B', 'C'];
  const bingo: Door = shuffle(['A', 'B', 'C'])[0];
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
  }

  const getImgSrc = (door: Door) => {
    if (missingDoor===door || finalMissingDoor===door) {
      return '/doors/door_open.png';
    } else if (secondSelectedDoor!==null && bingo===door && bingo===secondSelectedDoor) {
      return 'doors/present_happy_boy.png';
    } else {
      return '/doors/door_close.png';
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

  return (
    <div style={{padding: '10px'}}>
      <h1>Monty Hall Problem</h1>
      <div style={{fontSize: '17pt'}}>次の3つのドアのうち、一つが当たりのドアです。</div>
      <div style={{fontSize: '20pt', textDecoration: 'underline'}}>{announce}</div>
      <div style={{padding: '10px'}}/>
      <Grid container maxWidth='100%' width='1000px' alignItems='flex-end' justifyContent='flex-end' style={{textAlign: 'center'}}>
        <Grid item xs={4}>
          <span style={{fontSize: '20pt'}}>{secondSelectedDoor==='A' ? 'A(二回目の選択)' : firstSelectedDoor==='A' ? 'A(一回目の選択)' : 'A'}</span>
        </Grid>
        <Grid item xs={4}>
          <span style={{fontSize: '20pt'}}>{secondSelectedDoor==='B' ? 'B(二回目の選択)' : firstSelectedDoor==='B' ? 'B(一回目の選択)' : 'B'}</span>
        </Grid>
        <Grid item xs={4}>
          <span style={{fontSize: '20pt'}}>{secondSelectedDoor==='C' ? 'C(二回目の選択)' : firstSelectedDoor==='C' ? 'C(一回目の選択)' : 'C'}</span>
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
      <AlertModal showAlertModal={showAlertModal} setShowAlertModal={setShowAlertModal} alertText={`${doors.filter(door=>door!==missingDoor).join(', ')}から選んでください`}/>
      <ResultModal showResultModal={showResultModal} setShowResultModal={setShowResultModal} finalResult={finalResult} init={init}/>
    </div>
  )
}

export default MontyHallProblem