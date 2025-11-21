import api from "@/api/axiosInstance";

// 노트 생성 요청 타입
export interface CreateNoteRequest {
  name: string;
  content?: string;
}

// 노트 응답 타입
export interface Note {
  id: number;
  name: string;
  updatedAt?: string;
}

export const createNote = async (payload: CreateNoteRequest) => {
  const res = await api.post<Note>("/notes/create", payload);
  return res.data;
};

export const getNoteList = async (): Promise<Note[]> => {
  const res = await api.get<Note[]>("/notes");
  return res.data;
};

export const deleteNoteApi = async (fileId: number): Promise<void> => {
  await api.delete(`/notes`, { params: { fileId } });
};
