import { Link, useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import api, { apiUpload } from '../api/api'
import { buildImageUrl } from '../utils/imageUtils'

const schema = z.object({
  name: z.string().min(2, 'Nombre requerido'),
  description: z.string().optional().default(''),
  price: z.coerce.number().min(0, 'Precio inválido'),
  stock: z.coerce.number().int().min(0, 'Stock inválido'),
  brand: z.string().min(2, 'Marca requerida'),
  category: z.string().min(2, 'Categoría requerida'),
}).refine((data) => data, {
  message: 'Datos inválidos',
})

const categorias = ['alimentos', 'juguetes', 'higiene', 'salud', 'accesorios']

function AdminProductoEditar() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [imageUrls, setImageUrls] = useState(['']) // Array de URLs de imágenes

  const { register, handleSubmit, setError: setFieldError, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      brand: '',
      category: '',
    },
  })

  async function cargar() {
    setLoading(true)
    setError(null)
    try {
      if (import.meta.env.DEV) {
        console.info('[AdminProductoEditar] base:', api.defaults.baseURL, 'trying GET /product/:id')
      }
      const res = await api.get(`/product/${id}`) // Endpoint singular (API UJ0_Qj9c)
      const p = res.data?.data ?? res.data
      const name = p?.name ?? p?.nombre ?? ''
      const description = p?.description ?? p?.descripcion ?? ''
      const price = Number(p?.price ?? 0)
      const stock = Number(p?.stock ?? 0)
      const brand = p?.brand ?? p?.marca ?? ''
      const category = p?.category ?? p?.categoria ?? ''
      const imagesArr = Array.isArray(p?.image)
        ? p.image.map((img) => {
            const path = typeof img === 'string' ? img : (img?.url || img?.path || '')
            return buildImageUrl(path)
          })
        : (Array.isArray(p?.images) 
            ? p.images.map((img) => {
                const path = typeof img === 'string' ? img : (img?.url || img?.path || '')
                return buildImageUrl(path)
              })
            : (p?.imagen ? [buildImageUrl(p.imagen)] : []))
      const validImages = imagesArr.filter(Boolean)
      reset({ name, description, price, stock, brand, category })
      setImageUrls(validImages.length > 0 ? validImages : ['']) // Inicializar con imágenes existentes o un campo vacío
    } catch (e) {
      if (import.meta.env.DEV) {
        const status = e?.response?.status
        console.error('[AdminProductoEditar] Error al cargar producto:', { status, error: e })
      }
      setError('No se pudo cargar el producto')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargar()
  }, [id])

  // Funciones para manejar URLs de imágenes dinámicamente
  function agregarCampoImagen() {
    setImageUrls([...imageUrls, ''])
  }

  function eliminarCampoImagen(index) {
    if (imageUrls.length > 1) {
      const nuevas = imageUrls.filter((_, i) => i !== index)
      setImageUrls(nuevas)
    }
  }

  function actualizarUrlImagen(index, url) {
    const nuevas = [...imageUrls]
    nuevas[index] = url
    setImageUrls(nuevas)
  }

  async function onSubmit(values) {
    // Validar que haya al menos una imagen
    const validImages = imageUrls.filter(url => url.trim() !== '')
    if (validImages.length === 0) {
      setError('Debes agregar al menos una imagen al producto')
      return
    }

    const parsed = schema.safeParse(values)
    if (!parsed.success) {
      parsed.error.issues.forEach(({ path, message }) => {
        const field = path?.[0]
        if (typeof field === 'string') {
          setFieldError(field, { type: 'zod', message })
        }
      })
      return
    }

    setSaving(true)
    setError(null)
    try {
      const payload = {
        name: parsed.data.name,
        description: parsed.data.description || '',
        price: Number(parsed.data.price ?? 0),
        stock: Number(parsed.data.stock ?? 0),
        brand: parsed.data.brand,
        category: parsed.data.category,
        images: validImages, // Enviar array de URLs válidas
      }
      // Endpoint singular (API UJ0_Qj9c): PATCH /product/{product_id}
      if (import.meta.env.DEV) {
        console.info('[AdminProductoEditar] PATCH /product/:id on base:', api.defaults.baseURL)
      }
      await api.patch(`/product/${id}`, payload) // Endpoint singular (API UJ0_Qj9c)
      navigate('/admin/productos', { replace: true })
    } catch (e) {
      setError('No se pudo guardar los cambios')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container py-5 mt-5">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h1 className="mb-0" style={{ color: '#8B4513' }}>Editar Producto #{id}</h1>
        <Link to="/admin/productos" className="btn btn-outline-secondary">Volver</Link>
      </div>

      {loading && (<div className="text-center text-muted"><div className="spinner-border" role="status"></div></div>)}
      {error && (<div className="alert alert-danger">{error}</div>)}

      {!loading && !error && (
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
                  <option value="">Selecciona...</option>
                  {categorias.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.category && <div className="invalid-feedback">{errors.category.message}</div>}
              </div>
              <div className="col-md-3">
                <label className="form-label fw-bold">Precio (CLP)</label>
                <input type="number" min="0" className={`form-control ${errors.price ? 'is-invalid' : ''}`} {...register('price')} />
                {errors.price && <div className="invalid-feedback">{errors.price.message}</div>}
              </div>
              <div className="col-md-3">
                <label className="form-label fw-bold">Stock</label>
                <input type="number" min="0" className={`form-control ${errors.stock ? 'is-invalid' : ''}`} {...register('stock')} />
                {errors.stock && <div className="invalid-feedback">{errors.stock.message}</div>}
              </div>

              <div className="col-12">
                <label className="form-label fw-bold">Descripción</label>
                <textarea rows={4} className={`form-control ${errors.description ? 'is-invalid' : ''}`} {...register('description')}></textarea>
                {errors.description && <div className="invalid-feedback">{errors.description.message}</div>}
              </div>

              <div className="col-12">
                <label className="form-label fw-bold">Imágenes (URLs)</label>
                {imageUrls.map((url, index) => (
                  <div key={index} className="input-group mb-2">
                    <input
                      type="url"
                      className="form-control"
                      placeholder={`URL de imagen ${index + 1}`}
                      value={url}
                      onChange={(e) => actualizarUrlImagen(index, e.target.value)}
                    />
                    {imageUrls.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => eliminarCampoImagen(index)}
                        title="Eliminar imagen"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                  onClick={agregarCampoImagen}
                >
                  <i className="bi bi-plus-circle me-1"></i>
                  Agregar otra imagen
                </button>
                <small className="form-text text-muted d-block mt-2">
                  Agrega al menos una URL de imagen válida
                </small>
              </div>
            </div>
          </div>
          <div className="card-footer d-flex justify-content-end gap-2">
            <Link to="/admin/productos" className="btn btn-outline-secondary">Cancelar</Link>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-save me-2"></i>}
              Guardar cambios
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default AdminProductoEditar