import * as bcrypt from 'bcrypt';

export async function hashPassword(
  password: string,
  saltRounds: number = 10,
): Promise<string> {
  return bcrypt.hash(password, saltRounds);
}

export async function comparePassword(
  rawPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(rawPassword, hashedPassword);
}
