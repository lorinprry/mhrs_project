import React from 'react';

export type PillVariant = 'mint' | 'primary' | 'secondary' | 'rose' | 'amber' | 'gray';

interface PillProps {
  children: React.ReactNode;
  variant?: PillVariant;
  className?: string;
  icon?: React.ReactNode;
}

const Pill: React.FC<PillProps> = ({ children, variant = 'gray', className = '', icon }) => {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
      {children}
    </span>
  );
};

export default Pill;
