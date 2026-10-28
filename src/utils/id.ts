let idCounter = 0;

export function generateId(): string {
  idCounter = (idCounter + 1) % Number.MAX_SAFE_INTEGER;
  const timestamp = Date.now().toString(36);
  const counter = idCounter.toString(36).padStart(8, '0');
  const randomPart = Math.random().toString(36).slice(2, 10).padEnd(8, '0');
  return `${timestamp}-${counter}-${randomPart}`;
}
