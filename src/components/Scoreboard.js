import React from 'react'
import '../styles/Scoreboard.css'

function Scoreboard({ score, currentPlayer }) {
  return (
    <div className="scoreboard">
      <div
        className={`player black ${currentPlayer === 'black' ? 'active' : ''}`}
      >
        <div className="player-name">Black</div>
        <div className="player-score">{score.black}</div>
      </div>
      <div
        className={`player white ${currentPlayer === 'white' ? 'active' : ''}`}
      >
        <div className="player-name">White</div>
        <div className="player-score">{score.white}</div>
      </div>
    </div>
  )
}

export default Scoreboard
