import React from 'react';

export interface CheckItem {
  id: string;
  name: string;
  checkPoints: string[];
  status: 'unchecked' | 'pass' | 'fail';
  remark?: string;
}

interface ChecklistProps {
  items: CheckItem[];
  onItemChange: (id: string, status: 'pass' | 'fail', remark?: string) => void;
}

const borderColorMap: Record<CheckItem['status'], string> = {
  unchecked: 'rgba(255,255,255,0.15)',
  pass: '#4caf50',
  fail: '#f44336',
};

const Checklist: React.FC<ChecklistProps> = ({ items, onItemChange }) => {
  const [remarks, setRemarks] = React.useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    items.forEach((item) => {
      if (item.remark) init[item.id] = item.remark;
    });
    return init;
  });

  const handleRemarkChange = (id: string, value: string) => {
    setRemarks((prev) => ({ ...prev, [id]: value }));
    // propagate remark update for fail items immediately
    const item = items.find((i) => i.id === id);
    if (item && item.status === 'fail') {
      onItemChange(id, 'fail', value);
    }
  };

  const handleStatus = (id: string, status: 'pass' | 'fail') => {
    const remark = remarks[id];
    onItemChange(id, status, remark);
  };

  const btnBase: React.CSSProperties = {
    padding: '4px 14px',
    borderRadius: 4,
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background 0.15s, color 0.15s',
    border: '1px solid transparent',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {items.map((item) => {
        const isPass = item.status === 'pass';
        const isFail = item.status === 'fail';

        return (
          <div
            key={item.id}
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${borderColorMap[item.status]}`,
              borderRadius: 8,
              padding: '12px 14px',
              transition: 'border-color 0.2s',
            }}
          >
            {/* Item name */}
            <div style={{ fontWeight: 600, fontSize: 14, color: 'rgba(255,255,255,0.9)', marginBottom: 6 }}>
              {item.name}
            </div>

            {/* Check points */}
            {item.checkPoints.length > 0 && (
              <ul style={{ margin: '0 0 10px 0', paddingLeft: 16, listStyle: 'disc' }}>
                {item.checkPoints.map((pt, i) => (
                  <li key={i} style={{ fontSize: 11, color: '#888', lineHeight: 1.7 }}>
                    {pt}
                  </li>
                ))}
              </ul>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 8 }}>
              {/* Pass button */}
              <button
                onClick={() => handleStatus(item.id, 'pass')}
                style={{
                  ...btnBase,
                  background: isPass ? '#4caf50' : 'transparent',
                  color: isPass ? '#fff' : '#4caf50',
                  borderColor: '#4caf50',
                }}
              >
                ✓ 合格
              </button>

              {/* Fail button */}
              <button
                onClick={() => handleStatus(item.id, 'fail')}
                style={{
                  ...btnBase,
                  background: isFail ? '#f44336' : 'transparent',
                  color: isFail ? '#fff' : '#f44336',
                  borderColor: '#f44336',
                }}
              >
                ✕ 不合格
              </button>
            </div>

            {/* Remark input — shown only when fail */}
            {isFail && (
              <input
                type="text"
                placeholder="请填写不合格备注..."
                value={remarks[item.id] ?? ''}
                onChange={(e) => handleRemarkChange(item.id, e.target.value)}
                style={{
                  marginTop: 10,
                  width: '100%',
                  boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(244,67,54,0.5)',
                  borderRadius: 4,
                  padding: '6px 10px',
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.85)',
                  outline: 'none',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Checklist;
