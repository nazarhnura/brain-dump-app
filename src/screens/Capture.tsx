import { useEffect, useRef, useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { BouncingBall } from '../components/BouncingBall'

export function Capture() {
  const [draft, setDraft] = useLocalStorage('capture-draft', '')
  const [isRecording, setIsRecording] = useState(false)
  const [isSupported, setIsSupported] = useState(true)
  const [micError, setMicError] = useState('')
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    const SpeechRecognitionCtor =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognitionCtor) {
      setIsSupported(false)
      return
    }

    const recognition = new SpeechRecognitionCtor()
    recognition.lang = 'uk-UA'
    recognition.continuous = true
    recognition.interimResults = false

    recognition.onresult = (event: any) => {
      let transcript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
      }
      if (transcript.trim()) {
        setDraft((prev) => (prev ? `${prev} ${transcript}`.trim() : transcript.trim()))
      }
    }

    recognition.onerror = (event: any) => {
      setIsRecording(false)
      if (event.error === 'not-allowed' || event.error === 'permission-denied') {
        setMicError('Немає доступу до мікрофона — дозвольте його в налаштуваннях браузера')
      } else if (event.error !== 'no-speech' && event.error !== 'aborted') {
        setMicError('Не вдалося розпізнати мовлення, спробуйте ще раз')
      }
    }

    recognition.onend = () => {
      setIsRecording(false)
    }

    recognitionRef.current = recognition

    return () => {
      recognition.stop()
    }
  }, [setDraft])

  const toggleRecording = () => {
    const recognition = recognitionRef.current
    if (!recognition) return

    setMicError('')

    if (isRecording) {
      recognition.stop()
      setIsRecording(false)
      return
    }

    try {
      recognition.start()
      setIsRecording(true)
    } catch {
      setIsRecording(false)
    }
  }

  return (
    <div className="screen capture-screen">
      <BouncingBall className="capture-screen__football" size={36}>
        ⚽
      </BouncingBall>
      <h1 className="capture-screen__greeting">
        Вітаю, я твій розумний планувальник. Давай робити світ кращим, які у тебе плани?
      </h1>
      <textarea
        className="capture-screen__input"
        placeholder="Що в голові?"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        autoFocus
      />
      {!isSupported && (
        <p className="capture-screen__mic-hint">Диктовка не підтримується цим браузером</p>
      )}
      {isSupported && micError && <p className="capture-screen__mic-hint">{micError}</p>}
      {isSupported && isRecording && <p className="capture-screen__mic-hint">Слухаю…</p>}
      <button
        type="button"
        className={`mic-button ${isRecording ? 'mic-button--active' : ''}`}
        onClick={toggleRecording}
        disabled={!isSupported}
        aria-pressed={isRecording}
        aria-label={isRecording ? 'Зупинити диктовку' : 'Диктувати'}
      >
        🎤
      </button>
    </div>
  )
}
