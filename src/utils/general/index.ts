export function compareArrays(arr1: any[], arr2: any[]) {
  if (arr1.length !== arr2.length) return false;

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
}

export function convertToTimestamp(date: Date) {
  if (!date) {
    return;
  }

  const seconds = Math.floor(date.getTime() / 1000);
  return seconds;
}
