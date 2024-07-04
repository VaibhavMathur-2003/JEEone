import { auth } from '@/auth'
import SignInForm from '@/components/SignInForm'
import { redirect } from 'next/navigation';
import React from 'react'

const page = async() => {
    const session = await auth();
    if(session?.user) redirect('/')
  return (
    <div>
        <SignInForm/>
    </div>
  )
}

export default page