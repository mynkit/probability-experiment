import React, { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import CachedIcon from '@mui/icons-material/Cached';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PlayDisabledIcon from '@mui/icons-material/PlayDisabled';
import { shuffle, range, arrayPlus } from '../utils/arrayFunc';

const Lottery = () => {
  const [personCount, setPersonCount] = useState(5);
  const [persons, setPersons] = useState<number[]>(range(1, personCount+1));
  const [kujiCount, setKujiCount] = useState(8);
  const [atariCount, setAtariCount] = useState(2);
  const [currentPersonNum, setCurrentPersonNum] = useState(1);
  const [kujiRemains, setKujiRemains] = useState<(1|0)[]>([]);
  const [kujiResults, setKujiResults] = useState<(1|0)[]>([]);
  const [atariSummary, setAtariSummary] = useState<number[]>(new Array<number>(personCount).fill(0));
  const [summaryCount, setSummaryCount] = useState<number[]>(new Array<number>(personCount).fill(0));
  const [autoMode, setAutoMode] = useState(false);
  const [timeId, setTimeId] = useState<NodeJS.Timer|null>(null);
  const [hiddenCommandCount, setHiddenCommandCount] = useState(0);
  const [hiddenButton, setHiddenButton] = useState(false);
  const [clickInterval, setClickInterval] = useState(100); // 単位はミリ秒
  const [bakusokuMode, setBakusokuMode] = useState(false);

  const init = () => {
    setCurrentPersonNum(1);
    let atari = new Array<0|1>(atariCount).fill(1);
    let hazure = new Array<0|1>(kujiCount - atariCount).fill(0);
    let kuji = atari.concat(hazure);
    setKujiRemains(kuji);
    setKujiResults([]);
  }

  const kujibikiClick = () => {
    if (currentPersonNum===personCount+1) {
      init();
      return;
    }
    let kujiRemains_ = kujiRemains.slice();
    let kujiResults_ = kujiResults.slice();
    kujiRemains_ = shuffle(kujiRemains_);
    kujiResults_.push(kujiRemains_[0]);
    kujiRemains_ = kujiRemains_.slice(1, kujiRemains_.length);
    setKujiRemains(kujiRemains_);
    setKujiResults(kujiResults_);
    setCurrentPersonNum(v=>v+1);
    if (currentPersonNum===personCount) {
      setAtariSummary(arrayPlus(atariSummary, kujiResults_));
      setSummaryCount(arrayPlus(summaryCount, new Array<number>(personCount).fill(1)));
    }
  }

  const initResult = () => {
    setAtariSummary(new Array<number>(personCount).fill(0));
    setSummaryCount(new Array<number>(personCount).fill(0));
  }

  useEffect(() => {
    document.title = 'くじ引きの確率';
  }, [])

  useEffect(() => {
    setPersons(range(1, personCount+1));
    initResult();
    init();
  }, [personCount])

  useEffect(() => {
    initResult();
  }, [kujiCount, atariCount])

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
    if (autoMode) {
      let timerId_ = setInterval(()=>{
        if (document.getElementById(`kuji`)) {
          (document.getElementById(`kuji`) as HTMLElement).click();
        }
      }, clickInterval);
      setTimeId(timerId_)
    } else {
      if (timeId!==null) clearInterval(timeId);
    }
  }, [autoMode])

  return (
    <div style={{padding: '10px', width: '700px', maxWidth: '100%'}}>
      <h1 onClick={()=>setHiddenCommandCount(v=>v+1)} style={{backgroundColor: `rgb(${0},${0},${0},${Math.min(hiddenCommandCount/100., 0.1)})`, width: '100vw'}}>くじ引きの確率</h1>
      {hiddenButton ? (
        <Button style={{zIndex: 100}} color={autoMode ? "primary" : "inherit"} variant="outlined" startIcon={autoMode ? <PlayDisabledIcon/> : <PlayArrowIcon />} onClick={()=>{setAutoMode(v=>!v)}} disabled={false} size="medium">
          {autoMode ? '実行停止' : `自動実行${bakusokuMode ? '(爆速)' : ''}`}
        </Button>
      ): <></>}
      <div>
        <span style={{paddingRight: '10px'}}>{`参加人数：${personCount}人`}</span>
        <Button color='inherit' variant="outlined" onClick={()=>{
          if (personCount>=3)setPersonCount(v=>v-1);
          init();
        }}>
          <RemoveIcon />
        </Button>
        <Button color='inherit' variant="outlined" onClick={()=>{
          if (kujiCount>personCount && personCount<11)setPersonCount(v=>v+1);
          init();
        }}>
          <AddIcon />
        </Button>
      </div>
      <div>
        <span style={{paddingRight: '10px'}}>{`くじ本数：${kujiCount}個`}</span>
        <Button color='inherit' variant="outlined" onClick={()=>{
          if (kujiCount>=2 && atariCount<kujiCount-1 && kujiCount>personCount)setKujiCount(v=>v-1);
          init();
        }}>
          <RemoveIcon />
        </Button>
        <Button color='inherit' variant="outlined" onClick={()=>{
          setKujiCount(v=>v+1);
          init();
        }}>
          <AddIcon />
        </Button>
      </div>
      <div>
        <span style={{paddingRight: '10px'}}>{`当たり数：${atariCount}個`}</span>
        <Button color='inherit' variant="outlined" onClick={()=>{
          if (atariCount>=2)setAtariCount(v=>v-1);
          init();
        }}>
          <RemoveIcon />
        </Button>
        <Button color='inherit' variant="outlined" onClick={()=>{
          if (atariCount<kujiCount-1)setAtariCount(v=>v+1);
          init();
        }}>
          <AddIcon />
        </Button>
      </div>
      <div style={{paddingTop: '20px'}}/>
      <Grid container alignItems='center' justifyContent='center' style={{position: 'relative'}}>
        <img id='kuji' src='/lotteries/kujibiki_box.png' width='50%' style={{cursor: 'pointer'}} onClick={()=>{kujibikiClick()}}/>
        {currentPersonNum===personCount+1 ? (
          <p style={{
            position: 'absolute',
            top: '50%', left: '50%',
            msTransform: 'translate(-50%,-50%)', WebkitTransform: 'translate(-50%,-50%)', transform: 'translate(-50%,-50%)',
            margin: '0', padding: '0',
            fontSize: '100pt', color: 'black',
            cursor: 'pointer'
          }} onClick={()=>{init();}}>
            再
          </p>
        ) : <></>}
        
      </Grid>
      <div style={{padding: '5px'}}/>
      <Grid container maxWidth='100%' width='1000px' alignItems='flex-start' justifyContent='center' style={{textAlign: 'center'}}>
        {persons.map((person) => {
          return (
            <Grid key={person} item xs={persons.length <= 12 ? (12. / persons.length) : persons.length > 24 ? 0.9 : 1} style={{position: 'relative', minHeight: '250px'}}>
              <div style={{
                fontSize: '20pt',
              }}>{person}</div>
              {currentPersonNum>person ? (
                <>
                <img
                  src='/lotteries/document_paper_mekure.png'
                  width='100%'
                  style={{
                    position: 'absolute',top: '50%', left: '50%',
                    msTransform: 'translate(-50%,-50%)', WebkitTransform: 'translate(-50%,-50%)', transform: 'translate(-50%,-50%)',
                    margin: '0', padding: '0',
                    maxHeight: '200px'
                  }}
                />
                {
                  currentPersonNum===personCount+1 ? (
                    <p style={{
                      position: 'absolute',
                      top: '50%', left: '50%',
                      msTransform: 'translate(-50%,-50%)', WebkitTransform: 'translate(-50%,-50%)', transform: 'translate(-50%,-50%)',
                      margin: '0', padding: '0',
                      fontSize: '40pt', color: 'red',
                      cursor: 'pointer'
                    }} onClick={()=>{init();}}>
                      {kujiResults[person-1]===1 ? '○' : '×'}
                    </p>
                  ) : (
                    <></>
                  )
                }
                </>
              ) : <></>}
            </Grid>
          );
        })}
      </Grid>
      <div style={{paddingTop: '20px'}}/>
      <Grid container maxWidth='100%' width='700px' alignItems='flex-end' justifyContent='flex-end' style={{textAlign: 'center'}}>
        <Grid container>
          <Grid item xs={2.4}>
            <Button style={{fontSize: '10pt', paddingLeft: '5px', paddingRight: '5px', paddingTop: '2px', paddingBottom: '2px'}} color={"inherit"} variant="outlined" startIcon={<CachedIcon />} onClick={()=>{
              initResult();
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
        </Grid>
        {persons.map((person) => {
          return (
            <Grid container key={person} style={{padding: '5px'}}>
              <Grid item xs={2.4}>
                <span style={{fontSize: '15pt'}}>{person}</span>
              </Grid>
              <Grid item xs={2.4}>
                <span style={{fontSize: '15pt'}}>{atariSummary[person-1]}</span>
              </Grid>
              <Grid item xs={2.4}>
                <span style={{fontSize: '15pt'}}>{summaryCount[person-1]-atariSummary[person-1]}</span>
              </Grid>
              <Grid item xs={2.4}>
                <span style={{fontSize: '15pt'}}>{summaryCount[person-1]}</span>
              </Grid>
              <Grid item xs={2.4}>
                <span style={{fontSize: '15pt'}}>{summaryCount[person-1]>0 ? Math.floor(100*100*atariSummary[person-1]/(summaryCount[person-1]))/100 : ''}</span>
              </Grid>
            </Grid>
          )
        })}
      </Grid>
    </div>
  )
}

export default Lottery
