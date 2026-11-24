import React from 'react';
import { useParams } from 'react-router-dom';
import { ArchitectureGraph } from '../components/graph/ArchitectureGraph';

export const ArchitecturePage: React.FC = () => {
  const { id = 'repo-sample-1' } = useParams<{ id: string }>();

  return (
    <div className="w-full h-full relative">
      <ArchitectureGraph repoId={id} />
    </div>
  );
};
