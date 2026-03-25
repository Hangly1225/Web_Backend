import { Request } from 'express';
import { UserRole } from '../auth/decorators/roles.decorator';

export interface SessionPayload {
  user?: string;
  role?: UserRole;
}

export type SessionRequest = Request & {
  session: SessionPayload & {
    destroy: (callback: () => void) => void;
  };
};