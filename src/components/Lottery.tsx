import React, { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { shuffle, range } from '../utils/arrayFunc';

const Lottery = () => {
  const [personCount, setPersonCount] = useState(5);
  const [persons, setPersons] = useState<number[]>(range(1, personCount+1));
  const [kujiCount, setKujiCount] = useState(8);
  const [atariCount, setAtariCount] = useState(2);
  const [currentPersonNum, setCurrentPersonNum] = useState(1);
  const [kujiRemains, setKujiRemains] = useState<(1|0)[]>([]);
  const [kujiResults, setKujiResults] = useState<(1|0)[]>([]);

  const init = () => {
    setCurrentPersonNum(1);
    let atari = new Array<0|1>(atariCount).fill(1);
    let hazure = new Array<0|1>(kujiCount - atariCount).fill(0);
    let kuji = atari.concat(hazure)
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
  }

  useEffect(() => {
    console.log(`kujiRemains: ${kujiRemains}`);
    console.log(`kujiResults: ${kujiResults}`);
  }, [kujiRemains, kujiResults])

  useEffect(() => {
    setPersons(range(1, personCount+1));
    init();
  }, [personCount])

  return (
    <div style={{padding: '10px', width: '700px', maxWidth: '100%'}}>
      <h1>くじ引きの確率</h1>
      <div>
        <span style={{paddingRight: '10px'}}>{`参加人数：${personCount}人`}</span>
        <Button color='inherit' variant="outlined" startIcon={<RemoveIcon />} onClick={()=>{
          if (personCount>=3)setPersonCount(v=>v-1);
          init();
        }}>
          参加人数-1
        </Button>
        <Button color='inherit' variant="outlined" startIcon={<AddIcon />} onClick={()=>{
          setPersonCount(v=>v+1);
          init();
        }}>
          参加人数+1
        </Button>
      </div>
      <div>
        <span style={{paddingRight: '10px'}}>{`くじ本数：${kujiCount}個`}</span>
        <Button color='inherit' variant="outlined" startIcon={<RemoveIcon />} onClick={()=>{
          if (kujiCount>=2 && atariCount<kujiCount-1)setKujiCount(v=>v-1);
          init();
        }}>
          くじ本数-1
        </Button>
        <Button color='inherit' variant="outlined" startIcon={<AddIcon />} onClick={()=>{
          setKujiCount(v=>v+1);
          init();
        }}>
          くじ本数+1
        </Button>
      </div>
      <div>
        <span style={{paddingRight: '10px'}}>{`当たり数：${atariCount}個`}</span>
        <Button color='inherit' variant="outlined" startIcon={<RemoveIcon />} onClick={()=>{
          if (atariCount>=2)setAtariCount(v=>v-1);
          init();
        }}>
          当たり数-1
        </Button>
        <Button color='inherit' variant="outlined" startIcon={<AddIcon />} onClick={()=>{
          if (atariCount<kujiCount-1)setAtariCount(v=>v+1);
          init();
        }}>
          当たり数+1
        </Button>
      </div>
      <div style={{paddingTop: '20px'}}/>
      <Grid container alignItems='center' justifyContent='center' style={{position: 'relative'}}>
        <img src='/lotteries/kujibiki_box.png' width='50%' style={{cursor: 'pointer'}} onClick={()=>{kujibikiClick()}}/>
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
      <Grid container maxWidth='100%' width='1000px' alignItems='flex-start' justifyContent='flex-start' style={{textAlign: 'center'}}>
        {persons.map((person) => {
          return (
            <Grid key={person} item xs={persons.length <= 12 ? (12. / persons.length) : persons.length > 24 ? 0.9 : 1}>
              <div style={{
                fontSize: '20pt',
              }}>{person}</div>
              {currentPersonNum>person ? (
                <img
                  src={
                    currentPersonNum===personCount+1 ? (
                      kujiResults[person-1]===1 ? '/doors/kuji_ken2_atari.png'
                      : '/doors/kuji_ken3_hazure.png'
                    ) : (
                      '/lotteries/document_paper_mekure.png'
                    )
                  }
                  width='100%'
                />
              ) : <></>}
            </Grid>
          );
        })}
      </Grid>
    </div>
  )
}

export default Lottery
