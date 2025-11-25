import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { createProduct } from '../api/product'

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


  async function onSubmit() {
    setError(null)
    // const base = import.meta.env.VITE_PRODUCTS_API_URL || import.meta.env.VITE_API_URL || 'https://x8ki-letl-twmt.n7.xano.io/api:UJ0_Qj9c'
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

      // Verificar que todos los archivos sean instancias de File
      const validFiles = files.filter(file => file instanceof File)
      if (validFiles.length === 0) {
        setError('Los archivos seleccionados no son válidos')
        setSaving(false)
        return
      }

      // Crear el payload con los archivos File[] directamente
      // createProduct ahora manejará el FormData internamente
      const xanoPayload = {
        name: parsed.data.name,
        description: parsed.data.description || '',
        price: Number(parsed.data.price),
        stock: Number(parsed.data.stock),
        brand: parsed.data.brand,
        category: parsed.data.category,
        images: validFiles, // Array de archivos File[] para enviar en FormData
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
      
      // Mostrar el mensaje de error completo del servidor
      let msg = 'No se pudo crear el producto'
      if (payload) {
        // Intentar extraer el mensaje de error de diferentes formatos posibles
        if (typeof payload === 'string') {
          msg = payload
        } else if (payload.message) {
          msg = payload.message
        } else if (payload.error) {
          msg = typeof payload.error === 'string' ? payload.error : JSON.stringify(payload.error)
        } else if (payload.msg) {
          msg = payload.msg
        } else {
          // Mostrar el objeto completo como string para debug
          msg = `Error: ${JSON.stringify(payload, null, 2)}`
        }
      } else if (e?.message) {
        msg = e.message
      }
      
      console.error('[AdminProductoNuevo] Error completo:', { status, url, payload, error: e })
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