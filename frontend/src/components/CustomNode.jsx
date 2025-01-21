// CustomNode.jsx
import React from 'react';
import { Handle, Position } from 'react-flow-renderer';

function CustomNode({ id, data }) {
  // data.onAddNode に「自分のid」を渡して下のノードを追加する
  const handleClick = () => {
    data.onAddNode(id);
  };

  return (
    <div style={{ 
      padding: 10, 
      border: '1px solid #ddd', 
      borderRadius: 8, 
      textAlign: 'center', 
      position: 'relative' 
    }}>
      <div>{data.label}</div>
      <button 
        style={{ 
          marginTop: 8, 
          padding: '4px 8px', 
          cursor: 'pointer' 
        }} 
        onClick={handleClick}
      >
        ＋
      </button>

      {/* 
        下からつながってくる(ターゲットになる)ためのハンドル。
        Position.Top でノード上部に配置 
      */}
      <Handle 
        type="target" 
        position={Position.Top} 
        style={{ background: '#999' }}
      />

      {/* 
        下のノードへつなげる(ソースになる)ためのハンドル。
        Position.Bottom でノード下部に配置 
      */}
      <Handle 
        type="source" 
        position={Position.Bottom} 
        style={{ background: '#999' }}
      />
    </div>
  );
}

export default CustomNode;
