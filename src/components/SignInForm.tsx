"use client";

import { loginHandler } from "@/action/login";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SignInForm = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  return (
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
          router.push('/problems');
        }
      }}
    >
      <input type="email" placeholder="Email" name="email" />
      <input type="password" placeholder="Password" name="password" />
      <button type="submit">Sign In</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default SignInForm;
