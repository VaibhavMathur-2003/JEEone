import NextAuth, { DefaultSession, DefaultUser } from "next-auth"
import { JWT as DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
      username: string
      email: string
      isAdmin: boolean
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    username: string
    isAdmin: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id?: string | null
    username?: string | null
    email?: string | null
    isAdmin?: boolean | null
  }
}