import { useState, useEffect } from 'react';
import { ShopMap } from './components/ShopMap';
import { fetchShops } from './api/shops';
import type { Shop } from './types/shop';

export default function App() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchShops()
      .then(setShops)
      .catch((err: Error) => setError(err.message));
  }, []);

  return (
    <div className="flex h-screen">
      <aside className="w-64 shrink-0 p-4 overflow-auto border-r border-gray-200">
        <h1 className="text-xl font-bold mb-2">Qvik Map</h1>
        <p className="text-sm text-gray-500">
          {shops.length} shop{shops.length !== 1 ? 's' : ''} loaded
        </p>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </aside>
      <main className="flex-1">
        <ShopMap shops={shops} />
      </main>
    </div>
  );
}
