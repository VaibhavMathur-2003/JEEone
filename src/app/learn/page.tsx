import dynamic from 'next/dynamic';
import PhysicsFlow from './PhysicsFlowchart';


const HomePage: React.FC = () => {
  return (
    <div className='bg-blue-100 h-screen'>
      <PhysicsFlow />
    </div>
  );
};

export default HomePage;