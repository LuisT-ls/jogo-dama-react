import React, { useState, useEffect } from 'react'
import Square from './Square'
import Scoreboard from './Scoreboard'
import '../styles/Board.css'

function Board({ forcedCapture, playerColor, moveSpeed }) {
  const [board, setBoard] = useState(
    Array(8)
      .fill()
      .map(() => Array(8).fill(null))
  )
  const [selectedPiece, setSelectedPiece] = useState(null)
  const [currentPlayer, setCurrentPlayer] = useState('white')
  const [animatingPiece, setAnimatingPiece] = useState(null)
  const [score, setScore] = useState({ black: 0, white: 0 })
  const [capturingPiece, setCapturingPiece] = useState(null)

  useEffect(() => {
    initializeBoard()
  }, [playerColor])

  const initializeBoard = () => {
    const newBoard = Array(8)
      .fill()
      .map(() => Array(8).fill(null))
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if ((row + col) % 2 === 1) {
          if (row < 3) {
            newBoard[row][col] = { color: 'black', isKing: false }
          } else if (row > 4) {
            newBoard[row][col] = { color: 'white', isKing: false }
          }
        }
      }
    }
    setBoard(newBoard)
    setCurrentPlayer('white')
  }

  const handleSquareClick = (row, col) => {
    if (capturingPiece) {
      if (capturingPiece.row === row && capturingPiece.col === col) {
        // Fim do turno de captura múltipla
        setCapturingPiece(null)
        setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white')
      } else if (
        isValidCapture(capturingPiece.row, capturingPiece.col, row, col)
      ) {
        movePiece(row, col, true)
      }
    } else if (selectedPiece) {
      movePiece(row, col)
    } else if (board[row][col] && board[row][col].color === currentPlayer) {
      setSelectedPiece({ row, col })
    }
  }

  const movePiece = (toRow, toCol, isContinuedCapture = false) => {
    const fromRow = isContinuedCapture ? capturingPiece.row : selectedPiece.row
    const fromCol = isContinuedCapture ? capturingPiece.col : selectedPiece.col

    if (isValidMove(fromRow, fromCol, toRow, toCol)) {
      const newBoard = [...board.map(row => [...row])]
      const movingPiece = { ...newBoard[fromRow][fromCol] }
      newBoard[fromRow][fromCol] = null

      setAnimatingPiece({
        piece: movingPiece,
        from: { row: fromRow, col: fromCol },
        to: { row: toRow, col: toCol }
      })

      let capturedPiece = false
      if (Math.abs(toRow - fromRow) === 2) {
        const jumpedRow = (fromRow + toRow) / 2
        const jumpedCol = (fromCol + toCol) / 2
        if (newBoard[jumpedRow][jumpedCol]) {
          capturedPiece = true
          newBoard[jumpedRow][jumpedCol] = null
          setScore(prevScore => ({
            ...prevScore,
            [currentPlayer]: prevScore[currentPlayer] + 1
          }))
        }
      }

      // King promotion logic (inverted)
      if (
        (currentPlayer === 'white' && toRow === 0) ||
        (currentPlayer === 'black' && toRow === 7)
      ) {
        movingPiece.isKing = true
      }

      setTimeout(() => {
        newBoard[toRow][toCol] = movingPiece
        setBoard(newBoard)
        setSelectedPiece(null)
        setAnimatingPiece(null)

        if (capturedPiece && hasMoreCaptures(newBoard, toRow, toCol)) {
          if (forcedCapture) {
            setCapturingPiece({ row: toRow, col: toCol })
          } else {
            setCapturingPiece(null)
            setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white')
          }
        } else {
          setCapturingPiece(null)
          setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white')

          if (
            isGameOver(newBoard, currentPlayer === 'white' ? 'black' : 'white')
          ) {
            alert(
              `Game Over! ${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)} wins!`
            )
          }
        }
      }, moveSpeed)
    } else {
      setSelectedPiece(null)
    }
  }

  const isValidMove = (fromRow, fromCol, toRow, toCol) => {
    const piece = board[fromRow][fromCol]
    if (!piece) return false

    const rowDiff = toRow - fromRow
    const colDiff = Math.abs(toCol - fromCol)

    if (board[toRow][toCol] !== null) return false

    if (capturingPiece) {
      return (
        colDiff === 2 &&
        Math.abs(rowDiff) === 2 &&
        isValidCapture(fromRow, fromCol, toRow, toCol)
      )
    }

    if (!piece.isKing) {
      if (piece.color === 'white' && rowDiff >= 0) return false
      if (piece.color === 'black' && rowDiff <= 0) return false
    }

    if (colDiff === 1 && Math.abs(rowDiff) === 1) return true

    if (colDiff === 2 && Math.abs(rowDiff) === 2) {
      return isValidCapture(fromRow, fromCol, toRow, toCol)
    }

    return false
  }

  const isValidCapture = (fromRow, fromCol, toRow, toCol) => {
    if (
      fromRow < 0 ||
      fromRow >= 8 ||
      fromCol < 0 ||
      fromCol >= 8 ||
      toRow < 0 ||
      toRow >= 8 ||
      toCol < 0 ||
      toCol >= 8
    ) {
      return false
    }

    const jumpedRow = (fromRow + toRow) / 2
    const jumpedCol = (fromCol + toCol) / 2

    if (jumpedRow < 0 || jumpedRow >= 8 || jumpedCol < 0 || jumpedCol >= 8) {
      return false
    }

    const jumpedPiece = board[jumpedRow][jumpedCol]
    const fromPiece = board[fromRow][fromCol]

    if (!fromPiece || !jumpedPiece) {
      return false
    }

    return jumpedPiece.color !== fromPiece.color
  }

  const hasMoreCaptures = (board, row, col) => {
    const piece = board[row][col]
    if (!piece) return false

    const directions = piece.isKing
      ? [-1, 1]
      : [piece.color === 'black' ? 1 : -1]

    for (let rowDir of directions) {
      for (let colDir of [-1, 1]) {
        const newRow = row + 2 * rowDir
        const newCol = col + 2 * colDir
        if (isValidCapture(row, col, newRow, newCol)) {
          return true
        }
      }
    }
    return false
  }

  const isGameOver = (board, player) => {
    // Check if the current player has any valid moves left
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (board[row][col] && board[row][col].color === player) {
          if (hasValidMove(board, row, col)) {
            return false
          }
        }
      }
    }
    return true
  }

  const hasValidMove = (board, row, col) => {
    const directions = board[row][col].isKing
      ? [-1, 1]
      : [board[row][col].color === 'black' ? 1 : -1]
    for (let rowDir of directions) {
      for (let colDir of [-1, 1]) {
        if (isValidMove(row, col, row + rowDir, col + colDir)) {
          return true
        }
        if (isValidMove(row, col, row + 2 * rowDir, col + 2 * colDir)) {
          return true
        }
      }
    }
    return false
  }

  return (
    <div className="board-container">
      <Scoreboard score={score} currentPlayer={currentPlayer} />
      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {row.map((piece, colIndex) => (
              <Square
                key={`${rowIndex}-${colIndex}`}
                isBlack={(rowIndex + colIndex) % 2 === 1}
                piece={piece}
                isSelected={
                  selectedPiece &&
                  selectedPiece.row === rowIndex &&
                  selectedPiece.col === colIndex
                }
                isCapturing={
                  capturingPiece &&
                  capturingPiece.row === rowIndex &&
                  capturingPiece.col === colIndex
                }
                onClick={() => handleSquareClick(rowIndex, colIndex)}
              />
            ))}
          </div>
        ))}
        {animatingPiece && (
          <div
            className={`animating-piece ${animatingPiece.piece.color}-piece${animatingPiece.piece.isKing ? ' king' : ''}`}
            style={{
              '--start-row': animatingPiece.from.row,
              '--start-col': animatingPiece.from.col,
              '--end-row': animatingPiece.to.row,
              '--end-col': animatingPiece.to.col
            }}
          >
            {animatingPiece.piece.isKing && <div className="crown">♛</div>}
          </div>
        )}
      </div>
    </div>
  )
}

export default Board
