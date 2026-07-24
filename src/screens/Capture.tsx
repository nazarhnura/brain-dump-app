import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

export function Capture() {
  const [draft, setDraft] = useLocalStorage('capture-draft', '')
  const [isRecording, setIsRecording] = useState(false)

  return (
    <div className="screen capture-screen">
      <span className="capture-screen__football" aria-hidden="true">
        ⚽
      </span>
      <textarea
        className="capture-screen__input"
        placeholder="Вітаю, я твій розумний планувальник. Давай робити світ кращим, які у тебе плани?"
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
