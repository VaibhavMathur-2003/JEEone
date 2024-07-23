import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';


const baseNodeStyle: React.CSSProperties = {
  color: 'white',
  padding: '10px',
  borderRadius: '8px',
  fontFamily: 'Arial, sans-serif',
  fontSize: '14px',
  fontWeight: 'bold',
  width: '180px',
  textAlign: 'center',
};

export const PhysicsNode: React.FC<NodeProps> = ({ data }) => (
  <div style={{
    ...baseNodeStyle,
    background: '#00246B',
    border: '2px solid #30dcff',
    fontSize: '18px',
  }}>
    <Handle type="source" position={Position.Bottom} style={{ borderRadius: '50%' }} />
    {data.label as string}
  </div>
);

export const HeaderNode: React.FC<NodeProps> = ({ data }) => (
  <div style={{
    ...baseNodeStyle,
    background: '#415fd5',
    border: '3px solid #1900ff',
    width: '250px',
    fontSize: '16px',
    color: 'white',
    fontFamily: 'Arial'
  }}>
    <Handle type="target" position={Position.Top} style={{ borderRadius: '50%' }} />
    {data.label as string}
    <Handle type="source" position={Position.Bottom} style={{ borderRadius: '50%' }} />
  </div>
);

export const ChapterNode: React.FC<NodeProps> = ({ data }) => (
  <div style={{
    ...baseNodeStyle,
    background: '#ffffff',
    border: '2px solid #415fd5',
    fontSize: '15px',
    width: '200px',
    color: 'black',
    fontFamily: 'Monospace'
  }}>
    <Handle type="target" position={Position.Top} style={{ borderRadius: '50%' }} />
    {data.label as string}
    <Handle type="source" position={Position.Bottom} style={{ borderRadius: '50%' }} />

  </div>
);