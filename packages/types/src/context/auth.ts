import { Session, User } from "../index";
import { ProviderId } from "../provider";

export type UpdateSession = (data?: any) => Promise<Session | null>;
export type SessionContextValue<R extends boolean = false> = R extends true
    ?
    | { update: UpdateSession; data: Session; status: 'authenticated' }
    | { update: UpdateSession; data: null; status: 'loading' }
    :
    | { update: UpdateSession; data: Session; status: 'authenticated' }
    | {
        update: UpdateSession;
        data: null;
        status: 'unauthenticated' | 'loading';
    };

export interface AuthCOntext {
    isAuthenticated: boolean;
    user: User | null;
    signIn: (provider: ProviderId) => Promise<void>;
    signOut: () => Promise<void>;
    useSession: () => Promise<SessionContextValue>;
}

