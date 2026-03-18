import { SignJWT, jwtVerify } from 'jose';
import { env } from '@/shared/config/env';
import { AttendanceTokenPayload } from '../model/types';

async function getAttendanceJwtKey(): Promise<Uint8Array> {
  const jwtSecret = env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is missing');
  }

  // Derive a stable 256-bit key to satisfy HS256 requirements.
  const secretBytes = new TextEncoder().encode(jwtSecret);
  const digest = await crypto.subtle.digest('SHA-256', secretBytes);
  return new Uint8Array(digest);
}

export async function generateAttendanceToken(payload: Omit<AttendanceTokenPayload, 'exp'>): Promise<string> {
  const secret = await getAttendanceJwtKey();
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h') // Token valid for 2 hours
    .sign(secret);
}

export async function verifyAttendanceToken(token: string): Promise<AttendanceTokenPayload | null> {
  try {
    const secret = await getAttendanceJwtKey();
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as AttendanceTokenPayload;
  } catch (err) {
    console.error('Attendance token verification failed:', err);
    return null;
  }
}
