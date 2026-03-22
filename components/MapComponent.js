import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import React from 'react';

// Настройка иконок маркера
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/leaflet/marker-icon-2x.png',
    iconUrl: '/leaflet/marker-icon.png',
    shadowUrl: '/leaflet/marker-shadow.png',
});

export default function MapComponent({ shops }) {
    // Центр карты — среднее по всем магазинам или дефолт
    const center = shops.length
        ? [shops.reduce((sum, s) => sum + parseFloat(s.lat), 0) / shops.length,
            shops.reduce((sum, s) => sum + parseFloat(s.lng), 0) / shops.length]
        : [53.218, 44.95];

    return (
        <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                attribution='&copy; <a href="https://osm.org/copyright">OSM</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {shops.map((shop, i) => (
                <Marker key={i} position={[parseFloat(shop.lat), parseFloat(shop.lng)]}>
                    <Popup>
                        <b>{shop.name}</b><br />{shop.address}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}