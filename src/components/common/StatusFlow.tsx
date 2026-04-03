import React from 'react';

interface StatusFlowProps {
  steps: string[];
  currentStep: number;
}

const StatusFlow: React.FC<StatusFlowProps> = ({ steps, currentStep }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', padding: '8px 0' }}>
      {steps.map((label, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isLast = index === steps.length - 1;

        const circleBg = isCompleted
          ? '#4caf50'
          : isCurrent
          ? '#4fc3f7'
          : 'rgba(255,255,255,0.1)';

        const circleColor = isCompleted || isCurrent ? '#fff' : 'rgba(255,255,255,0.4)';

        const lineColor = isCompleted ? '#4caf50' : 'rgba(255,255,255,0.15)';

        return (
          <div
            key={index}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: isLast ? '0 0 auto' : 1 }}
          >
            {/* Circle + connector line row */}
            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              {/* Circle */}
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: circleBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: 12,
                  fontWeight: 600,
                  color: circleColor,
                  transition: 'background 0.2s',
                }}
              >
                {isCompleted ? (
                  // Checkmark SVG
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="#fff"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>

              {/* Connector line (not after last step) */}
              {!isLast && (
                <div
                  style={{
                    flex: 1,
                    height: 2,
                    background: lineColor,
                    transition: 'background 0.2s',
                  }}
                />
              )}
            </div>

            {/* Label */}
            <div
              style={{
                marginTop: 6,
                fontSize: 11,
                color: isCompleted || isCurrent ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.4)',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                maxWidth: 72,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatusFlow;
