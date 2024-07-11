import { db } from "@/db/db";
import { hash } from "bcryptjs";
import React from "react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Component() {
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
              action={async (formData: FormData) => {
                "use server";
                const name = formData.get("username") as string | undefined;
                const email = formData.get("email") as string | undefined;
                const password = formData.get("password") as string | undefined;

                if (!email || !password || !name)
                  throw new Error("Please fill all the fields");

                const user = await db.user.findUnique({
                  where: { email },
                });

                if (user) throw new Error("User already Exists");

                const hashedPassword = await hash(password, 10);

                await db.user.create({
                  data: {
                    email: email,
                    username: name,
                    password: hashedPassword,
                  },
                });
              }}
            >
              <div className="my-4">
                <Input type="email" placeholder="Email" name="email" />
              </div>
              <div className="my-4">
                <Input type="username" placeholder="Name" name="username" />
              </div>
              <div className="my-4">
                <Input type="password" placeholder="Password" name="password" />
              </div>
              <Button type="submit">Sign up</Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
