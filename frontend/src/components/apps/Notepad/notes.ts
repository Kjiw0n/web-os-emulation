import api from "@/api/axiosInstance";

// 노트 생성 요청 타입
export interface CreateNoteRequest {
  name: string;
  content?: string;
}

// 노트 응답 타입
export interface NoteResponse {
  id: number;
  name: string;
  updatedAt?: string;
}

export const createNote = async (payload: CreateNoteRequest) => {
  const res = await api.post<NoteResponse>("/notes/create", payload);
  return res.data;
};

export const getNoteList = async (): Promise<NoteResponse[]> => {
  const res = await api.get<NoteResponse[]>("/notes");
  return res.data
};