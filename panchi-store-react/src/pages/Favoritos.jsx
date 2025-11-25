import { useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import { useFavoritesStore } from '../stores/favoritesStore'
import { useCartStore } from '../stores/cartStore'

function Favoritos() {
  const { list, fetch, remove } = useFavoritesStore()
  const { add } = useCartStore()

  useEffect(() => {
    fetch().catch(() => {})
  }, [])

  function handleAddToCart(prod) {
    add(prod.id, 1).catch(() => {})
  }
  function handleRemove(prod) {
    remove(prod.id).catch(() => {})
  }

  return (
    <div className="container py-5 mt-5">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h1 className="mb-0" style={{ color: '#8B4513' }}>Favoritos</h1>
      </div>

      {list.length === 0 ? (
        <div className="text-center text-muted py-5">
          <i className="bi bi-heart fs-1 d-block mb-3" style={{ color: '#A0522D' }}></i>
          <p>No tienes productos en favoritos todavía.</p>
        </div>
      ) : (
        <div className="row g-4">
          {list.map(p => (
            <ProductCard 
              key={p.id} 
              producto={p} 
              onAdd={handleAddToCart} 
              onRemove={handleRemove}
              showRemoveFavorite={true}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Favoritos