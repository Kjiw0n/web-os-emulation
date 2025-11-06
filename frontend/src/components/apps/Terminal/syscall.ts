import api from "@/api/axiosInstance";

interface SyscallRequest {
  command: string;
  data?: string;
}

interface SyscallResponse {
  stdout: string;
  stderr?: string;
}

export const requestSyscall = async (payload: SyscallRequest) => {
  const res = await api.post<SyscallResponse>("/syscall", payload);
  return res.data;
};
