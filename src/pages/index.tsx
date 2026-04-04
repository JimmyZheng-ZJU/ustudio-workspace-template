/**
 * 业务面板主页面
 *
 * 这个页面会被嵌入到 GongVue 的右侧 Tab 面板中（iframe）。
 * 通过 gongvueBridge 和 useGongVue 与 3D 场景联动。
 *
 * AI Agent 会在这里生成具体的业务组件。
 */

export default function IndexPage() {
  return (
    <div style={{ padding: 16, color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      <h2 style={{ margin: '0 0 8px', fontSize: 16 }}>业务面板</h2>
      <p style={{ fontSize: 13, color: '#888' }}>AI 将在此生成具体的业务功能。</p>
    </div>
  );
}
