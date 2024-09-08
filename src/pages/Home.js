import React from 'react'
import Board from '../components/Board'
import '../styles/Home.css'

function Home() {
  return (
    <div className="home-container">
      <h1>Jogo de Damas</h1>
      <Board />
    </div>
  )
}

export default Home
