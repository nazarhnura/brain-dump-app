import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

export function Capture() {
  const [draft, setDraft] = useLocalStorage('capture-draft', '')
  const [isRecording, setIsRecording] = useState(false)

  return (
    <div className="screen capture-screen">
      <textarea
        className="capture-screen__input"
        placeholder="Що в голові?"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        autoFocus
      />
      <button
        type="button"
        className={`mic-button ${isRecording ? 'mic-button--active' : ''}`}
        onClick={() => setIsRecording((v) => !v)}
        aria-pressed={isRecording}
        aria-label="Диктувати"
      >
        🎤
      </button>
    </div>
  )
}
