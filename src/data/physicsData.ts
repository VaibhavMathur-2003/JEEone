import {
    type Node,
    type Edge,
  } from '@xyflow/react';

  const edgeStyle = {
    stroke: 'black',
    strokeWidth: 2,
  };

export const initialPhysicsNodes: Node[] = [
    { id: '0', data: { label: 'Physics' }, position: { x: 500, y: 50 }, type: 'physics'  },
  
    { id: '1', data: { label: 'Mechanics' }, position: { x: 0, y: 150 }, type: 'header'  },
    { id: '2', data: { label: 'Rotational Dynamics' }, position: { x: 0, y: 250 }, type: 'chapter'  },
    { id: '3', data: { label: 'Center of Impulse, Mass, and Momentum' }, position: { x: 0, y: 350 }, type: 'chapter'  },
    { id: '4', data: { label: 'Laws of Motion' }, position: { x: 0, y: 450 }, type: 'chapter'  },
    { id: '5', data: { label: 'Work Energy Power' }, position: { x: 0, y: 550 }, type: 'chapter'  },
    { id: '6', data: { label: 'Kinematics' }, position: { x: 0, y: 650 }, type: 'chapter'  },
    { id: '7', data: { label: 'Gravitation' }, position: { x: 0, y: 750 }, type: 'chapter'  },
    { id: '8', data: { label: 'Circular Motion' }, position: { x: 0, y: 850 }, type: 'chapter'  },
    { id: '9', data: { label: 'Elasticity' }, position: { x: 0, y: 950 }, type: 'chapter'  },
  
    { id: '10', data: { label: 'Electromagnetism' }, position: { x: 300, y: 150 }, type: 'header'  },
    { id: '11', data: { label: 'Magnetic effects of Current and Magnetism' }, position: { x: 300, y: 250 }, type: 'chapter'  },
    { id: '12', data: { label: 'Current Electricity' }, position: { x: 300, y: 350 }, type: 'chapter'  },
    { id: '13', data: { label: 'Electromagnetic Induction and AC' }, position: { x: 300, y: 450 }, type: 'chapter'  },
    { id: '14', data: { label: 'Capacitor' }, position: { x: 300, y: 550 }, type: 'chapter'  },
    { id: '15', data: { label: 'Electrostatics' }, position: { x: 300, y: 650 }, type: 'chapter'  },
    { id: '16', data: { label: 'EM Waves' }, position: { x: 300, y: 750 }, type: 'chapter'  },
  
    { id: '17', data: { label: 'Thermodynamics, Waves, and Oscillations' }, position: { x: 700, y: 150 }, type: 'header'  },
    { id: '18', data: { label: 'Kinetic Theory of Thermodynamics and Gases' }, position: { x: 700, y: 250 }, type: 'chapter'  },
    { id: '19', data: { label: 'Wave Optics' }, position: { x: 700, y: 350 }, type: 'chapter'  },
    { id: '20', data: { label: 'Waves and Oscillations' }, position: { x: 700, y: 450 }, type: 'chapter'  },
    { id: '21', data: { label: 'Simple Harmonic Motion' }, position: { x: 700, y: 550 }, type: 'chapter'  },
    { id: '22', data: { label: 'Sound Waves' }, position: { x: 700, y: 650 }, type: 'chapter'  },
  
    { id: '23', data: { label: 'Remaining Chapters' }, position: { x: 1000, y: 150 }, type: 'header'  },
    { id: '24', data: { label: 'Modern Physics' }, position: { x: 1000, y: 250 }, type: 'chapter'  },
    { id: '25', data: { label: 'Solids and Semiconductor Devices' }, position: { x: 1000, y: 350 }, type: 'chapter'  },
    { id: '26', data: { label: 'Communication Systems' }, position: { x: 1000, y: 450 }, type: 'chapter'  },
    { id: '27', data: { label: 'Error in Measurement' }, position: { x: 1000, y: 550 }, type: 'chapter'  },
  ];
   
  export const initialPhysicsEdges: Edge[] = [{ id: 'e1-2', source: '1', target: '2' },
    { id: 'e0-1', source: '0', target: '1' , style: edgeStyle},
    { id: 'e0-10', source: '0', target: '10' , style: edgeStyle},
    { id: 'e0-17', source: '0', target: '17' , style: edgeStyle},
    { id: 'e0-23', source: '0', target: '23' , style: edgeStyle},
  
    { id: 'e1-2', source: '1', target: '2' , style: edgeStyle},
    { id: 'e2-3', source: '2', target: '3' , style: edgeStyle},
    { id: 'e3-4', source: '3', target: '4' , style: edgeStyle},
    { id: 'e4-5', source: '4', target: '5' , style: edgeStyle},
    { id: 'e5-6', source: '5', target: '6' , style: edgeStyle},
    { id: 'e6-7', source: '6', target: '7' , style: edgeStyle},
    { id: 'e7-8', source: '7', target: '8' , style: edgeStyle},
    { id: 'e8-9', source: '8', target: '9' , style: edgeStyle},
  
    { id: 'e10-11', source: '10', target: '11' ,style: edgeStyle},
    { id: 'e11-12', source: '11', target: '12' ,style: edgeStyle},
    { id: 'e12-13', source: '12', target: '13' ,style: edgeStyle},
    { id: 'e13-14', source: '13', target: '14' ,style: edgeStyle},
    { id: 'e14-15', source: '14', target: '15' ,style: edgeStyle},
    { id: 'e15-16', source: '15', target: '16' ,style: edgeStyle},
  
    { id: 'e17-18', source: '17', target: '18' , style: edgeStyle},
    { id: 'e18-19', source: '18', target: '19' , style: edgeStyle},
    { id: 'e19-20', source: '19', target: '20' , style: edgeStyle},
    { id: 'e20-21', source: '20', target: '21' , style: edgeStyle},
    { id: 'e21-22', source: '21', target: '22' , style: edgeStyle},
    { id: 'e23-24', source: '23', target: '24' , style: edgeStyle},
    { id: 'e24-25', source: '24', target: '25' , style: edgeStyle},
    { id: 'e25-26', source: '25', target: '26' , style: edgeStyle},
    { id: 'e26-27', source: '26', target: '27' , style: edgeStyle},
  ];