import React, { useState, useEffect } from 'react'

const Home = () => {
  useEffect(() => {
    document.title = '確率の検証アプリ';
  }, [])
  return (
    <div>Home</div>
  )
}

export default Home