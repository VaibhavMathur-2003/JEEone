import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import AuthProvider from "@/components/AuthProvider";
import Link from "next/link";
import { auth } from "@/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}
      >
        <header className="px-4 lg:px-6 h-14 flex items-center justify-between bg-blue-200 sticky top-0">
          <Link
            href="/"
            className="flex items-center justify-center"
            prefetch={false}
          >
            <span className="font-bold text-lg italic">JEEnius</span>
          </Link>
          <nav className="flex gap-4 sm:gap-10">
            <Link
              href="/problems"
              className="text-sm font-medium hover:underline underline-offset-4"
              prefetch={false}
            >
              Problems
            </Link>
            <Link
              href="/contest"
              className="text-sm font-medium hover:underline underline-offset-4"
              prefetch={false}
            >
              Contests
            </Link>
            <Link
              href="/learn"
              className="text-sm font-medium hover:underline underline-offset-4"
              prefetch={false}
            >
              Learn
            </Link>
            <Link
              href="/exam"
              className="text-sm font-medium hover:underline underline-offset-4"
              prefetch={false}
            >
              Exam
            </Link>
          </nav>
          <div className="flex flex-col gap-8 min-[400px]:flex-row">
            {!session?.user ? (
              <>
                <Link
                  href="/signin"
                  prefetch={false}
                  className="text-sm font-semibold italic hover:underline underline-offset-4"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  prefetch={false}
                  className="text-sm font-semibold italic hover:underline underline-offset-4"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <Link
              href={`/profile/${session.user.id}`}
              prefetch={false}
              >
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              </Link>
            )}
          </div>
        </header>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
