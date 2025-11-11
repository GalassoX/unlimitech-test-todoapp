import { taskStore } from '../../stores/taskStore'

describe('stores/taskStore', () => {
  beforeEach(() => {
    taskStore.setTasks([])
    taskStore.setCurrentTask(null)
  })

  it('setTasks and getter', () => {
    const tasks = [
      { _id: '1', title: 'a', description: '', status: false, userId: 'u', createdAt: '', updatedAt: '' },
      { _id: '2', title: 'b', description: '', status: true, userId: 'u', createdAt: '', updatedAt: '' },
    ]
    taskStore.setTasks(tasks)
    expect(taskStore.tasks.length).toBe(2)
    expect(taskStore.taskPendingCount).toBe(1)
  })

  it('setCurrentTask and getter', () => {
    const t = { _id: '1', title: 'a', description: '', status: false, userId: 'u', createdAt: '', updatedAt: '' }
    taskStore.setCurrentTask(t)
    expect(taskStore.currentTask).toEqual(t)
    taskStore.setCurrentTask(null)
    expect(taskStore.currentTask).toBeNull()
  })
})
