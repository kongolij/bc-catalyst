'use client';

import { useState } from 'react';

interface TooltipProps {
  className?: string;
  triggerText: string;
  tooltipContent: string;
  triggerColor: string;
  tooltipBgColor: string;
  tooltipTextColor: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  zIndex: number;
  maxWidth: number;
}

const positionClasses: Record<TooltipProps['position'], string> = {
  top: 'bottom-full left-0 mb-2',
  bottom: 'top-full left-0 mt-2',
  left: 'right-full top-0 mr-2',
  right: 'left-full top-0 ml-2',
};

export function MSTooltip({
  className,
  triggerText = 'Hover me',
  tooltipContent = 'Tooltip content',
  triggerColor = '#dc2626',
  tooltipBgColor = '#fff',
  tooltipTextColor = '#000',
  position = 'top',
  zIndex = 9999,
  maxWidth = 180,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className={`relative inline-block ${className ?? ''}`}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <span className="cursor-pointer underline" style={{ color: triggerColor }}>
        {triggerText}
      </span>

      {visible && (
        <div
          className={`absolute rounded px-3 py-2 text-sm shadow-lg ${positionClasses[position]}`}
          style={{
            backgroundColor: tooltipBgColor,
            color: tooltipTextColor,
            zIndex,
            maxWidth: `${maxWidth}px`,
            wordWrap: 'break-word',
          }}
        >
          {tooltipContent}
        </div>
      )}
    </div>
  );
}
