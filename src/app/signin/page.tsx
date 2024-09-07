import { auth } from "@/auth";
import SignInForm from "@/components/SignInForm";
import { redirect } from "next/navigation";
import React from "react";


const page = async () => {
  const session = await auth();
  const user = session?.user;
  if(user) redirect("/problems")
 
  return (
    <div>
      <SignInForm />
    </div>
  );
};

export default page;
