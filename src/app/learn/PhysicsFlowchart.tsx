"use client"
import '@xyflow/react/dist/style.css'
import { useState, useCallback } from 'react';
import {
  ReactFlow,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type FitViewOptions,
  type OnConnect,
  type OnNodesChange,
  type OnEdgesChange,
  type OnNodeDrag,
  type NodeTypes,
  type DefaultEdgeOptions,
} from '@xyflow/react';

import { PhysicsNode, HeaderNode, ChapterNode } from './customNode';

const nodeTypes: NodeTypes = {
  physics: PhysicsNode,
  header: HeaderNode,
  chapter: ChapterNode,
};

const edgeStyle = {
  stroke: 'black',
  strokeWidth: 2,
};

// Physics Nodes and Edges
const initialPhysicsNodes: Node[] = [
  { id: '0', data: { label: 'Physics' }, position: { x: 500, y: 50 }, type: 'physics'  },

  // Mechanics Parent Node
  { id: '1', data: { label: 'Mechanics' }, position: { x: 0, y: 150 }, type: 'header'  },
  { id: '2', data: { label: 'Rotational Dynamics' }, position: { x: 0, y: 250 }, type: 'chapter'  },
  { id: '3', data: { label: 'Center of Impulse, Mass, and Momentum' }, position: { x: 0, y: 350 }, type: 'chapter'  },
  { id: '4', data: { label: 'Laws of Motion' }, position: { x: 0, y: 450 }, type: 'chapter'  },
  { id: '5', data: { label: 'Work Energy Power' }, position: { x: 0, y: 550 }, type: 'chapter'  },
  { id: '6', data: { label: 'Kinematics' }, position: { x: 0, y: 650 }, type: 'chapter'  },
  { id: '7', data: { label: 'Gravitation' }, position: { x: 0, y: 750 }, type: 'chapter'  },
  { id: '8', data: { label: 'Circular Motion' }, position: { x: 0, y: 850 }, type: 'chapter'  },
  { id: '9', data: { label: 'Elasticity' }, position: { x: 0, y: 950 }, type: 'chapter'  },

  // Electromagnetism Parent Node
  { id: '10', data: { label: 'Electromagnetism' }, position: { x: 300, y: 150 }, type: 'header'  },
  { id: '11', data: { label: 'Magnetic effects of Current and Magnetism' }, position: { x: 300, y: 250 }, type: 'chapter'  },
  { id: '12', data: { label: 'Current Electricity' }, position: { x: 300, y: 350 }, type: 'chapter'  },
  { id: '13', data: { label: 'Electromagnetic Induction and AC' }, position: { x: 300, y: 450 }, type: 'chapter'  },
  { id: '14', data: { label: 'Capacitor' }, position: { x: 300, y: 550 }, type: 'chapter'  },
  { id: '15', data: { label: 'Electrostatics' }, position: { x: 300, y: 650 }, type: 'chapter'  },
  { id: '16', data: { label: 'EM Waves' }, position: { x: 300, y: 750 }, type: 'chapter'  },

  // Thermodynamics, Waves, and Oscillations Parent Node
  { id: '17', data: { label: 'Thermodynamics, Waves, and Oscillations' }, position: { x: 700, y: 150 }, type: 'header'  },
  { id: '18', data: { label: 'Kinetic Theory of Thermodynamics and Gases' }, position: { x: 700, y: 250 }, type: 'chapter'  },
  { id: '19', data: { label: 'Wave Optics' }, position: { x: 700, y: 350 }, type: 'chapter'  },
  { id: '20', data: { label: 'Waves and Oscillations' }, position: { x: 700, y: 450 }, type: 'chapter'  },
  { id: '21', data: { label: 'Simple Harmonic Motion' }, position: { x: 700, y: 550 }, type: 'chapter'  },
  { id: '22', data: { label: 'Sound Waves' }, position: { x: 700, y: 650 }, type: 'chapter'  },

  // Remaining Chapters Parent Node
  { id: '23', data: { label: 'Remaining Chapters' }, position: { x: 1000, y: 150 }, type: 'header'  },
  { id: '24', data: { label: 'Modern Physics' }, position: { x: 1000, y: 250 }, type: 'chapter'  },
  { id: '25', data: { label: 'Solids and Semiconductor Devices' }, position: { x: 1000, y: 350 }, type: 'chapter'  },
  { id: '26', data: { label: 'Communication Systems' }, position: { x: 1000, y: 450 }, type: 'chapter'  },
  { id: '27', data: { label: 'Error in Measurement' }, position: { x: 1000, y: 550 }, type: 'chapter'  },
];
 
const initialPhysicsEdges: Edge[] = [{ id: 'e1-2', source: '1', target: '2' },
  { id: 'e0-1', source: '0', target: '1' , style: edgeStyle},
  { id: 'e0-10', source: '0', target: '10' , style: edgeStyle},
  { id: 'e0-17', source: '0', target: '17' , style: edgeStyle},
  { id: 'e0-23', source: '0', target: '23' , style: edgeStyle},

  // Mechanics Edges
  { id: 'e1-2', source: '1', target: '2' , style: edgeStyle},
  { id: 'e2-3', source: '2', target: '3' , style: edgeStyle},
  { id: 'e3-4', source: '3', target: '4' , style: edgeStyle},
  { id: 'e4-5', source: '4', target: '5' , style: edgeStyle},
  { id: 'e5-6', source: '5', target: '6' , style: edgeStyle},
  { id: 'e6-7', source: '6', target: '7' , style: edgeStyle},
  { id: 'e7-8', source: '7', target: '8' , style: edgeStyle},
  { id: 'e8-9', source: '8', target: '9' , style: edgeStyle},

  // Electromagnetism Edges
  { id: 'e10-11', source: '10', target: '11' ,style: edgeStyle},
  { id: 'e11-12', source: '11', target: '12' ,style: edgeStyle},
  { id: 'e12-13', source: '12', target: '13' ,style: edgeStyle},
  { id: 'e13-14', source: '13', target: '14' ,style: edgeStyle},
  { id: 'e14-15', source: '14', target: '15' ,style: edgeStyle},
  { id: 'e15-16', source: '15', target: '16' ,style: edgeStyle},

  // Thermodynamics, Waves, and Oscillations Edges
  { id: 'e17-18', source: '17', target: '18' , style: edgeStyle},
  { id: 'e18-19', source: '18', target: '19' , style: edgeStyle},
  { id: 'e19-20', source: '19', target: '20' , style: edgeStyle},
  { id: 'e20-21', source: '20', target: '21' , style: edgeStyle},
  { id: 'e21-22', source: '21', target: '22' , style: edgeStyle},
  // Remaining Chapters Edges, style: edgeStyle
  { id: 'e23-24', source: '23', target: '24' , style: edgeStyle},
  { id: 'e24-25', source: '24', target: '25' , style: edgeStyle},
  { id: 'e25-26', source: '25', target: '26' , style: edgeStyle},
  { id: 'e26-27', source: '26', target: '27' , style: edgeStyle},
];

// Maths Nodes and Edges
const initialMathsNodes: Node[] = [
  { id: '0', data: { label: 'Maths' }, position: { x: 500, y: 50 }, type: 'physics'  },

  // Calculus Parent Node
  { id: '1', data: { label: 'Calculus' }, position: { x: 0, y: 150 }, type: 'header'  },
  { id: '2', data: { label: 'Limits, Continuity, and Differentiability' }, position: { x: 0, y: 250 }, type: 'chapter'  },
  { id: '3', data: { label: 'Integral Calculus' }, position: { x: 0, y: 350 }, type: 'chapter'  },
  { id: '4', data: { label: 'Differential Calculus' }, position: { x: 0, y: 450 }, type: 'chapter'  },
  { id: '5', data: { label: 'Differential Equation' }, position: { x: 0, y: 550 }, type: 'chapter'  },

  // Geometry and 3D Parent Node
  { id: '10', data: { label: 'Geometry and 3D' }, position: { x: 300, y: 150 }, type: 'header'  },
  { id: '11', data: { label: 'Coordinate Geometry' }, position: { x: 300, y: 250 }, type: 'chapter'  },
  { id: '12', data: { label: '3-Dimensional Geometry' }, position: { x: 300, y: 350 }, type: 'chapter'  },

  // Algebra and Trigonometry Parent Node
  { id: '20', data: { label: 'Algebra and Trigonometry' }, position: { x: 600, y: 150 }, type: 'header'  },
  { id: '21', data: { label: 'Quadratic Equation and Complex numbers' }, position: { x: 600, y: 250 }, type: 'chapter'  },
  { id: '22', data: { label: 'Matrices and Determinants' }, position: { x: 600, y: 350 }, type: 'chapter'  },
  { id: '23', data: { label: 'Sets, Relation, and Function' }, position: { x: 600, y: 450 }, type: 'chapter'  },
  { id: '24', data: { label: 'Vector Algebra' }, position: { x: 600, y: 550 }, type: 'chapter'  },
  { id: '25', data: { label: 'Binomial Theorem' }, position: { x: 600, y: 650 }, type: 'chapter'  },
  { id: '26', data: { label: 'Permutations and Combinations' }, position: { x: 600, y: 750 }, type: 'chapter'  },
  { id: '27', data: { label: 'Sequences and Series' }, position: { x: 600, y: 850 }, type: 'chapter'  },
  { id: '28', data: { label: 'Trigonometry' }, position: { x: 600, y: 950 }, type: 'chapter'  },

  // Probability, Stats, and Reasoning Parent Node
  { id: '30', data: { label: 'Probability, Stats, and Reasoning' }, position: { x: 900, y: 150 }, type: 'header'  },
  { id: '31', data: { label: 'Statistics and Probability' }, position: { x: 900, y: 250 }, type: 'chapter'  },
  { id: '32', data: { label: 'Mathematical Reasoning' }, position: { x: 900, y: 350 }, type: 'chapter'  },
];


const initialMathsEdges: Edge[] = [
  { id: 'e0-1', source: '0', target: '1', style: edgeStyle },
  { id: 'e0-10', source: '0', target: '10', style: edgeStyle },
  { id: 'e0-20', source: '0', target: '20', style: edgeStyle },
  { id: 'e0-30', source: '0', target: '30', style: edgeStyle },

  // Calculus Edges
  { id: 'e1-2', source: '1', target: '2', style: edgeStyle },
  { id: 'e2-3', source: '2', target: '3', style: edgeStyle },
  { id: 'e3-4', source: '3', target: '4', style: edgeStyle },
  { id: 'e4-5', source: '4', target: '5', style: edgeStyle },

  // Geometry and 3D Edges
  { id: 'e10-11', source: '10', target: '11', style: edgeStyle },
  { id: 'e11-12', source: '11', target: '12', style: edgeStyle },

  // Algebra and Trigonometry Edges
  { id: 'e20-21', source: '20', target: '21', style: edgeStyle },
  { id: 'e21-22', source: '21', target: '22', style: edgeStyle },
  { id: 'e22-23', source: '22', target: '23', style: edgeStyle },
  { id: 'e23-24', source: '23', target: '24', style: edgeStyle },
  { id: 'e24-25', source: '24', target: '25', style: edgeStyle },
  { id: 'e25-26', source: '25', target: '26', style: edgeStyle },
  { id: 'e26-27', source: '26', target: '27', style: edgeStyle },
  { id: 'e27-28', source: '27', target: '28', style: edgeStyle },
  { id: 'e28-29', source: '28', target: '29', style: edgeStyle },

  // Probability, Stats, and Reasoning Edges
  { id: 'e30-31', source: '30', target: '31', style: edgeStyle },
  { id: 'e31-32', source: '31', target: '32', style: edgeStyle },
];


// Chemistry Nodes and Edges
const initialChemistryNodes: Node[] = [
  { id: '0', data: { label: 'Chemistry' }, position: { x: 500, y: 50 }, type: 'physics'  },

  // Physical Chemistry Parent Node
  { id: '1', data: { label: 'Physical Chemistry' }, position: { x: 0, y: 150 }, type: 'header'  },
  { id: '2', data: { label: 'Thermodynamics and Gaseous State' }, position: { x: 0, y: 250 }, type: 'chapter'  },
  { id: '3', data: { label: 'Chemical and Ionic Equilibrium' }, position: { x: 0, y: 350 }, type: 'chapter'  },
  { id: '4', data: { label: 'Mole Concept' }, position: { x: 0, y: 450 }, type: 'chapter'  },
  { id: '5', data: { label: 'Chemical Kinetics' }, position: { x: 0, y: 550 }, type: 'chapter'  },
  { id: '6', data: { label: 'Solution and Colligative Properties' }, position: { x: 0, y: 650 }, type: 'chapter'  },
  { id: '7', data: { label: 'Electrochemistry' }, position: { x: 0, y: 750 }, type: 'chapter'  },
  { id: '8', data: { label: 'Redox Reaction' }, position: { x: 0, y: 850 }, type: 'chapter'  },

  // Inorganic Chemistry Parent Node
  { id: '10', data: { label: 'Inorganic Chemistry' }, position: { x: 300, y: 150 }, type: 'header'  },
  { id: '11', data: { label: 'Periodic Table' }, position: { x: 300, y: 250 }, type: 'chapter'  },
  { id: '12', data: { label: 'Coordination Chemistry and Transition Elements' }, position: { x: 300, y: 350 }, type: 'chapter'  },
  { id: '13', data: { label: 'Atomic Structure' }, position: { x: 300, y: 450 }, type: 'chapter'  },
  { id: '14', data: { label: 'Chemical Bonding' }, position: { x: 300, y: 550 }, type: 'chapter'  },
  { id: '15', data: { label: 'Solid State and Surface Chemistry' }, position: { x: 300, y: 650 }, type: 'chapter'  },

  // Organic Chemistry Parent Node
  { id: '20', data: { label: 'Organic Chemistry' }, position: { x: 600, y: 150 }, type: 'header'  },
  { id: '21', data: { label: 'General Organic Chemistry' }, position: { x: 600, y: 250 }, type: 'chapter'  },
  { id: '22', data: { label: 'Hydrocarbon' }, position: { x: 600, y: 350 }, type: 'chapter'  },
  { id: '23', data: { label: 'Stereochemistry' }, position: { x: 600, y: 450 }, type: 'chapter'  },
  { id: '24', data: { label: 'Carboxylic Acid and Derivatives' }, position: { x: 600, y: 550 }, type: 'chapter'  },
  { id: '25', data: { label: 'Aromatic Compounds' }, position: { x: 600, y: 650 }, type: 'chapter'  },
  { id: '26', data: { label: 'Amino Acids, Carbohydrates, and Polymers' }, position: { x: 600, y: 750 }, type: 'chapter'  },
  { id: '27', data: { label: 'Alkyl Halides' }, position: { x: 600, y: 850 }, type: 'chapter'  },

  // Special Topics Parent Node
  { id: '30', data: { label: 'Special Topics' }, position: { x: 900, y: 150 }, type: 'header'  },
  { id: '31', data: { label: 'Nuclear Chemistry and Environment' }, position: { x: 900, y: 250 }, type: 'chapter'  },
];


const initialChemistryEdges: Edge[] = [
  { id: 'e0-1', source: '0', target: '1', style: edgeStyle },
  { id: 'e0-10', source: '0', target: '10', style: edgeStyle },
  { id: 'e0-20', source: '0', target: '20', style: edgeStyle },
  { id: 'e0-30', source: '0', target: '30', style: edgeStyle },

  // Physical Chemistry Edges
  { id: 'e1-2', source: '1', target: '2', style: edgeStyle },
  { id: 'e2-3', source: '2', target: '3', style: edgeStyle },
  { id: 'e3-4', source: '3', target: '4', style: edgeStyle },
  { id: 'e4-5', source: '4', target: '5', style: edgeStyle },
  { id: 'e5-6', source: '5', target: '6', style: edgeStyle },
  { id: 'e6-7', source: '6', target: '7', style: edgeStyle },
  { id: 'e7-8', source: '7', target: '8', style: edgeStyle },

  // Inorganic Chemistry Edges
  { id: 'e10-11', source: '10', target: '11', style: edgeStyle },
  { id: 'e11-12', source: '11', target: '12', style: edgeStyle },
  { id: 'e12-13', source: '12', target: '13', style: edgeStyle },
  { id: 'e13-14', source: '13', target: '14', style: edgeStyle },
  { id: 'e14-15', source: '14', target: '15', style: edgeStyle },

  // Organic Chemistry Edges
  { id: 'e20-21', source: '20', target: '21', style: edgeStyle },
  { id: 'e21-22', source: '21', target: '22', style: edgeStyle },
  { id: 'e22-23', source: '22', target: '23', style: edgeStyle },
  { id: 'e23-24', source: '23', target: '24', style: edgeStyle },
  { id: 'e24-25', source: '24', target: '25', style: edgeStyle },
  { id: 'e25-26', source: '25', target: '26', style: edgeStyle },
  { id: 'e26-27', source: '26', target: '27', style: edgeStyle },

  // Special Topics Edges
  { id: 'e30-31', source: '30', target: '31', style: edgeStyle },
];


const fitViewOptions: FitViewOptions = {
  padding: 0.01,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: true,
};

export default function SubjectFlow() {
  const [subject, setSubject] = useState('Physics'); // State to switch subjects
  const [nodes, setNodes] = useState<Node[]>(initialPhysicsNodes);
  const [edges, setEdges] = useState<Edge[]>(initialPhysicsEdges);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes],
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges],
  );

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  const handleSubjectChange = (newSubject) => {
    setSubject(newSubject);
    if (newSubject === 'Physics') {
      setNodes(initialPhysicsNodes);
      setEdges(initialPhysicsEdges);
    } else if (newSubject === 'Maths') {
      setNodes(initialMathsNodes);
      setEdges(initialMathsEdges);
    } else if (newSubject === 'Chemistry') {
      setNodes(initialChemistryNodes);
      setEdges(initialChemistryEdges);
    }
  };

  return (
    <div className='h-screen'>
      <div className='flex flex-col justify-between absolute z-50'>
        <button onClick={() => handleSubjectChange('Physics')}>Physics</button>
        <button onClick={() => handleSubjectChange('Maths')}>Maths</button>
        <button onClick={() => handleSubjectChange('Chemistry')}>Chemistry</button>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        fitViewOptions={fitViewOptions}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
      />
    </div>
  );
}
