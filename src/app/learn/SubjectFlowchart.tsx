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
import { Button } from '@/components/ui/button';

const nodeTypes: NodeTypes = {
  physics: PhysicsNode,
  header: HeaderNode,
  chapter: ChapterNode,
};

import { initialPhysicsNodes, initialPhysicsEdges } from './data';

// Physics Nodes and Edges



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

  const handleSubjectChange = async (newSubject: string) => {
    setSubject(newSubject);
    let newNodes: Node[] = [];
    let newEdges: Edge[] = [];

    if (newSubject === 'Physics') {
      newNodes = initialPhysicsNodes;
      newEdges = initialPhysicsEdges;
    } else if (newSubject === 'Maths') {
      const { initialMathsNodes, initialMathsEdges } = await import('./data');
      newNodes = initialMathsNodes;
      newEdges = initialMathsEdges;
    } else if (newSubject === 'Chemistry') {
      const { initialChemistryNodes, initialChemistryEdges } = await import('./data');
      newNodes = initialChemistryNodes;
      newEdges = initialChemistryEdges;
    }

    setNodes(newNodes);
    setEdges(newEdges);
  };
  return (
    <div className="h-screen flex">
    <div className="flex fixed left-0 flex-col h-1/4 justify-between space-y-4  p-4 text-sm  bg-white shadow-md rounded-lg absolute z-50">
      <Button
        onClick={() => handleSubjectChange('Physics')}
        className="px-2 py-1 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200"
      >
        Physics
      </Button>
      <Button
        onClick={() => handleSubjectChange('Maths')}
        className="px-2 py-1 bg-blue-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-200"
      >
        Maths
      </Button>
      <Button
        onClick={() => handleSubjectChange('Chemistry')}
        className="px-2 py-1 bg-blue-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-200"
      >
        Chemistry
      </Button>
    </div>
    <div className="flex-1">
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
  </div>
  
  );
}
