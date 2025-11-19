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
  content: string;
  updated_at?: string;
}

export const createNote = async (payload: CreateNoteRequest) => {
  const res = await api.post<NoteResponse>("/notes/create", payload);
  return res.data;
};

export const getNoteList = async (): Promise<NoteResponse[]> => {
  const res = await api.get<NoteResponse[]>("/notes/list");
  return res.data
};

export const getNote = async (id: number): Promise<NoteResponse> => {
  const res = await api.get<NoteResponse>(`/notes/files/?id=${id}`);
  return res.data;
};