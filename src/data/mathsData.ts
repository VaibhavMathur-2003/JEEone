import {
    type Node,
    type Edge,
  } from '@xyflow/react';

  const edgeStyle = {
    stroke: 'black',
    strokeWidth: 2,
  };

export const initialMathsNodes: Node[] = [
    { id: '0', data: { label: 'Maths' }, position: { x: 500, y: 50 }, type: 'physics'  },
  
    { id: '1', data: { label: 'Calculus' }, position: { x: 0, y: 150 }, type: 'header'  },
    { id: '2', data: { label: 'Limits, Continuity, and Differentiability' }, position: { x: 0, y: 250 }, type: 'chapter'  },
    { id: '3', data: { label: 'Integral Calculus' }, position: { x: 0, y: 350 }, type: 'chapter'  },
    { id: '4', data: { label: 'Differential Calculus' }, position: { x: 0, y: 450 }, type: 'chapter'  },
    { id: '5', data: { label: 'Differential Equation' }, position: { x: 0, y: 550 }, type: 'chapter'  },
  
    { id: '10', data: { label: 'Geometry and 3D' }, position: { x: 300, y: 150 }, type: 'header'  },
    { id: '11', data: { label: 'Coordinate Geometry' }, position: { x: 300, y: 250 }, type: 'chapter'  },
    { id: '12', data: { label: '3-Dimensional Geometry' }, position: { x: 300, y: 350 }, type: 'chapter'  },
  
    { id: '20', data: { label: 'Algebra and Trigonometry' }, position: { x: 600, y: 150 }, type: 'header'  },
    { id: '21', data: { label: 'Quadratic Equation and Complex numbers' }, position: { x: 600, y: 250 }, type: 'chapter'  },
    { id: '22', data: { label: 'Matrices and Determinants' }, position: { x: 600, y: 350 }, type: 'chapter'  },
    { id: '23', data: { label: 'Sets, Relation, and Function' }, position: { x: 600, y: 450 }, type: 'chapter'  },
    { id: '24', data: { label: 'Vector Algebra' }, position: { x: 600, y: 550 }, type: 'chapter'  },
    { id: '25', data: { label: 'Binomial Theorem' }, position: { x: 600, y: 650 }, type: 'chapter'  },
    { id: '26', data: { label: 'Permutations and Combinations' }, position: { x: 600, y: 750 }, type: 'chapter'  },
    { id: '27', data: { label: 'Sequences and Series' }, position: { x: 600, y: 850 }, type: 'chapter'  },
    { id: '28', data: { label: 'Trigonometry' }, position: { x: 600, y: 950 }, type: 'chapter'  },
  
    { id: '30', data: { label: 'Probability, Stats, and Reasoning' }, position: { x: 900, y: 150 }, type: 'header'  },
    { id: '31', data: { label: 'Statistics and Probability' }, position: { x: 900, y: 250 }, type: 'chapter'  },
    { id: '32', data: { label: 'Mathematical Reasoning' }, position: { x: 900, y: 350 }, type: 'chapter'  },
  ];
  
  
  export const initialMathsEdges: Edge[] = [
    { id: 'e0-1', source: '0', target: '1', style: edgeStyle },
    { id: 'e0-10', source: '0', target: '10', style: edgeStyle },
    { id: 'e0-20', source: '0', target: '20', style: edgeStyle },
    { id: 'e0-30', source: '0', target: '30', style: edgeStyle },
  
    { id: 'e1-2', source: '1', target: '2', style: edgeStyle },
    { id: 'e2-3', source: '2', target: '3', style: edgeStyle },
    { id: 'e3-4', source: '3', target: '4', style: edgeStyle },
    { id: 'e4-5', source: '4', target: '5', style: edgeStyle },
  
    { id: 'e10-11', source: '10', target: '11', style: edgeStyle },
    { id: 'e11-12', source: '11', target: '12', style: edgeStyle },
  
    { id: 'e20-21', source: '20', target: '21', style: edgeStyle },
    { id: 'e21-22', source: '21', target: '22', style: edgeStyle },
    { id: 'e22-23', source: '22', target: '23', style: edgeStyle },
    { id: 'e23-24', source: '23', target: '24', style: edgeStyle },
    { id: 'e24-25', source: '24', target: '25', style: edgeStyle },
    { id: 'e25-26', source: '25', target: '26', style: edgeStyle },
    { id: 'e26-27', source: '26', target: '27', style: edgeStyle },
    { id: 'e27-28', source: '27', target: '28', style: edgeStyle },
    { id: 'e28-29', source: '28', target: '29', style: edgeStyle },
  
    { id: 'e30-31', source: '30', target: '31', style: edgeStyle },
    { id: 'e31-32', source: '31', target: '32', style: edgeStyle },
  ];
  