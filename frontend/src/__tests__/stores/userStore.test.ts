import { userStore } from '../../stores/userStore'

describe('stores/userStore', () => {
  beforeEach(() => {
    // Ensure a clean value for tests
    userStore.setUser({ _id: '', username: '', createdAt: '', updatedAt: '' })
  })

  it('setUser and getter', () => {
    const user = { _id: 'u1', username: 'alice', createdAt: '', updatedAt: '' }
    userStore.setUser(user)
    expect(userStore.user).toEqual(user)
  })
})
