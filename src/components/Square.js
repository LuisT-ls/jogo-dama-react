import React from 'react'
import '../styles/Square.css'
import Piece from './Piece'

function Square({ isBlack, piece, isSelected, isCapturing, onClick }) {
  const squareClass = isBlack ? 'black-square' : 'white-square'
  const selectedClass = isSelected ? 'selected' : ''
  const capturingClass = isCapturing ? 'capturing' : ''

  return (
    <div
      className={`square ${squareClass} ${selectedClass} ${capturingClass}`}
      onClick={onClick}
    >
      {piece && (
        <Piece isBlack={piece.color === 'black'} isKing={piece.isKing} />
      )}
    </div>
  )
}

export default Square
