// src/interfaces/index.ts
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface JwtPayload {
  userId: string;
  name: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export { User, JwtPayload, ApiResponse };
