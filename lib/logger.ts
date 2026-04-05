export function log(message: string, data?: any) {
  console.log(`[LOG]: ${message}`, data || "");
}

export function errorLog(message: string, err?: any) {
  console.error(`[ERROR]: ${message}`, err || "");
}