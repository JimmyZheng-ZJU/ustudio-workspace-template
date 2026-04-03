import React, { useState } from 'react';

interface Column {
  key: string;
  title: string;
  width?: number;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  total?: number;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onSort?: (key: string) => void;
  onRowClick?: (row: any) => void;
  loading?: boolean;
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    background: 'rgba(10,15,28,0.92)',
    borderRadius: 10,
    overflow: 'hidden',
    color: '#fff',
    fontFamily: 'inherit',
    display: 'flex',
    flexDirection: 'column',
  },
  tableScroll: {
    overflowX: 'auto',
    flex: 1,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  thead: {
    background: 'rgba(255,255,255,0.04)',
  },
  th: {
    padding: '10px 14px',
    textAlign: 'left',
    fontSize: 12,
    fontWeight: 600,
    color: '#a0aabb',
    whiteSpace: 'nowrap',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    cursor: 'pointer',
    userSelect: 'none',
  },
  thInner: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
  },
  sortIndicator: {
    fontSize: 10,
    opacity: 0.7,
  },
  tdEven: {
    padding: '9px 14px',
    fontSize: 13,
    color: '#e0e6f0',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    background: 'rgba(255,255,255,0.01)',
    whiteSpace: 'nowrap',
  },
  tdOdd: {
    padding: '9px 14px',
    fontSize: 13,
    color: '#e0e6f0',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    background: 'rgba(255,255,255,0.03)',
    whiteSpace: 'nowrap',
  },
  centerState: {
    padding: '40px 0',
    textAlign: 'center',
    color: '#5a6680',
    fontSize: 14,
  },
  pagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
    padding: '10px 14px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    fontSize: 13,
    color: '#a0aabb',
  },
  pageBtn: {
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 5,
    color: '#c0cce0',
    padding: '3px 10px',
    cursor: 'pointer',
    fontSize: 13,
    transition: 'background 0.15s',
  },
  pageBtnDisabled: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: 5,
    color: '#3a4460',
    padding: '3px 10px',
    cursor: 'not-allowed',
    fontSize: 13,
  },
  pageNum: {
    background: 'rgba(90,130,255,0.18)',
    border: '1px solid rgba(90,130,255,0.3)',
    borderRadius: 5,
    color: '#7aadff',
    padding: '3px 10px',
    fontSize: 13,
    minWidth: 32,
    textAlign: 'center',
  },
};

const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  total,
  page = 1,
  pageSize = 10,
  onPageChange,
  onSort,
  onRowClick,
  loading = false,
}) => {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const totalPages = total !== undefined ? Math.ceil(total / pageSize) : Math.ceil(data.length / pageSize);
  const effectiveTotal = total !== undefined ? total : data.length;

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    onSort?.(key);
  };

  const renderCenter = (text: string) => (
    <tr>
      <td colSpan={columns.length} style={styles.centerState}>
        {text}
      </td>
    </tr>
  );

  return (
    <div style={styles.wrapper}>
      <div style={styles.tableScroll}>
        <table style={styles.table}>
          <thead style={styles.thead}>
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  style={{ ...styles.th, width: col.width }}
                  onClick={() => handleSort(col.key)}
                >
                  <span style={styles.thInner}>
                    {col.title}
                    <span style={styles.sortIndicator}>
                      {sortKey === col.key ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
                    </span>
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading
              ? renderCenter('加载中...')
              : data.length === 0
              ? renderCenter('暂无数据')
              : data.map((row, rowIdx) => (
                  <tr
                    key={rowIdx}
                    style={{
                      cursor: onRowClick ? 'pointer' : 'default',
                      background:
                        hoveredRow === rowIdx
                          ? 'rgba(90,130,255,0.12)'
                          : rowIdx % 2 === 0
                          ? 'rgba(255,255,255,0.01)'
                          : 'rgba(255,255,255,0.03)',
                      transition: 'background 0.12s',
                    }}
                    onMouseEnter={() => setHoveredRow(rowIdx)}
                    onMouseLeave={() => setHoveredRow(null)}
                    onClick={() => onRowClick?.(row)}
                  >
                    {columns.map(col => (
                      <td
                        key={col.key}
                        style={rowIdx % 2 === 0 ? styles.tdEven : styles.tdOdd}
                      >
                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={styles.pagination}>
        <span>共 {effectiveTotal} 条</span>
        <button
          style={page <= 1 ? styles.pageBtnDisabled : styles.pageBtn}
          disabled={page <= 1}
          onClick={() => page > 1 && onPageChange?.(page - 1)}
        >
          &lt;
        </button>
        <span style={styles.pageNum}>{page}</span>
        <button
          style={page >= totalPages ? styles.pageBtnDisabled : styles.pageBtn}
          disabled={page >= totalPages}
          onClick={() => page < totalPages && onPageChange?.(page + 1)}
        >
          &gt;
        </button>
        <span>共 {totalPages} 页</span>
      </div>
    </div>
  );
};

export default DataTable;
