import { useState, type KeyboardEvent } from 'react'
import type { Task } from '../types'

interface InboxProps {
  tasks: Task[]
  onEdit: (id: string, text: string) => void
  onDelete: (id: string) => void
}

export function Inbox({ tasks, onEdit, onDelete }: InboxProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState('')

  const startEditing = (task: Task) => {
    setEditingId(task.id)
    setEditingText(task.text)
  }

  const commitEdit = () => {
    if (!editingId) return
    const text = editingText.trim()
    if (text) {
      onEdit(editingId, text)
    } else {
      onDelete(editingId)
    }
    setEditingId(null)
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      commitEdit()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      cancelEdit()
    }
  }

  return (
    <div className="screen list-screen">
      <h1 className="screen__title">Inbox</h1>
      {tasks.length === 0 ? (
        <p className="empty-state">Тут з'являться розпарсені задачі</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) =>
            editingId === task.id ? (
              <li key={task.id} className="task-list__item">
                <input
                  className="task-list__edit-input"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  onBlur={commitEdit}
                  onKeyDown={handleKeyDown}
                  autoFocus
                />
              </li>
            ) : (
              <li key={task.id} className="task-list__item task-list__item--row">
                <button
                  type="button"
                  className="task-list__edit-trigger"
                  onClick={() => startEditing(task)}
                >
                  {task.text}
                </button>
                <button
                  type="button"
                  className="task-list__delete"
                  onClick={() => onDelete(task.id)}
                  aria-label="Видалити задачу"
                >
                  ✕
                </button>
              </li>
            ),
          )}
        </ul>
      )}
    </div>
  )
}
