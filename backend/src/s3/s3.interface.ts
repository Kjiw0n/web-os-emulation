export interface IS3Service {
  /**
   * 파일을 업로드하고 접근 가능한 URL을 반환
   * @param content - 파일 내용
   * @param fileName - 파일 이름
   * @returns 업로드된 파일의 URL
   */
  uploadFile(content: string, fileName: string): Promise<string>;
}