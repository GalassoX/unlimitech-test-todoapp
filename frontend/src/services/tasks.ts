import axios from 'axios';

export async function getTasks(): Promise<Task[]> {
  try {
    const response = await axios.get<APIResponse<Task[]>>(`${import.meta.env.VITE_API_URL}/api/v1/tasks`, { 
      withCredentials: true
    });
    return response.data.data;
  } catch (error) {
    return [];
  }
}

type CreateTaskParams = {
  title: string;
  description?: string;
  status?: boolean;
}

export async function createTask(params: CreateTaskParams): Promise<Task | null> {
  try {
    const response = await axios.post<APIResponse<Task>>(`${import.meta.env.VITE_API_URL}/api/v1/tasks`, { ...params }, { 
      withCredentials: true
    });
    return response.data.data;
  } catch (error) {
    return null;
  }
}

type UpdateTaskParams = {
  title?: string;
  description?: string;
  status?: boolean;
}

export async function updateTask(taskId: string, newData: UpdateTaskParams): Promise<Task | null> {
  try {
    const response = await axios.put<APIResponse<Task>>(`${import.meta.env.VITE_API_URL}/api/v1/tasks/${taskId}`, {
      ...newData
    }, { withCredentials: true });
    return response.data.data;
  } catch (error) {
    return null;
  }
}