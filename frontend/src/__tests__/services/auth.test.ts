import axios from 'axios'
import { login, signup, logout } from '../../services/auth'

vi.mock('axios')

describe('services/auth', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('login - success resolves without error', async () => {
    ;(axios.post as any).mockResolvedValueOnce({})

    await expect(login({ username: 'u', password: 'p' })).resolves.toBeUndefined()
    expect(axios.post).toHaveBeenCalled()
  })

  it('login - failure throws generic error on axios rejection', async () => {
    ;(axios.post as any).mockRejectedValueOnce(new Error('network'))

    await expect(login({ username: 'u', password: 'p' })).rejects.toThrow(
      'Ocurrió un error, intentelo más tarde.'
    )
  })

  it('signup - success resolves', async () => {
    ;(axios.post as any).mockResolvedValueOnce({})

    await expect(signup({ username: 'u', password: 'p' })).resolves.toBeUndefined()
    expect(axios.post).toHaveBeenCalled()
  })

  it('logout - success returns true', async () => {
    ;(axios.post as any).mockResolvedValueOnce({})

    await expect(logout()).resolves.toBe(true)
  })

  it('logout - failure returns false', async () => {
    ;(axios.post as any).mockRejectedValueOnce(new Error('err'))

    await expect(logout()).resolves.toBe(false)
  })
})
