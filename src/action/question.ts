'use server';
import { db } from "@/db/db";
import { redirect } from "next/navigation";

export async function createQuestion(formData: FormData) {
  const title = formData.get('title') as string;
  const text = formData.get('text') as string;
  const difficulty = formData.get('difficulty') as 'EASY' | 'MEDIUM' | 'HARD';
  const subject = formData.get('subject') as string;
  const explanation = formData.get('explanation') as string;
  const type = formData.get('type') as 'MULTIPLE_CHOICE_SINGLE' | 'MULTIPLE_CHOICE_MULTIPLE' | 'FILL_IN_THE_BLANK';
  const options = JSON.parse(formData.get('options') as string);

  try {
    const question = await db.question.create({
      data: {
        title,
        text,
        difficulty,
        subject,
        explanation,
        type,
        options: {
          create: options,
        },
      },
      include: {
        options: true,
      },
    });

    redirect('/problems')
  } catch (error) {
    console.error('Error creating question:', error);
    
  }
}