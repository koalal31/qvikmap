import { useState, useEffect } from 'react';
import { ShopMap } from './components/ShopMap';
import { FilterPanel, type Filters } from './components/FilterPanel';
import { fetchShops } from './api/shops';
import type { Shop } from './types/shop';

export default function App() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({ city: '', type: '' });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // Debounce: wait 300ms after the last filter change before calling the API,
    // so typing a city name doesn't fire one request per keystroke.
    const timer = setTimeout(() => {
      fetchShops({ city: filters.city, type: filters.type })
        .then((data) => {
          setShops(data);
          setError(null);
        })
        .catch((err: Error) => setError(err.message));
    }, 300);
    return () => clearTimeout(timer);
  }, [filters]);

  return (
    <div className="relative h-screen md:flex">
      <button
        type="button"
        onClick={() => setMobileOpen((open) => !open)}
        className="absolute top-3 left-3 z-1000 rounded bg-white px-3 py-2 shadow md:hidden"
      >
        {mobileOpen ? 'Close' : 'Filters'}
      </button>

      <aside
        className={`${mobileOpen ? 'block' : 'hidden'} md:block absolute inset-0 z-999 w-full overflow-auto border-r border-gray-200 bg-white p-4 pt-16 md:static md:inset-auto md:w-72 md:shrink-0 md:pt-4`}
      >
        <FilterPanel filters={filters} onChange={setFilters} resultCount={shops.length} />
        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
      </aside>

      <main className="h-full flex-1">
        <ShopMap shops={shops} />
      </main>
    </div>
  );
}
