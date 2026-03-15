'use client';

import * as React from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { addProduct, deleteProduct, updateProduct } from '@/app/actions/productActions';

interface Product {
  id: number;
  name: string;
  price: string;
  description: string;
  serial_no: string;
  model_no: string;
  ratio: string;
  images: string;
  created_at: string;
}

interface ProductManagerProps {
  initialProducts: Product[];
}

export function ProductManager({ initialProducts }: ProductManagerProps) {
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
  const [imageText, setImageText] = React.useState('');
  const [validationResults, setValidationResults] = React.useState<Record<string, 'valid' | 'invalid' | 'checking'>>({});
  const formRef = React.useRef<HTMLFormElement>(null);

  // Robust URL extraction regex
  const urlRegex = React.useMemo(() => /(https?:\/\/[^\s,;'"|<>]+)/g, []);

  const getDriveId = (url: string) => {
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/) || url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  };

  // React to imageText change for validation
  React.useEffect(() => {
    const urls = imageText.match(urlRegex) || [];
    const newResults = { ...validationResults };
    let changed = false;

    urls.forEach(url => {
      if (!newResults[url]) {
        newResults[url] = 'checking';
        changed = true;
        
        const id = getDriveId(url);
        if (!id) {
          newResults[url] = 'invalid';
          setValidationResults(prev => ({ ...prev, [url]: 'invalid' }));
          return;
        }

        // Ping the thumbnail endpoint
        const img = new Image();
        img.onload = () => {
          setValidationResults(prev => ({ ...prev, [url]: 'valid' }));
        };
        img.onerror = () => {
          setValidationResults(prev => ({ ...prev, [url]: 'invalid' }));
        };
        img.src = `https://drive.google.com/thumbnail?id=${id}&sz=w200`;
      }
    });

    if (changed) {
      setValidationResults(newResults);
    }
  }, [imageText, urlRegex]);

  // React to editingProduct change
  React.useEffect(() => {
    if (editingProduct) {
      try {
        const parsed = JSON.parse(editingProduct.images || '[]');
        setImageText(Array.isArray(parsed) ? parsed.join('\n') : '');
      } catch(e) {
        setImageText(editingProduct.images || '');
      }
    } else {
      setImageText('');
    }
  }, [editingProduct]);

  const urls = imageText.match(urlRegex) || [];
  const validCount = urls.filter(u => validationResults[u] === 'valid').length;
  const invalidCount = urls.filter(u => validationResults[u] === 'invalid').length;

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setImageText('');
    if (formRef.current) formRef.current.reset();
  };

  const handleSubmit = async (formData: FormData) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, formData);
      setEditingProduct(null);
    } else {
      await addProduct(formData);
    }
    setImageText('');
    if (formRef.current) formRef.current.reset();
  };

  return (
    <div>
      {/* Form Section */}
      <div style={{ background: 'var(--bg-primary)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'Playfair Display', color: 'var(--text-primary)', margin: 0 }}>
            {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Add New Product'}
          </h2>
          {editingProduct && (
            <button 
              onClick={cancelEdit}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', cursor: 'pointer' }}
            >
              <X size={16} /> Cancel Edit
            </button>
          )}
        </div>

        <form 
          ref={formRef}
          action={handleSubmit} 
          style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
        >
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>Product Name *</label>
            <input 
              type="text" 
              name="name" 
              required 
              defaultValue={editingProduct?.name || ''}
              key={editingProduct ? `edit-name-${editingProduct.id}` : 'add-name'}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} 
            />
          </div>
          <div style={{ flex: '0 0 150px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>Status / Price *</label>
            <input 
              type="text" 
              name="price" 
              required 
              defaultValue={editingProduct?.price || 'Contact for Pricing'}
              key={editingProduct ? `edit-price-${editingProduct.id}` : 'add-price'}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} 
            />
          </div>
          <div style={{ flex: '1 1 100%' }}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 120px' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>Serial No.</label>
                <input 
                  type="text" 
                  name="serial_no" 
                  defaultValue={editingProduct?.serial_no || ''}
                  key={editingProduct ? `edit-serial-${editingProduct.id}` : 'add-serial'}
                  placeholder="e.g. RK-2024-001" 
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} 
                />
              </div>
              <div style={{ flex: '1 1 120px' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>Model No.</label>
                <input 
                  type="text" 
                  name="model_no" 
                  defaultValue={editingProduct?.model_no || ''}
                  key={editingProduct ? `edit-model-${editingProduct.id}` : 'add-model'}
                  placeholder="e.g. NU-500" 
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} 
                />
              </div>
              <div style={{ flex: '1 1 120px' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>Ratio</label>
                <input 
                  type="text" 
                  name="ratio" 
                  defaultValue={editingProduct?.ratio || ''}
                  key={editingProduct ? `edit-ratio-${editingProduct.id}` : 'add-ratio'}
                  placeholder="e.g. 1:10" 
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} 
                />
              </div>
            </div>
          </div>
          <div style={{ flex: '1 1 100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0.5rem 0' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>Google Drive Image Links</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {validCount > 0 && (
                  <span style={{ fontSize: '0.7rem', color: '#22c55e', backgroundColor: 'rgba(34, 197, 94, 0.1)', padding: '2px 8px', borderRadius: '10px', border: '1px solid #22c55e' }}>
                    {validCount} Public
                  </span>
                )}
                {invalidCount > 0 && (
                  <span style={{ fontSize: '0.7rem', color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '2px 8px', borderRadius: '10px', border: '1px solid #ef4444' }}>
                    {invalidCount} Private/Broken
                  </span>
                )}
              </div>
            </div>
            <textarea 
              name="images" 
              rows={4} 
              value={imageText}
              onChange={(e) => setImageText(e.target.value)}
              placeholder="Paste multiple https://drive.google.com/... links here" 
              style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', resize: 'vertical', fontFamily: 'monospace', fontSize: '0.85rem' }}
            ></textarea>
            {invalidCount > 0 && (
              <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.5rem', fontWeight: 500 }}>
                ⚠️ Some links are private. Set sharing to "Anyone with the link" in Google Drive.
              </p>
            )}
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
              Paste as many links as you want. Each one will become a slide in the gallery.
            </p>
          </div>
          <div style={{ flex: '1 1 100%' }}>
            <label style={{ display: 'block', margin: '0.5rem 0', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>Detailed Description *</label>
            <textarea 
              name="description" 
              required 
              rows={4} 
              defaultValue={editingProduct?.description || ''}
              key={editingProduct ? `edit-desc-${editingProduct.id}` : 'add-desc'}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', resize: 'vertical' }}
            ></textarea>
          </div>
          <div style={{ width: '100%', marginTop: '1rem' }}>
            <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%' }}>
              {editingProduct ? <><Edit2 size={18} /> Update Machinery Entry</> : <><Plus size={18} /> Add Product to Database</>}
            </button>
          </div>
        </form>
      </div>

      {/* Live Data Table */}
      <div style={{ backgroundColor: 'var(--bg-primary)', borderRadius: '0.5rem', border: '1px solid var(--border-color)', overflow: 'hidden', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>ID</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Name</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Model / Serial</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Images</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Added On</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {initialProducts.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>No products in the database. Add one above!</td>
              </tr>
            ) : null}
            {initialProducts.map(p => {
              let imgCount = 0;
              try {
                const parsed = JSON.parse(p.images || '[]');
                imgCount = Array.isArray(parsed) ? parsed.length : 0;
              } catch(e) {
                // Fallback for messy data
                imgCount = (p.images?.match(/https?:\/\//g) || []).length;
              }
              
              return (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>#{String(p.id).padStart(4, '0')}</td>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>
                    {p.name}
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{p.price}</div>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                    <div><span style={{fontWeight:500}}>M:</span> {p.model_no || '-'}</div>
                    <div style={{fontSize:'0.85em', marginTop:'0.25rem'}}><span style={{fontWeight:500}}>S:</span> {p.serial_no || '-'}</div>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                    <span style={{ backgroundColor: imgCount > 1 ? 'rgba(212, 175, 55, 0.1)' : 'transparent', color: imgCount > 1 ? 'var(--accent-primary)' : 'inherit', padding: '2px 6px', borderRadius: '4px', fontWeight: imgCount > 1 ? 'bold' : 'normal' }}>
                      {imgCount} photo{imgCount !== 1 ? 's' : ''}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{new Date(p.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '1rem', justifyItems: 'flex-end', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => handleEdit(p)}
                        style={{ color: 'var(--accent-primary)', fontSize: '0.875rem', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        <Edit2 size={14} /> Edit
                      </button>
                      <form action={deleteProduct.bind(null, p.id)}>
                        <button type="submit" style={{ color: '#ef4444', fontSize: '0.875rem', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Trash2 size={14} /> Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
