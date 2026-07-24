import type { Task } from '../types'

interface TodayProps {
  tasks: Task[]
  onToggle: (id: string) => void
}

export function Today({ tasks, onToggle }: TodayProps) {
  return (
    <div className="screen list-screen">
      <h1 className="screen__title">Today</h1>
      {tasks.length === 0 ? (
        <p className="empty-state">На сьогодні поки немає задач</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className="task-list__item task-list__item--checkable">
              <label className="checkbox">
                <input type="checkbox" checked={task.done} onChange={() => onToggle(task.id)} />
                <span className={task.done ? 'task-list__text task-list__text--done' : 'task-list__text'}>
                  {task.text}
                </span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
