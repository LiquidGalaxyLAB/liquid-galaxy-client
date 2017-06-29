export function genTimeId() {
  return Date.now() * ~~(Math.random() * 100);
}
