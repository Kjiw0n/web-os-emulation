export interface IS3Service {
  /**
   * 파일을 업로드하고 접근 가능한 URL을 반환
   * @param content - 파일 내용
   * @param fileName - 파일 이름
   * @returns 업로드된 파일의 URL
   */
  uploadFile(content: string, fileName: string): Promise<string>;

  /**
   * 파일을 다운로드
   * @param fileName - 다운로드할 파일 이름
   * @returns 파일 내용
   */
  downloadFile(fileName: string): Promise<string>;
}