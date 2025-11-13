import api from "@/api/axiosInstance";

interface SyscallRequest {
  command: string;
  data?: string;
}

interface SyscallResponse {
  stdout: string;
  stderr?: string;
  cwd?: string;
}

export const requestSyscall = async (payload: SyscallRequest) => {
  const res = await api.post<SyscallResponse>("/syscall", {
    processId: 1,
    ...payload,
  });
  return res.data;
};
