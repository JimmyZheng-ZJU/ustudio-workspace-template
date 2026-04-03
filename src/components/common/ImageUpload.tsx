import React, { useRef, useState } from 'react';

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxCount?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, maxCount = 9 }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleAddClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploads = Array.from(files).slice(0, maxCount - value.length);
      const newUrls: string[] = [];

      for (const file of uploads) {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
        const data = await res.json();
        const url: string = data.url ?? data.path ?? data.data?.url ?? '';
        if (url) newUrls.push(url);
      }

      onChange([...value, ...newUrls]);
    } catch (err) {
      console.error('Image upload error:', err);
    } finally {
      setUploading(false);
      // reset so same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = value.filter((_, i) => i !== index);
    onChange(next);
  };

  const thumbnailStyle: React.CSSProperties = {
    width: 80,
    height: 80,
    borderRadius: 6,
    objectFit: 'cover',
    display: 'block',
    cursor: 'pointer',
  };

  const wrapperStyle: React.CSSProperties = {
    position: 'relative',
    width: 80,
    height: 80,
    flexShrink: 0,
  };

  const deleteBtnStyle: React.CSSProperties = {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 18,
    height: 18,
    borderRadius: '50%',
    background: 'rgba(0,0,0,0.75)',
    color: '#fff',
    fontSize: 11,
    fontWeight: 700,
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1,
    padding: 0,
    zIndex: 1,
  };

  const canAddMore = value.length < maxCount;

  return (
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {value.map((url, index) => (
          <div key={index} style={wrapperStyle}>
            <img
              src={url}
              alt={`upload-${index}`}
              style={thumbnailStyle}
              onClick={() => setPreview(url)}
            />
            <button
              style={deleteBtnStyle}
              onClick={(e) => handleDelete(index, e)}
              title="删除"
            >
              ✕
            </button>
          </div>
        ))}

        {/* Add button */}
        {canAddMore && (
          <button
            onClick={handleAddClick}
            disabled={uploading}
            style={{
              width: 80,
              height: 80,
              borderRadius: 6,
              border: '1.5px dashed rgba(255,255,255,0.25)',
              background: 'rgba(255,255,255,0.05)',
              color: uploading ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.5)',
              fontSize: 24,
              cursor: uploading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'border-color 0.15s, color 0.15s',
            }}
            title="添加图片"
          >
            {uploading ? '…' : '+'}
          </button>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={maxCount - value.length > 1}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>

      {/* Full-size preview overlay */}
      {preview && (
        <div
          onClick={() => setPreview(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            cursor: 'zoom-out',
          }}
        >
          <img
            src={preview}
            alt="preview"
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              borderRadius: 8,
              boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
              objectFit: 'contain',
            }}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setPreview(null)}
            style={{
              position: 'fixed',
              top: 20,
              right: 24,
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              color: '#fff',
              fontSize: 22,
              width: 36,
              height: 36,
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
};

export default ImageUpload;
