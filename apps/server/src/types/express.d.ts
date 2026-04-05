declare global {
  namespace Express {
    interface AuthUser {
      userId: string;
      username: string;
      email: string;
    }

    interface Request {
      user?: AuthUser;
    }
  }
}

export {};
