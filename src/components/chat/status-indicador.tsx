import { BsCircleFill } from 'react-icons/bs';

interface StatusIndicatorProps {
  isOnline: boolean;
  isTyping?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const StatusIndicator = ({ 
  isOnline, 
  isTyping = false, 
  size = 'md', 
  className = '' 
}: StatusIndicatorProps) => {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <span className={`flex items-center gap-1 ${sizeClasses[size]} ${className}`}>
      <BsCircleFill 
        className={isOnline ? 'text-green-500' : 'text-gray-400'} 
      />
      {isTyping && <span className="italic text-gray-500">Escribiendo...</span>}
    </span>
  );
};

export default StatusIndicator;