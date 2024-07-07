import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db/db';
import { auth } from '@/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await auth()

  if (!session || !session.user.isAdmin) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  if (req.method === 'POST') {
    const { title, description, questionIds } = req.body;

    try {
      const examPaper = await db.examPaper.create({
        data: {
          title,
          description,
          questions: {
            create: questionIds.map((questionId: number, index: number) => ({
              questionId,
              order: index
            }))
          }
        }
      });

      res.status(201).json(examPaper);
    } catch (error) {
      console.error('Failed to create exam paper:', error);
      res.status(500).json({ error: 'Failed to create exam paper' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}