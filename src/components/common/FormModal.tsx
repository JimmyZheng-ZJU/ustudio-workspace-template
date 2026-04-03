import React, { useState } from 'react';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'date';
  options?: { label: string; value: string }[];
  required?: boolean;
  placeholder?: string;
}

interface FormModalProps {
  title: string;
  fields: FormField[];
  initialValues?: Record<string, any>;
  onSubmit: (values: Record<string, any>) => void;
  onClose: () => void;
}

const inputBase: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 6,
  color: '#e0e6f0',
  fontSize: 13,
  padding: '8px 10px',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
};

const FormModal: React.FC<FormModalProps> = ({
  title,
  fields,
  initialValues = {},
  onSubmit,
  onClose,
}) => {
  const [values, setValues] = useState<Record<string, any>>(() => {
    const init: Record<string, any> = {};
    fields.forEach(f => {
      init[f.name] = initialValues[f.name] ?? '';
    });
    return init;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleChange = (name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    fields.forEach(f => {
      if (f.required && (values[f.name] === '' || values[f.name] == null)) {
        newErrors[f.name] = `${f.label} 不能为空`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onSubmit(values);
  };

  const renderInput = (field: FormField) => {
    const isFocused = focusedField === field.name;
    const focusStyle: React.CSSProperties = isFocused
      ? { borderColor: 'rgba(90,130,255,0.5)', background: 'rgba(255,255,255,0.08)' }
      : {};

    if (field.type === 'select') {
      return (
        <select
          value={values[field.name]}
          onChange={e => handleChange(field.name, e.target.value)}
          onFocus={() => setFocusedField(field.name)}
          onBlur={() => setFocusedField(null)}
          style={{
            ...inputBase,
            ...focusStyle,
            appearance: 'none',
            WebkitAppearance: 'none',
          }}
        >
          <option value="" style={{ background: '#1a1f30' }}>
            {field.placeholder || '请选择'}
          </option>
          {field.options?.map(opt => (
            <option key={opt.value} value={opt.value} style={{ background: '#1a1f30' }}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }

    if (field.type === 'textarea') {
      return (
        <textarea
          value={values[field.name]}
          placeholder={field.placeholder}
          rows={3}
          onChange={e => handleChange(field.name, e.target.value)}
          onFocus={() => setFocusedField(field.name)}
          onBlur={() => setFocusedField(null)}
          style={{ ...inputBase, ...focusStyle, resize: 'vertical', minHeight: 72 }}
        />
      );
    }

    return (
      <input
        type={field.type}
        value={values[field.name]}
        placeholder={field.placeholder}
        onChange={e => handleChange(field.name, e.target.value)}
        onFocus={() => setFocusedField(field.name)}
        onBlur={() => setFocusedField(null)}
        style={{ ...inputBase, ...focusStyle }}
      />
    );
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        pointerEvents: 'auto',
      }}
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: 'rgba(20,25,40,0.98)',
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.1)',
          width: 460,
          maxWidth: '92vw',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <span style={{ color: '#e0e6f0', fontSize: 15, fontWeight: 600 }}>{title}</span>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#5a6680',
              fontSize: 20,
              cursor: 'pointer',
              lineHeight: 1,
              padding: '0 4px',
            }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '16px 20px', overflowY: 'auto', flex: 1 }}>
          {fields.map(field => (
            <div key={field.name} style={{ marginBottom: 14 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 12,
                  color: '#8a9ab8',
                  marginBottom: 5,
                  fontWeight: 500,
                }}
              >
                {field.required && (
                  <span style={{ color: '#ff5a5a', marginRight: 3 }}>*</span>
                )}
                {field.label}
              </label>
              {renderInput(field)}
              {errors[field.name] && (
                <div style={{ color: '#ff5a5a', fontSize: 11, marginTop: 3 }}>
                  {errors[field.name]}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 10,
            padding: '12px 20px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 6,
              color: '#a0aabb',
              padding: '7px 18px',
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            style={{
              background: 'rgba(90,130,255,0.8)',
              border: '1px solid rgba(90,130,255,0.5)',
              borderRadius: 6,
              color: '#fff',
              padding: '7px 18px',
              fontSize: 13,
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            确认
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormModal;
