import React, { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const Lottery = () => {
  const [personCount, setPersonCount] = useState(5);
  const [kujiCount, setKujiCount] = useState(8);
  const [atariCount, setAtariCount] = useState(3);
  const [currentPersonNum, setCurrentPersonNum] = useState(1);

  const init = () => {
    
  }

  return (
    <div style={{padding: '10px', width: '700px', maxWidth: '100%'}}>
      <h1>くじ引きの確率</h1>
      <div>
        <span style={{paddingRight: '10px'}}>{`参加人数：${personCount}人`}</span>
        <Button color='inherit' variant="outlined" startIcon={<RemoveIcon />} onClick={()=>{
          if (personCount>=3)setPersonCount(v=>v-1);
        }}>
          参加人数-1
        </Button>
        <Button color='inherit' variant="outlined" startIcon={<AddIcon />} onClick={()=>{
          setPersonCount(v=>v+1);
        }}>
          参加人数+1
        </Button>
      </div>
      <div>
        <span style={{paddingRight: '10px'}}>{`くじ本数：${kujiCount}個`}</span>
        <Button color='inherit' variant="outlined" startIcon={<RemoveIcon />} onClick={()=>{
          if (kujiCount>=2 && atariCount<kujiCount-1)setKujiCount(v=>v-1);
        }}>
          くじ本数-1
        </Button>
        <Button color='inherit' variant="outlined" startIcon={<AddIcon />} onClick={()=>{
          setKujiCount(v=>v+1);
        }}>
          くじ本数+1
        </Button>
      </div>
      <div>
        <span style={{paddingRight: '10px'}}>{`当たり数：${atariCount}個`}</span>
        <Button color='inherit' variant="outlined" startIcon={<RemoveIcon />} onClick={()=>{
          if (atariCount>=2)setAtariCount(v=>v-1);
        }}>
          当たり数-1
        </Button>
        <Button color='inherit' variant="outlined" startIcon={<AddIcon />} onClick={()=>{
          if (atariCount<kujiCount-1)setAtariCount(v=>v+1);
        }}>
          当たり数+1
        </Button>
      </div>
      <Grid container alignItems='center' justifyContent='center'>
        <img src='/lotteries/kujibiki_box.png' width='50%'/>
      </Grid>
    </div>
  )
}

export default Lottery
