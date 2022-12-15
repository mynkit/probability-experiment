import React, { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid';
import { useWindowDimensions } from '../utils/windowDimensions';
import Button from '@mui/material/Button';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PlayDisabledIcon from '@mui/icons-material/PlayDisabled';
import CachedIcon from '@mui/icons-material/Cached';

type XY = {
  x: number;
  y: number;
}

type Props = {
  top: number;
  left: number;
  width: number;
  color: string;
}

const Point: React.FC<Props> = ({ top, left, width, color }) => {
  return (
    <div style={{
      position: 'absolute',
      border: `1px solid ${color}`,
      borderRadius: '50%',
      width: width,
      height: width,
      backgroundColor: color,
      top: top,
      left: left,
    }}/>
  )
}

const MonteCarloPI: React.FC = () => {
  const { width } = useWindowDimensions();
  const [squareWidth, setSquareWidth] = useState(700);
  const [points, setPoints] = useState<XY[]>([]);
  const [inCircleCount, setInCircleCount] = useState(0);
  const [autoMode, setAutoMode] = useState(false);
  const [timeId, setTimeId] = useState<NodeJS.Timer|null>(null);
  const [hiddenCommandCount, setHiddenCommandCount] = useState(0);
  const [hiddenButton, setHiddenButton] = useState(false);
  const [clickInterval, setClickInterval] = useState(100); // 単位はミリ秒
  const [bakusokuMode, setBakusokuMode] = useState(false);

  const addPoint = () => {
    // 点をプロット
    let newXY: XY = {x: Math.random(), y: Math.random()};
    let currentPoints = points.slice();
    currentPoints.push(newXY);
    setPoints(currentPoints);
    let dis = Math.sqrt((newXY.x-0.5)**2 + (newXY.y-0.5)**2);
    if (dis <= 0.5) setInCircleCount(v=>v+1);
  }

  const initResult = () => {
    setPoints([]);
    setInCircleCount(0);
  }

  useEffect(() => {
    document.title = 'モンテカルロ法円周率';
  }, [])

  useEffect(() => {
    let client_w = (document.getElementById('square') as HTMLElement).clientWidth;
    setSquareWidth(client_w);
  }, [width])

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
        if (document.getElementById(`addpoint`)) {
          (document.getElementById(`addpoint`) as HTMLElement).click();
        }
      }, clickInterval);
      setTimeId(timerId_)
    } else {
      if (timeId!==null) clearInterval(timeId);
    }
  }, [autoMode])

  return (
    <div style={{padding: '10px'}}>
      <h1 onClick={()=>setHiddenCommandCount(v=>v+1)} style={{backgroundColor: `rgb(${0},${0},${0},${Math.min(hiddenCommandCount/100., 0.1)})`}}>円周率の近似</h1>
      <Grid container>
        {hiddenButton ? (
          <Button style={{zIndex: 100}} color={autoMode ? "primary" : "inherit"} variant="outlined" startIcon={autoMode ? <PlayDisabledIcon/> : <PlayArrowIcon />} onClick={()=>{setAutoMode(v=>!v)}} disabled={false} size="medium">
            {autoMode ? '実行停止' : `自動実行${bakusokuMode ? '(爆速)' : ''}`}
          </Button>
        ): <></>}
      </Grid>
      <div style={{paddingTop: '10px'}}/>
        <Button id='addpoint' style={{zIndex: 100}} color={"inherit"} variant="outlined" onClick={()=>{addPoint()}} disabled={false} size="medium">
          点を配置
        </Button>
      <div style={{paddingTop: '10px'}}/>
      <div id='square' style={{position: 'relative', border: '1px solid black', width: '700px', height: squareWidth, maxWidth: '100%', maxHeight: squareWidth}}>
        <div id='circle' style={{position: 'absolute', border: '1px solid black', borderRadius: '50%', width: '100%', height: '100%', top: -1, left: -1}}>
          {points.map((p, ind) => {
            return ind<points.length-1 ? (
              <Point key={ind} top={p.x*squareWidth - squareWidth/400} left={p.y*squareWidth - squareWidth/400} width={squareWidth/400} color='black'/>
            ) : (
              <Point key={ind} top={p.x*squareWidth - squareWidth/100} left={p.y*squareWidth - squareWidth/100} width={squareWidth/100} color='red'/>
            )
          })}
        </div>
      </div>
      <div style={{paddingTop: '15px'}}/>
      <Grid container maxWidth='100%' width='700px' alignItems='flex-end' justifyContent='flex-end' style={{textAlign: 'center'}}>
        <Grid item xs={3}>
          <Button style={{fontSize: '10pt', paddingLeft: '5px', paddingRight: '5px', paddingTop: '2px', paddingBottom: '2px'}} color={"inherit"} variant="outlined" startIcon={<CachedIcon />} onClick={()=>{
            initResult();
          }}>
            初期化
          </Button>
        </Grid>
        <Grid item xs={3}>
          <span style={{fontSize: '15pt'}}>円の中</span>
        </Grid>
        <Grid item xs={3}>
          <span style={{fontSize: '15pt'}}>点の数</span>
        </Grid>
        <Grid item xs={3}>
          <span style={{fontSize: '15pt'}}>割合</span>
        </Grid>
        <Grid item xs={3}>
          <span style={{fontSize: '15pt'}}></span>
        </Grid>
        <Grid item xs={3}>
          <span style={{fontSize: '15pt'}}>{inCircleCount}</span>
        </Grid>
        <Grid item xs={3}>
          <span style={{fontSize: '15pt'}}>{points.length}</span>
        </Grid>
        <Grid item xs={3}>
          <span style={{fontSize: '15pt'}}>{points.length>0 ? Math.floor(10000*(inCircleCount / points.length))/10000 : ''}</span>
        </Grid>
      </Grid>
      <div style={{paddingTop: '15px'}}/>
      <Grid container maxWidth='100%' width='700px' alignItems='center' justifyContent='flex-start' style={{textAlign: 'center'}}>
        <span style={{fontSize: '15pt', paddingRight: '10px'}}>{`割合×4: `}</span>
        <span style={{fontSize: '15pt', fontWeight: 'bold'}}>{`${points.length>0 ? 4*inCircleCount / points.length : ''}`}</span>
      </Grid>
    </div>
  )
}

export default MonteCarloPI