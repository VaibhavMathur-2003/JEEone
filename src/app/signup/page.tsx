import  {db}  from "@/db/db";
import { hash } from "bcryptjs";
import React from "react";

export default function Page (){
    return (
        <div>
            <form action={async(formData: FormData)=>{
                "use server";
                const name = formData.get("username") as string | undefined;
                const email = formData.get("email") as string | undefined;
                const password = formData.get("password") as string | undefined;

                if(!email || !password || !name) throw new Error("Please fill all the fields");

                const user = await db.user.findUnique({
                    where: { email }
                  });

                if(user) throw new Error("User already Exists");

                const hashedPassword = await hash(password, 10);

                await db.user.create({
                    data: {
                        email: email,
                        username: name,
                        password: hashedPassword
                      },
                })
            }}>
                <input type="email" placeholder="Email" name="email"/>
                <input type="username" placeholder="Name" name="username"/>
                <input type="password" placeholder="Password" name="password"/>
                <button type="submit">Sign up</button>
            </form>
        </div>
    )
}