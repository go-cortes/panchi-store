import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { uploadImages as xUploadImages, createProduct } from '../api/products'

const schema = z.object({
  name: z.string().min(2, 'Nombre requerido'),
  description: z.string().optional().default(''),
  price: z.coerce.number().min(0, 'Precio inválido'),
  stock: z.coerce.number().int().min(0, 'Stock inválido'),
  brand: z.string().min(2, 'Marca requerida'),
  category: z.string().min(2, 'Categoría requerida'),
})

const categorias = ['alimentos', 'juguetes', 'higiene', 'salud', 'accesorios']

function AdminProductoNuevo() {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [files, setFiles] = useState([])
  const [previews, setPreviews] = useState([])

  const { register, handleSubmit, formState: { errors }, getValues, reset } = useForm({
    defaultValues: { name: '', description: '', price: 0, stock: 0, brand: '', category: '' },
  })

  useEffect(() => {
    // Crear y limpiar object URLs para las previsualizaciones
    const urls = files.map((f) => URL.createObjectURL(f))
    setPreviews(urls)
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u))
    }
  }, [files])

  function handleFilesChange(e) {
    const list = Array.from(e.target.files || [])
    setFiles(list)
  }

  async function uploadImages(list, base) {
    // Usa el helper centralizado que habla con Xano
    try {
      return await xUploadImages(list)
    } catch (e) {
      console.error('Upload falló', e)
      return []
    }
  }

  async function onSubmit() {
    setError(null)
    // const base = import.meta.env.VITE_PRODUCTS_API_URL || import.meta.env.VITE_API_URL || 'https://x8ki-letl-twmt.n7.xano.io/api:tP1BBSGu'
    try {
      setSaving(true)
      const values = getValues()
      const parsed = schema.safeParse(values)
      if (!parsed.success) {
        setError('Revisa los campos del formulario')
        setSaving(false)
        return
      }

      // Validar que haya al menos una imagen
      if (!files || files.length === 0) {
        setError('Debes agregar al menos una imagen al producto')
        setSaving(false)
        return
      }

      const uploadedImages = await uploadImages(files)
      
      // Validar que al menos una imagen se haya subido correctamente
      if (!uploadedImages || uploadedImages.length === 0) {
        setError('No se pudieron subir las imágenes. Por favor, intenta de nuevo.')
        setSaving(false)
        return
      }

      // Validar que tengamos los objetos XanoImage completos
      if (uploadedImages.length === 0) {
        setError('No se pudieron obtener las imágenes subidas.')
        setSaving(false)
        return
      }

      // Xano espera recibir los objetos completos de imagen, no solo los paths
      // Cada objeto debe tener: access, path, name, type, size, mime, meta
      const imagesForXano = uploadedImages.map(img => {
        // Si ya es un objeto completo, usarlo tal cual
        if (img && typeof img === 'object' && img.path) {
          return {
            access: img.access || 'public',
            path: img.path,
            name: img.name || img.path.split('/').pop() || 'image.jpg',
            type: img.type || 'image',
            size: img.size || 0,
            mime: img.mime || 'image/jpeg',
            meta: img.meta || {}
          }
        }
        // Si es solo un path, construir el objeto mínimo
        if (typeof img === 'string' && img) {
          return {
            access: 'public',
            path: img,
            name: img.split('/').pop() || 'image.jpg',
            type: 'image',
            size: 0,
            mime: 'image/jpeg',
            meta: {}
          }
        }
        return null
      }).filter(Boolean)

      if (imagesForXano.length === 0) {
        setError('No se pudieron procesar las imágenes subidas.')
        setSaving(false)
        return
      }

      const xanoPayload = {
        name: parsed.data.name,
        description: parsed.data.description || '',
        price: Number(parsed.data.price),
        stock: Number(parsed.data.stock),
        brand: parsed.data.brand,
        category: parsed.data.category,
        images: imagesForXano, // Array de objetos XanoImage completos
      }

      let created = null
      try {
        created = await createProduct(xanoPayload)
      } catch (e) {
        throw e
      }

      reset()
      setFiles([])
      navigate('/admin/productos', { replace: true })
    } catch (e) {
      const status = e?.status || e?.response?.status
      const url = e?.config?.url
      const payload = e?.data || e?.response?.data
      console.error('Error creando producto', { status, url, payload, error: e })
      const msg = payload?.message || e?.message || 'No se pudo crear el producto'
      setError(msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container py-5 mt-5" style={{ maxWidth: 900 }}>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h1 className="mb-0" style={{ color: '#8B4513' }}>Nuevo Producto</h1>
        <Link to="/admin/productos" className="btn btn-outline-secondary">Volver</Link>
      </div>

      {error && <div className="alert alert-warning">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="card shadow-lg">
        <div className="card-body p-4">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-bold">Nombre</label>
              <input type="text" className={`form-control ${errors.name ? 'is-invalid' : ''}`} {...register('name')} />
              {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Marca</label>
              <input type="text" className={`form-control ${errors.brand ? 'is-invalid' : ''}`} {...register('brand')} />
              {errors.brand && <div className="invalid-feedback">{errors.brand.message}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">Categoría</label>
              <select className={`form-select ${errors.category ? 'is-invalid' : ''}`} {...register('category')}>
                <option value="">Selecciona una categoría</option>
                {categorias.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <div className="invalid-feedback">{errors.category.message}</div>}
            </div>
            <div className="col-md-3">
              <label className="form-label fw-bold">Precio</label>
              <input type="number" step="0.01" className={`form-control ${errors.price ? 'is-invalid' : ''}`} {...register('price')} />
              {errors.price && <div className="invalid-feedback">{errors.price.message}</div>}
            </div>
            <div className="col-md-3">
              <label className="form-label fw-bold">Stock</label>
              <input type="number" className={`form-control ${errors.stock ? 'is-invalid' : ''}`} {...register('stock')} />
              {errors.stock && <div className="invalid-feedback">{errors.stock.message}</div>}
            </div>

            <div className="col-12">
              <label className="form-label fw-bold">Descripción</label>
              <textarea rows={4} className={`form-control ${errors.description ? 'is-invalid' : ''}`} {...register('description')}></textarea>
              {errors.description && <div className="invalid-feedback">{errors.description.message}</div>}
            </div>

            <div className="col-12">
              <label className="form-label fw-bold">Imágenes (puedes seleccionar varias)</label>
              <input id="imagesInput" type="file" className="form-control" multiple accept="image/*" onChange={handleFilesChange} />
              {previews.length > 0 && (
                <div className="row g-3 mt-2">
                  {previews.map((src, idx) => (
                    <div key={idx} className="col-6 col-md-4">
                      <img src={src} alt={`preview-${idx}`} className="img-thumbnail" style={{ height: 140, objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="card-footer d-flex justify-content-end gap-2">
          <Link to="/admin/productos" className="btn btn-outline-secondary">Cancelar</Link>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-plus-circle me-2"></i>}
            Crear producto
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminProductoNuevo