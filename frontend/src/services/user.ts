import axios from 'axios';

export async function getUser(): Promise<User | null> {
  try {
    const response = await axios.get<APIResponse<User>>(`${import.meta.env.VITE_API_URL}/api/v1/user`, { 
      withCredentials: true
    });
    return response.data.data;
  } catch (error) {
    return null;
  }
}