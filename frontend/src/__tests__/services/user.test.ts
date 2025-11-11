import axios from 'axios'
import { getUser } from '../../services/user'

vi.mock('axios')

describe('services/user', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('getUser - returns user or null', async () => {
    const user = { _id: 'u1', username: 'bob', createdAt: '', updatedAt: '' }
    ;(axios.get as any).mockResolvedValueOnce({ data: { data: user } })

    await expect(getUser()).resolves.toEqual(user)
    expect(axios.get).toHaveBeenCalled()
  })

  it('getUser - returns null on error', async () => {
    ;(axios.get as any).mockRejectedValueOnce(new Error('err'))
    await expect(getUser()).resolves.toBeNull()
  })
})
