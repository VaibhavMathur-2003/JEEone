import { db } from "@/db/db";
import React from "react";
import { redirect } from 'next/navigation'

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

async function handleSubmit(formData: FormData) {
  const name = formData.get("username") as string | undefined;
  const email = formData.get("email") as string | undefined;
  const password = formData.get("password") as string | undefined;

  if (!email || !password || !name) {
    throw new Error("Please fill all the fields");
  }

  const user = await db.user.findUnique({
    where: { email },
  });

  if (user) {
    throw new Error("User already Exists");
  }

  const hashedPassword = await hashPassword(password);

  await db.user.create({
    data: {
      email: email,
      username: name,
      password: hashedPassword,
    },
  });
  redirect('/signin')

}

export default async function Component() {
  return (
    <div className="h-[100vh] flex items-center justify-center bg-blue-100 overflow-y-hidden">
      <Card className="mx-auto max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
          <CardDescription>
            Enter your email, username and password to make your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <form
              action={async (formData) => {
                "use server";
                await handleSubmit(formData);
              }}
            >
              <div className="my-4">
                <Input type="email" placeholder="Email" name="email" />
              </div>
              <div className="my-4">
                <Input type="text" placeholder="Username" name="username" />
              </div>
              <div className="my-4">
                <Input type="password" placeholder="Password" name="password" />
              </div>
              <Button className="w-full" type="submit">Sign up</Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
