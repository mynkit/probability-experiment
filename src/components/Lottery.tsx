import React, { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid';

const Lottery = () => {
  const [personCount, setPersonCount] = useState(5);
  const [kujiCount, setKujiCount] = useState(8);
  const [atariCount, setAtariCount] = useState(3);
  const [currentPersonNum, setCurrentPersonNum] = useState(1);

  const init = () => {
    
  }

  return (
    <div style={{padding: '10px'}}>
      <h1>くじ引きの確率</h1>
      <div>
        <span>{`参加人数：${personCount}人`}</span>
      </div>
      <Grid container alignItems='center' justifyContent='center'>
        <img src='/lotteries/kujibiki_box.png' width='50%'/>
      </Grid>
    </div>
  )
}

export default Lottery
