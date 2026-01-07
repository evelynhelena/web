export function limitFileName(name: string, maxLength = 12): string {
  if (name.length <= maxLength) {
    return name;
  }

  return name.slice(-maxLength);
}
