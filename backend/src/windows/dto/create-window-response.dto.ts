export class CreateWindowResponseDto {
  windowId: number;
  title: string;
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  processId: number | null;
  programName: string;
}
