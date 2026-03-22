import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/leaflet/marker-icon-2x.png',
    iconUrl: '/leaflet/marker-icon.png',
    shadowUrl: '/leaflet/marker-shadow.png',
});

export default function ZooShops() {
    const [shops, setShops] = useState([]);
    const [newShop, setNewShop] = useState({ name: '', address: '', lat: '', lng: '' });

    useEffect(() => {
        fetch('/api/zooshops')
            .then(res => res.json())
            .then(data => setShops(data));
    }, []);

    const handleChange = e => {
        setNewShop({ ...newShop, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await fetch('/api/zooshops', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newShop),
            });
            const data = await res.json();
            if (res.ok) {
                setShops(data.shops);
                setNewShop({ name: '', address: '', lat: '', lng: '' });
            } else {
                alert(data.error);
            }
        } catch (err) {
            alert('Ошибка при добавлении магазина');
        }
    };

    const center = shops.length
        ? [shops.reduce((sum, s) => sum + s.lat, 0) / shops.length,
            shops.reduce((sum, s) => sum + s.lng, 0) / shops.length]
        : [53.218, 44.95];

    return (
        <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Head>
                <title>Зоомагазины</title>
            </Head>

            <h1 style={{ textAlign: 'center', margin: '10px 0' }}>Зоомагазины</h1>

            <div style={{ flex: 1 }}>
                <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://osm.org/copyright">OSM</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {shops.map((shop, i) => (
                        <Marker key={i} position={[shop.lat, shop.lng]}>
                            <Popup>
                                <b>{shop.name}</b><br />{shop.address}
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>

            {/* Форма добавления */}
            <form onSubmit={handleSubmit} style={{ textAlign: 'center', marginTop: '10px' }}>
                <input type="text" name="name" placeholder="Название" value={newShop.name} onChange={handleChange} required />
                <input type="text" name="address" placeholder="Адрес" value={newShop.address} onChange={handleChange} required />
                <input type="number" step="any" name="lat" placeholder="Широта" value={newShop.lat} onChange={handleChange} required />
                <input type="number" step="any" name="lng" placeholder="Долгота" value={newShop.lng} onChange={handleChange} required />
                <button type="submit">Добавить</button>
            </form>

            <p style={{ textAlign: 'center', margin: '10px 0' }}>
                <Link href="/">Назад на главную</Link>
            </p>
        </div>
    );
}