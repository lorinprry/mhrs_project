import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  icon?: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ 
  label, 
  error, 
  options, 
  placeholder,
  className = '', 
  id,
  icon,
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
        <select
          id={generatedId}
          className="input-field"
          style={{ 
            appearance: 'none', 
            cursor: props.disabled ? 'not-allowed' : 'pointer',
            paddingLeft: icon ? '2.75rem' : '1.125rem',
            paddingRight: '2.5rem',
            borderColor: error ? 'var(--color-rose)' : undefined,
            boxShadow: error ? '0 0 0 4px var(--color-rose-light)' : undefined
          }}
          {...props}
        >
          {placeholder && <option value="" disabled hidden>{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-light)' }}>
          <ChevronDown size={18} />
        </div>
      </div>
      {error && <span className="text-xs" style={{ color: 'var(--color-rose)', marginTop: '0.25rem' }}>{error}</span>}
    </div>
  );
};

export default Select;
