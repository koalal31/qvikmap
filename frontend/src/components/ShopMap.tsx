import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import type { Shop } from '../types/shop';

const HUNGARY_CENTER: [number, number] = [47.16, 19.5];
const DEFAULT_ZOOM = 7;

interface Props {
  shops: Shop[];
}

export function ShopMap({ shops }: Props) {
  return (
    <MapContainer center={HUNGARY_CENTER} zoom={DEFAULT_ZOOM} className="h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup chunkedLoading>
        {shops.map((shop) => (
          <Marker key={shop.id} position={[shop.lat, shop.lng]}>
            <Popup>
              <strong>{shop.name}</strong>
              <br />
              {shop.address}
              {shop.sponsored && (
                <>
                  <br />
                  <em>★ Featured partner</em>
                </>
              )}
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
