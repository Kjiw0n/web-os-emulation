import api from "@/api/axiosInstance";

// 노트 생성 요청 타입
export interface CreateNoteRequest {
  title: string;
  content?: string;
}

// 노트 응답 타입
export interface NoteResponse {
  id: number;
  title: string;
  content: string;
  created_at?: string;
}

export const createNote = async (payload: CreateNoteRequest) => {
  const res = await api.post<NoteResponse>("/notes/create", payload);
  return res.data;
};