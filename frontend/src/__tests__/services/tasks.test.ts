import axios from 'axios'
import { getTasks, createTask, updateTask } from '../../services/tasks'

vi.mock('axios')

describe('services/tasks', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('getTasks - returns tasks array', async () => {
    const tasks = [{ _id: '1', title: 't', description: 'd', status: false, userId: 'u', createdAt: '', updatedAt: '' }]
    ;(axios.get as any).mockResolvedValueOnce({ data: { data: tasks } })

    await expect(getTasks()).resolves.toEqual(tasks)
    expect(axios.get).toHaveBeenCalled()
  })

  it('createTask - returns created task', async () => {
    const task = { _id: '1', title: 't', description: 'd', status: false, userId: 'u', createdAt: '', updatedAt: '' }
    ;(axios.post as any).mockResolvedValueOnce({ data: { data: task } })

    await expect(createTask({ title: 't' })).resolves.toEqual(task)
    expect(axios.post).toHaveBeenCalled()
  })

  it('updateTask - returns updated task', async () => {
    const task = { _id: '1', title: 't-upd', description: 'd', status: true, userId: 'u', createdAt: '', updatedAt: '' }
    ;(axios.put as any).mockResolvedValueOnce({ data: { data: task } })

    await expect(updateTask('1', { title: 't-upd' })).resolves.toEqual(task)
    expect(axios.put).toHaveBeenCalled()
  })
})
