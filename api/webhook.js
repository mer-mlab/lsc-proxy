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
      console.log("Сырой ответ от YC:", response.status, data);
      
      try {
          const ycResponse = JSON.parse(data);
          // Если YC вернул ответ в формате Lambda (с полем body и statusCode)
          if (ycResponse.statusCode !== undefined && ycResponse.body !== undefined) {
              console.log("Извлекаем тело ответа из YC Lambda-формата");
              // Устанавливаем заголовки, если они есть
              if (ycResponse.headers) {
                  for (const key in ycResponse.headers) {
                      res.setHeader(key, ycResponse.headers[key]);
                  }
              }
              // Отдаем Telegram чистое тело (body)
              res.status(ycResponse.statusCode).send(ycResponse.body);
          } else {
              // Если ответ пришел в обычном формате
              res.status(response.status).send(data);
          }
      } catch (e) {
          // Если ответ не JSON
          console.log("Ответ YC не JSON, отдаем как есть");
          res.status(response.status).send(data);
      }
    } catch (error) {
      console.error('Proxy Error:', error);
      res.status(500).json({ error: 'Proxy failed to reach Yandex Cloud' });
    }
  } else {
    res.status(200).send('LSC Proxy is running!');
  }
}
