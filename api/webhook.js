// api/webhook.js
const YANDEX_WEBHOOK_URL = 'https://d5d5fou0pa6vij4mhe66.a6hc9vya.apigw.yandexcloud.net/webhook';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (req.headers['x-telegram-bot-api-secret-token']) {
        headers['X-Telegram-Bot-Api-Secret-Token'] = req.headers['x-telegram-bot-api-secret-token'];
      }

      const response = await fetch(YANDEX_WEBHOOK_URL, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(req.body)
      });

      const data = await response.text();
      res.status(response.status).send(data);
    } catch (error) {
      console.error('Proxy Error:', error);
      res.status(500).json({ error: 'Proxy failed to reach Yandex Cloud' });
    }
  } else {
    res.status(200).send('LSC Proxy is running!');
  }
}
