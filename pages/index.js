import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import AwesomeSlider from "react-awesome-slider";
import "react-awesome-slider/dist/styles.css";
import "react-awesome-slider/dist/captioned.css";
import Link from 'next/link';
import styles from '../styles/Home.module.css';

function sendEmail(email){
    const body = `Здравствуйте, я нашел вашего питомца.%0A-----------%0AС уважением, ${localStorage.user}`;
    window.open(`mailto:${email}?subject=Потерянный зверь&body=${body}`);
}

function Animal({ data }) {
    if(!data) return <p>Loading...</p>;
    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
            <img
                src={`/${data.img}`}
                alt={data.header}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: 'white',
                textAlign: 'center',
                textShadow: '2px 2px 5px black'
            }}>
                <h1 style={{ margin: 0, fontSize: '3rem' }}>{data.header}</h1>
                <h2 style={{ marginTop: '1rem', fontSize: '1.5rem' }}>{data.content}</h2>
            </div>
        </div>
    )
}

export default function Home() {
    const [animals, setAnimals] = React.useState([]);

    React.useEffect(() => {
        fetch('/animals.json')
            .then(res => res.json())
            .then(data => setAnimals(data));
    }, []);

    React.useEffect(() => {
        let user = localStorage.getItem('user');
        while(!user){
            user = prompt("Введите ваше имя пользователя");
            if(!user) alert('Обязательно!');
            else localStorage.setItem('user', user);
        }
    }, []);

    function logout(){
        localStorage.clear();
        location.reload();
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Petto</title>
                <meta name="description" content="Социальная сеть для питомцев" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <button
                onClick={logout}
                style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 1000 }}
            >
                logout
            </button>

            <h1 style={{ textAlign: 'center', marginTop: '10px' }}>Petto</h1>

            {animals.length > 0 ? (
                <AwesomeSlider style={{ width: '100%', height: '100vh' }}>
                    {animals.map((data, i) => (
                        <div key={i}>
                            <Animal data={data} />
                        </div>
                    ))}
                </AwesomeSlider>
            ) : (
                <p style={{ textAlign: 'center', marginTop: '20px' }}>Загрузка животных...</p>
            )}

            <p style={{ textAlign: 'center', marginTop: '50px' }}>
                <Link href="/zooshops">Перейти к зоомагазинам</Link>
            </p>
        </div>
    )
}