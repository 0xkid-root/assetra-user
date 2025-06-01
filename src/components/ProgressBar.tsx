import React from 'react';

interface ProgressBarProps {
  progress: number;
  color?: 'blue' | 'green' | 'orange' | 'red';
  height?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = 'blue',
  height = 8,
}) => {
  const getColorClass = () => {
    switch (color) {
      case 'green':
        return 'bg-green-500';
      case 'orange':
        return 'bg-orange-500';
      case 'red':
        return 'bg-red-500';
      default:
        return 'bg-primary-600';
    }
  };

  return (
    <div 
      className="bg-gray-200 rounded-full overflow-hidden" 
      style={{ height: `${height}px` }}
    >
      <div
        className={`${getColorClass()} transition-all duration-500 ease-in-out rounded-full`}
        style={{
          width: `${progress}%`,
          height: '100%',
        }}
      />
    </div>
  );
};

export default ProgressBar;