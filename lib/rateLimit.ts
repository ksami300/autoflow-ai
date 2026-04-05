const map = new Map();

export function rateLimit(ip: string) {
  const now = Date.now();
  const window = 60 * 1000;

  const user = map.get(ip) || { count: 0, time: now };

  if (now - user.time > window) {
    user.count = 1;
    user.time = now;
  } else {
    user.count++;
  }

  map.set(ip, user);

  if (user.count > 10) {
    return false;
  }

  return true;
}