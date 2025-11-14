import api from "@/api/axiosInstance";

interface CreateWindowRequest {
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  program?: string;
}

interface CreateWindowResponse {
  windowId: number;
  title: string;
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  processId: number;
  programName: string;
}

export const openWindow = async (payload: CreateWindowRequest) => {
  const res = await api.post<CreateWindowResponse>("/windows/open", payload);
  return res.data;
};
