// api/tg-api.js
// Прокси для исходящих запросов от Yandex Cloud к Telegram API

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { url, payload } = req.body;
      
      if (!url || !payload) {
        return res.status(400).json({ error: 'Missing url or payload' });
      }

      // Пересылаем запрос в api.telegram.org
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.text();
      res.status(response.status).send(data);
    } catch (error) {
      console.error('TG API Proxy Error:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(200).send('TG API Proxy is running!');
  }
}
