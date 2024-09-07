"use client";

import { loginHandler } from "@/action/login";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";



const SignInForm = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const guestmail = "guest@example.com";
  const guestpass = "guestpassword987";

  const handleGuestLogin = async () => {
   
    const signInError = await loginHandler(guestmail, guestpass);
    if (signInError) {
      setError(signInError);
    } else {
      router.refresh();
    }
  };


  return (
    <div className="flex items-center overflow-y-hidden h-screen bg-blue-100">
    <Card className="mx-auto max-w-sm">
    <CardHeader className="space-y-1">
      <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
      <CardDescription>
        Enter your email and password to login to your account
      </CardDescription>
    </CardHeader>
    <CardContent>
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        if (!email || !password) {
          setError("Fill all details");
          return;
        }

        const signInError = await loginHandler(email, password);
        if (signInError) {
          setError(signInError);
        } else {
          router.refresh()
        }
      }}
    >
      <Input className="my-4" type="email" placeholder="Email" name="email" />
      <Input className="my-4" type="password" placeholder="Password" name="password" />
      <Button className="my-4 w-full" type="submit">Sign In</Button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
    <Button className="bg-gray-700 w-full" onClick={handleGuestLogin} type="button">Enter as Guest</Button>

    </CardContent>
    </Card>
    </div>
  );
};

export default SignInForm;
