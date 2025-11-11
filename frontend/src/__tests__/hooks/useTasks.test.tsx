import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { useTasks } from '../../hooks/useTasks'
import * as tasksService from '../../services/tasks'
import { taskStore } from '../../stores/taskStore'

vi.mock('../../services/tasks')

function TestComponent() {
  const { tasks, isGettingTasks } = useTasks()
  return (
    <div>
      <div data-testid="loading">{String(isGettingTasks)}</div>
      <div data-testid="tasks">{JSON.stringify(tasks)}</div>
    </div>
  )
}

describe('hooks/useTasks', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    taskStore.setTasks([])
  })

  it('fetches tasks and updates store', async () => {
    const tasks = [{ _id: '1', title: 't', description: '', status: false, userId: 'u', createdAt: '', updatedAt: '' }]
    ;(tasksService.getTasks as any).mockResolvedValueOnce(tasks)

    render(<TestComponent />)

    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'))
    expect(taskStore.tasks).toEqual(tasks)
    expect(screen.getByTestId('tasks').textContent).toContain('t')
  })
})
