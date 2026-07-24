export type TaskList = 'inbox' | 'today'

export interface Task {
  id: string
  text: string
  done: boolean
  list: TaskList
  createdAt: number
}

export type Screen = 'capture' | 'inbox' | 'today'
