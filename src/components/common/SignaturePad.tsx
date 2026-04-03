import React, { useRef, useEffect, useState, useCallback } from 'react';

interface SignaturePadProps {
  onSave: (dataUrl: string) => void;
}

const SignaturePad: React.FC<SignaturePadProps> = ({ onSave }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDrawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  // Resize canvas to match container width while preserving drawn content
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = window.devicePixelRatio || 1;
    const width = container.clientWidth;
    const height = 120;

    // Save existing drawing
    const snapshot = canvas.toDataURL();

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Restore snapshot (best-effort; canvas was already cleared by resize)
    if (!isEmpty) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, width, height);
      img.src = snapshot;
    }
  }, [isEmpty]);

  useEffect(() => {
    resizeCanvas();
    const observer = new ResizeObserver(resizeCanvas);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [resizeCanvas]);

  // Coordinate helpers
  const getPos = (e: MouseEvent | TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      const touch = e.touches[0];
      return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    }
    return { x: (e as MouseEvent).clientX - rect.left, y: (e as MouseEvent).clientY - rect.top };
  };

  const getCtx = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    return { canvas, ctx };
  };

  const startDraw = useCallback((e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    const pair = getCtx();
    if (!pair) return;
    isDrawing.current = true;
    const pos = getPos(e, pair.canvas);
    lastPos.current = pos;
    // Dot for single tap/click
    pair.ctx.beginPath();
    pair.ctx.arc(pos.x, pos.y, 1, 0, Math.PI * 2);
    pair.ctx.fillStyle = '#222';
    pair.ctx.fill();
    setIsEmpty(false);
  }, []);

  const draw = useCallback((e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    if (!isDrawing.current) return;
    const pair = getCtx();
    if (!pair || !lastPos.current) return;
    const pos = getPos(e, pair.canvas);
    pair.ctx.beginPath();
    pair.ctx.moveTo(lastPos.current.x, lastPos.current.y);
    pair.ctx.lineTo(pos.x, pos.y);
    pair.ctx.stroke();
    lastPos.current = pos;
  }, []);

  const endDraw = useCallback(() => {
    isDrawing.current = false;
    lastPos.current = null;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', endDraw);
    canvas.addEventListener('mouseleave', endDraw);
    canvas.addEventListener('touchstart', startDraw, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', endDraw);

    return () => {
      canvas.removeEventListener('mousedown', startDraw);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', endDraw);
      canvas.removeEventListener('mouseleave', endDraw);
      canvas.removeEventListener('touchstart', startDraw);
      canvas.removeEventListener('touchmove', draw);
      canvas.removeEventListener('touchend', endDraw);
    };
  }, [startDraw, draw, endDraw]);

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    setIsEmpty(true);
  };

  const handleConfirm = () => {
    const canvas = canvasRef.current;
    if (!canvas || isEmpty) return;
    onSave(canvas.toDataURL('image/png'));
  };

  return (
    <div>
      {/* Canvas wrapper */}
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          borderRadius: 8,
          border: '1.5px dashed rgba(255,255,255,0.3)',
          overflow: 'hidden',
          background: '#fff',
          height: 120,
          cursor: 'crosshair',
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ display: 'block' }}
        />
        {/* Placeholder text */}
        {isEmpty && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
              color: 'rgba(0,0,0,0.25)',
              fontSize: 14,
              userSelect: 'none',
            }}
          >
            请在此处签名
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
        <button
          onClick={handleClear}
          style={{
            padding: '6px 18px',
            borderRadius: 4,
            border: '1px solid rgba(255,255,255,0.25)',
            background: 'transparent',
            color: 'rgba(255,255,255,0.7)',
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          清除
        </button>
        <button
          onClick={handleConfirm}
          disabled={isEmpty}
          style={{
            padding: '6px 18px',
            borderRadius: 4,
            border: 'none',
            background: isEmpty ? 'rgba(79,195,247,0.3)' : '#4fc3f7',
            color: isEmpty ? 'rgba(255,255,255,0.4)' : '#fff',
            fontSize: 13,
            fontWeight: 600,
            cursor: isEmpty ? 'not-allowed' : 'pointer',
            transition: 'background 0.15s',
          }}
        >
          确认签名
        </button>
      </div>
    </div>
  );
};

export default SignaturePad;
