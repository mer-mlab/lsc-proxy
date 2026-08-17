// api/webhook.js
const YANDEX_WEBHOOK_URL = 'https://d5d5fou0pa6vij4mhe66.a6hc9vya.apigw.yandexcloud.net/webhook';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const bodyStr = JSON.stringify(req.body);
      console.log("Получен запрос от TG:", bodyStr);

      const headers = { 'Content-Type': 'application/json' };
      if (req.headers['x-telegram-bot-api-secret-token']) {
        headers['X-Telegram-Bot-Api-Secret-Token'] = req.headers['x-telegram-bot-api-secret-token'];
      }

      const response = await fetch(YANDEX_WEBHOOK_URL, {
        method: 'POST',
        headers: headers,
        body: bodyStr
      });

      const data = await response.text();
      console.log("Ответ от YC:", response.status, data);
      
      res.status(response.status).send(data);
    } catch (error) {
      console.error('Proxy Error:', error);
      res.status(500).json({ error: 'Proxy failed to reach Yandex Cloud' });
    }
  } else {
    res.status(200).send('LSC Proxy is running!');
  }
}
