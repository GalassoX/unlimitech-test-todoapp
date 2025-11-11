interface APIResponse<T> {
  message: string;
  data: T;
  error?: {
    code: number;
    message: string;
  }
}

interface Task {
  _id: string;
  title: string;
  description: string;
  status: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  _id: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}