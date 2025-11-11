import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { useUser } from '../../hooks/useUser'
import * as userService from '../../services/user'
import { userStore } from '../../stores/userStore'

vi.mock('../../services/user')

function TestComponent() {
  const { user, isGettingUser } = useUser()
  return (
    <div>
      <div data-testid="loading">{String(isGettingUser)}</div>
      <div data-testid="user">{JSON.stringify(user)}</div>
    </div>
  )
}

describe('hooks/useUser', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    userStore.setUser({ _id: '', username: '', createdAt: '', updatedAt: '' })
  })

  it('fetches user and updates store', async () => {
    const user = { _id: 'u1', username: 'bob', createdAt: '', updatedAt: '' }
    ;(userService.getUser as any).mockResolvedValueOnce(user)

    render(<TestComponent />)

    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'))
    expect(userStore.user).toEqual(user)
    expect(screen.getByTestId('user').textContent).toContain('bob')
  })
})
