export function arraysEquals(a: any[], b: any[]) {
  return a.length === b.length && a.every((val, index) => val === b[index]);
}
