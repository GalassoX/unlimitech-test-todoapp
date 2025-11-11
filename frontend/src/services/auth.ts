import axios from 'axios';

interface LoginParams {
  username: string;
  password: string;
}

export async function login(params: LoginParams): Promise<boolean> {
  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/auth/login`, { ...params }, {
      withCredentials: true
    });
    return true;    
  } catch (error) {
    return false; 
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