export function getFileExtension(filename: string): string | null {
  // 파일명에서 마지막 '.'의 위치를 찾음
  const index = filename.lastIndexOf(".");

  // '.'이 없거나 파일명이 "."으로 시작하는 경우 기본값 반환
  if (index === -1 || index === 0) return null;

  return filename.slice(index + 1).toLowerCase();
}
