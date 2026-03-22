import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Динамически импортируем карту без SSR
const MapComponent = dynamic(() => import('../components/MapComponent'), { ssr: false });

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

    return (
        <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Head>
                <title>Зоомагазины</title>
            </Head>

            <h1 style={{ textAlign: 'center', margin: '10px 0' }}>Зоомагазины</h1>

            <div style={{ flex: 1 }}>
                <MapComponent shops={shops} />
            </div>

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