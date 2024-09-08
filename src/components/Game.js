import React, { useState } from 'react'
import Board from './Board'
import SettingsMenu from './SettingsMenu'
import '../styles/Game.css'

function Game() {
  const [settings, setSettings] = useState({
    forcedCapture: true,
    playerColor: 'white',
    moveSpeed: 500,
    darkMode: false
  })

  const [showSettings, setShowSettings] = useState(false)

  const handleSettingsChange = (setting, value) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [setting]: value
    }))
  }

  return (
    <div className={`game-container ${settings.darkMode ? 'dark-mode' : ''}`}>
      <header className="game-header">
        <h1>Jogo de Damas</h1>
        <button
          className="settings-button"
          onClick={() => setShowSettings(true)}
        >
          ⚙️ Configurações
        </button>
      </header>
      <main className="game-main">
        <Board
          forcedCapture={settings.forcedCapture}
          playerColor={settings.playerColor}
          moveSpeed={settings.moveSpeed}
        />
      </main>
      {showSettings && (
        <div className="modal">
          <div className="modal-content">
            <button
              className="close-button"
              onClick={() => setShowSettings(false)}
            >
              ×
            </button>
            <SettingsMenu
              settings={settings}
              onSettingsChange={handleSettingsChange}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default Game
