import React, { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid';

const Lottery = () => {
  return (
    <div style={{padding: '10px'}}>
      <h1>くじ引きの確率</h1>
      <Grid container alignItems='center' justifyContent='center'>
        <img src='/lotteries/kujibiki_box.png' width='50%'/>
      </Grid>
    </div>
  )
}

export default Lottery
