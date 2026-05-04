import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiX, FiChevronDown, FiChevronUp, FiGrid, FiList } from 'react-icons/fi';
import { productAPI, categoryAPI } from '../../utils/api';
import ProductCard from '../../components/user/ProductCard';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'popular', label: 'Most Popular' },
];

const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 16, marginBottom: 16 }}>
      <button onClick={() => setOpen(!open)}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', background: 'none', padding: '4px 0', fontWeight: 700, fontSize: 14 }}
      >
        {title}
        {open ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
      </button>
      {open && <div style={{ marginTop: 12 }}>{children}</div>}
    </div>
  );
};

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minRating: searchParams.get('minRating') || '',
    brand: searchParams.get('brand') || '',
    sort: searchParams.get('sort') || 'newest',
    search: searchParams.get('search') || '',
    page: parseInt(searchParams.get('page')) || 1,
  });

  useEffect(() => {
    categoryAPI.getAll().then(({ data }) => setCategories(data.categories)).catch(() => {});
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== '' && v !== null));
      const { data } = await productAPI.getAll(params);
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: key !== 'page' ? 1 : value }));
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, value); else newParams.delete(key);
    if (key !== 'page') newParams.delete('page');
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setFilters({ category: '', minPrice: '', maxPrice: '', minRating: '', brand: '', sort: 'newest', search: '', page: 1 });
    setSearchParams({});
  };

  const activeFilterCount = [filters.category, filters.minPrice, filters.maxPrice, filters.minRating, filters.brand]
    .filter(Boolean).length;

  const SidebarFilters = () => (
    <div style={{ width: 260, flexShrink: 0 }}>
      <div className="card" style={{ padding: 20, position: 'sticky', top: 80 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>Filters</h3>
          {activeFilterCount > 0 && (
            <button onClick={clearFilters} style={{ color: 'var(--primary)', fontSize: 13, fontWeight: 600, background: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              <FiX size={14} /> Clear All
            </button>
          )}
        </div>

        <FilterSection title="Categories">
          {categories.map(cat => (
            <label key={cat._id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, cursor: 'pointer', fontSize: 14 }}>
              <input type="radio" name="category" value={cat._id}
                checked={filters.category === cat._id}
                onChange={() => updateFilter('category', filters.category === cat._id ? '' : cat._id)}
                style={{ accentColor: 'var(--primary)' }}
              />
              {cat.name}
            </label>
          ))}
        </FilterSection>

        <FilterSection title="Price Range">
          <div style={{ display: 'flex', gap: 10 }}>
            <input type="number" placeholder="Min ₹" value={filters.minPrice}
              onChange={e => updateFilter('minPrice', e.target.value)}
              className="form-control" style={{ padding: '8px 10px', fontSize: 13 }}
            />
            <input type="number" placeholder="Max ₹" value={filters.maxPrice}
              onChange={e => updateFilter('maxPrice', e.target.value)}
              className="form-control" style={{ padding: '8px 10px', fontSize: 13 }}
            />
          </div>
        </FilterSection>

        <FilterSection title="Minimum Rating">
          {[4, 3, 2, 1].map(r => (
            <label key={r} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, cursor: 'pointer', fontSize: 14 }}>
              <input type="radio" name="rating" value={r}
                checked={filters.minRating === String(r)}
                onChange={() => updateFilter('minRating', filters.minRating === String(r) ? '' : String(r))}
                style={{ accentColor: 'var(--primary)' }}
              />
              {'★'.repeat(r)}{'☆'.repeat(5 - r)} & above
            </label>
          ))}
        </FilterSection>
      </div>
    </div>
  );

  return (
    <div className="container" style={{ paddingTop: 30, paddingBottom: 50 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>
            {filters.search ? `Results for "${filters.search}"` : 'All Products'}
          </h1>
          <p style={{ color: 'var(--gray)', fontSize: 14, marginTop: 4 }}>
            {pagination.total || 0} products found
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button onClick={() => setShowFilters(!showFilters)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 16px', border: '2px solid #e0e0e0', borderRadius: 8, background: '#fff', fontWeight: 600, fontSize: 14 }}>
            <FiFilter size={16} />
            Filters {activeFilterCount > 0 && <span style={{ background: 'var(--primary)', color: '#fff', borderRadius: '50%', width: 18, height: 18, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{activeFilterCount}</span>}
          </button>
          <select value={filters.sort} onChange={e => updateFilter('sort', e.target.value)}
            className="form-control" style={{ width: 180, padding: '9px 12px', fontSize: 14 }}>
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 28 }}>
        {/* Sidebar */}
        <div style={{ display: showFilters ? 'block' : 'none' }}>
          <SidebarFilters />
        </div>

        {/* Products */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {loading ? (
            <div className="page-loading"><div className="spinner" /></div>
          ) : products.length === 0 ? (
            <div className="card" style={{ padding: 60, textAlign: 'center' }}>
              <div style={{ fontSize: 60, marginBottom: 16 }}>🔍</div>
              <h3 style={{ marginBottom: 8 }}>No products found</h3>
              <p style={{ color: 'var(--gray)', marginBottom: 20 }}>Try adjusting your filters or search terms</p>
              <button onClick={clearFilters} className="btn btn-primary">Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="products-grid">
                {products.map(p => <ProductCard key={p._id} product={p} />)}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="pagination">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => updateFilter('page', p)}
                      className={`page-btn${pagination.page === p ? ' active' : ''}`}>
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
