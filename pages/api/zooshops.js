import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'public', 'zooshops.json');

export default function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            const shops = JSON.parse(data);
            res.status(200).json(shops);
        } catch (err) {
            res.status(500).json({ error: 'Не удалось прочитать файл' });
        }
    } else if (req.method === 'POST') {
        try {
            const { name, address, lat, lng } = req.body;

            if (!name || !address || !lat || !lng) {
                return res.status(400).json({ error: 'Все поля обязательны' });
            }

            const data = fs.readFileSync(filePath, 'utf8');
            const shops = JSON.parse(data);
            shops.push({ name, address, lat: parseFloat(lat), lng: parseFloat(lng) });
            fs.writeFileSync(filePath, JSON.stringify(shops, null, 2), 'utf8');

            res.status(201).json({ message: 'Зоомагазин добавлен', shops });
        } catch (err) {
            res.status(500).json({ error: 'Ошибка при сохранении' });
        }
    } else {
        res.status(405).json({ error: 'Метод не поддерживается' });
    }
}