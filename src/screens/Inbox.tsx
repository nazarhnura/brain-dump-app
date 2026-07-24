import type { Task } from '../types'

interface InboxProps {
  tasks: Task[]
}

export function Inbox({ tasks }: InboxProps) {
  return (
    <div className="screen list-screen">
      <h1 className="screen__title">Inbox</h1>
      {tasks.length === 0 ? (
        <p className="empty-state">Тут з'являться розпарсені задачі</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className="task-list__item">
              {task.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
