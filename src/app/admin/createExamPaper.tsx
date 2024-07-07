import { GetServerSideProps } from 'next';
import CreateExamPaper from '../../components/CreateExamPaper';
import { auth } from '@/auth';

export default function CreateExamPaperPage() {
  return <CreateExamPaper />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await auth()

  if (!session || !session.user.isAdmin) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return { props: {} };
};