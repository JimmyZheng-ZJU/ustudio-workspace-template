import { useContext } from 'react';
import { ViewerContext } from '../core/ViewerContext';

export default function IndexPage() {
  const { viewer, loading, error } = useContext(ViewerContext);

  if (loading) return <div style={{ color: 'white', padding: 20 }}>场景加载中...</div>;
  if (error) return <div style={{ color: 'red', padding: 20 }}>加载失败: {error.message}</div>;

  // viewer 已就绪，这里的 facade 函数都能正常工作
  return <div>业务组件</div>;
}
