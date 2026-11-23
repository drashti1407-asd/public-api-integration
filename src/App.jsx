
import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('https://dummyjson.com/products?limit=0')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }

        return response.json()
      })
      .then((data) => {
        setProducts(data.products)

        const uniqueCategories = [
          ...new Set(data.products.map((product) => product.category))
        ]

        setCategories(uniqueCategories)
      })
      .catch((error) => {
        setError('Unable to load products. Please try again later.')
        console.log('Error:', error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  // Search and filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase())

    const matchesCategory =
      selectedCategory === '' ||
      product.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="container">

      <header className="header">
        <h1>Product Explorer</h1>
        <p>Find and explore your favourite products</p>
      </header>

      <div className="controls">

        <input
          type="text"
          placeholder="Search products..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="category-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>

          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

      </div>

      <section className="products-section">
        <h2>All Products</h2>

        {loading ? (
          <p className="loading-message">
            Loading products...
          </p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <>
            <p>Total Products: {filteredProducts.length}</p>

            
{filteredProducts.length > 0 ? (
  <div className="product-grid">

    {filteredProducts.map((product) => (
      <div className="product-card" key={product.id}>

        <img
          src={product.thumbnail}
          alt={product.title}
        />

        <h3>{product.title}</h3>

        <p>Price: ${product.price}</p>

        <p>Category: {product.category}</p>

        <p>Rating: {product.rating} ⭐</p>

      </div>
    ))}

  </div>
) : (
  <p className="no-results">
    No products found. Please try another search.
  </p>
)}

          </>
        )}

      </section>

    </div>
  )
}

export default App
