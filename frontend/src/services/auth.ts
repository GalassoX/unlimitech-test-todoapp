import axios from 'axios';

interface AuthParams {
  username: string;
  password: string;
}

export async function login(params: AuthParams): Promise<void> {
  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/auth/login`, { ...params }, {
      withCredentials: true
    });
  } catch (error) {
    if (error instanceof axios.AxiosError) {
      if (error.status && error.status === 400) {
        throw new Error('Usuario o contraseña inválidos.');
      }
    }
    throw new Error('Ocurrió un error, intentelo más tarde.');
  }
}

export async function signup(params: AuthParams): Promise<void> {
  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/auth/signup`, { ...params }, {
      withCredentials: true
    });
  } catch (error) {
    if (error instanceof axios.AxiosError) {
      if (error.status && error.status === 400) {
        throw new Error('No puedes usar este usuario ya que esta en uso.');
      }
    }
    throw new Error('Ocurrió un error, intentelo más tarde.');
  }
}

export async function logout(): Promise<boolean> {
  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/auth/logout`, {}, {
      withCredentials: true
    });
    return true;
  } catch (error) {
    return false; 
  }
}