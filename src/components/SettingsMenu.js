import React from 'react'
import '../styles/SettingsMenu.css'

function SettingsMenu({ settings, onSettingsChange }) {
  return (
    <div className="settings-menu">
      <h2>Game Settings</h2>
      <div className="setting">
        <label>
          <input
            type="checkbox"
            checked={settings.forcedCapture}
            onChange={e => onSettingsChange('forcedCapture', e.target.checked)}
          />
          Forced Capture
        </label>
      </div>
      <div className="setting">
        <label>Player Color:</label>
        <select
          value={settings.playerColor}
          onChange={e => onSettingsChange('playerColor', e.target.value)}
        >
          <option value="black">Black</option>
          <option value="white">White</option>
        </select>
      </div>
      <div className="setting">
        <label>Move Speed:</label>
        <input
          type="range"
          min="100"
          max="1000"
          step="100"
          value={settings.moveSpeed}
          onChange={e =>
            onSettingsChange('moveSpeed', parseInt(e.target.value))
          }
        />
        <span>{settings.moveSpeed}ms</span>
      </div>
      <div className="setting">
        <label>
          <input
            type="checkbox"
            checked={settings.darkMode}
            onChange={e => onSettingsChange('darkMode', e.target.checked)}
          />
          Dark Mode
        </label>
      </div>
    </div>
  )
}

export default SettingsMenu
