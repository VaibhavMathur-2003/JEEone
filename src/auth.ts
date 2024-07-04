import NextAuth, { CredentialsSignin, DefaultSession } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import { db } from "@/db/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      username: string;
      isAdmin: boolean;
    } & DefaultSession["user"];
  }
}
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db) as any,
  session: { strategy: "jwt" },
  pages: {
    signIn: '/signin',
  },
  providers: [
    CredentialProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          throw new CredentialsSignin("Enter Correct Email and Password");
        }

        const email = credentials.email as string | undefined;
        const password = credentials.password as string | undefined;

        const user = await db.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          throw new CredentialsSignin("Enter corrct Email and Password");
        }
        if (!email || !password) throw new Error("no email, passoword");

        const isPasswordValid = await compare(password, user.password);

        if (!isPasswordValid) {
          throw new CredentialsSignin("Wrong Password");
        }

        return {
          id: user.id.toString(),
          email: user.email,
          username: user.username,
          isAdmin: user.isAdmin,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.isAdmin = token.isAdmin as boolean;
      }
      return session;
    },
  },
});
