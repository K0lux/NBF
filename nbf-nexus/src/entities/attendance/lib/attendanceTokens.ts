import { SignJWT, jwtVerify } from 'jose';
import { env } from '@/shared/config/env';
import { AttendanceTokenPayload } from '../model/types';

export async function generateAttendanceToken(payload: Omit<AttendanceTokenPayload, 'exp'>): Promise<string> {
  const secret = new TextEncoder().encode(env.JWT_SECRET);
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h') // Token valid for 2 hours
    .sign(secret);
}

export async function verifyAttendanceToken(token: string): Promise<AttendanceTokenPayload | null> {
  try {
    const secret = new TextEncoder().encode(env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as AttendanceTokenPayload;
  } catch (err) {
    console.error('Attendance token verification failed:', err);
    return null;
  }
}
