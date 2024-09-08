import React from 'react'
import '../styles/Piece.css'

function Piece({ isBlack, isKing }) {
  const pieceClass = isBlack ? 'black-piece' : 'white-piece'
  const kingClass = isKing ? 'king' : ''

  return (
    <div className={`piece ${pieceClass} ${kingClass}`}>
      {isKing && <div className="crown">♛</div>}
    </div>
  )
}

export default Piece
