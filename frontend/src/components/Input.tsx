import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  icon, 
  className = '', 
  id, 
  ...props 
}) => {
  const generatedId = id || Math.random().toString(36).substr(2, 9);
  
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label htmlFor={generatedId} className="input-label">{label}</label>}
      <div style={{ position: 'relative' }}>
        {icon && (
          <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)', pointerEvents: 'none' }}>
            {icon}
          </div>
        )}
        <input
          id={generatedId}
          className="input-field"
          style={{ 
            paddingLeft: icon ? '2.75rem' : '1.125rem',
            borderColor: error ? 'var(--color-rose)' : undefined,
            boxShadow: error ? '0 0 0 4px var(--color-rose-light)' : undefined
          }}
          {...props}
        />
      </div>
      {error && <span className="text-xs" style={{ color: 'var(--color-rose)', marginTop: '0.25rem' }}>{error}</span>}
    </div>
  );
};

export default Input;
