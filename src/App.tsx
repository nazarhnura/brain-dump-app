import { useState } from 'react'
import { BottomNav } from './components/BottomNav'
import { Capture } from './screens/Capture'
import { Inbox } from './screens/Inbox'
import { Today } from './screens/Today'
import { useLocalStorage } from './hooks/useLocalStorage'
import type { Screen, Task } from './types'

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('capture')
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', [])

  const toggleTask = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  const addInboxTask = (text: string) => {
    const task: Task = {
      id: crypto.randomUUID(),
      text,
      done: false,
      list: 'inbox',
      createdAt: Date.now(),
    }
    setTasks((prev) => [task, ...prev])
  }

  const editTask = (id: string, text: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, text } : t)))
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <div className="app">
      <main className="app__content">
        {activeScreen === 'capture' && <Capture onCapture={addInboxTask} />}
        {activeScreen === 'inbox' && (
          <Inbox
            tasks={tasks.filter((t) => t.list === 'inbox')}
            onEdit={editTask}
            onDelete={deleteTask}
          />
        )}
        {activeScreen === 'today' && (
          <Today tasks={tasks.filter((t) => t.list === 'today')} onToggle={toggleTask} />
        )}
      </main>
      <BottomNav active={activeScreen} onChange={setActiveScreen} />
    </div>
  )
}
