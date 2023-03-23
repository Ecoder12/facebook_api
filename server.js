const express = require('express');
const https = require('https');

const app = express();
const port = 3000; // Or any other port number you want to use

app.use(express.json());

app.post('/api/images', (req, res) => {
  const url = 'https://api.openai.com/v1/images/generations';
  
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer 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'
    }
  };
  
  const data = JSON.stringify({
    prompt: req.body.prompt,
    n: 1,
    size: '1024x1024'
  });
  
  let result = '';
  const reqs = https.request(url, options, (apiRes) => {
    apiRes.setEncoding('utf8');
    apiRes.on('data', (chunk) => {
      result += chunk;
    });

    apiRes.on('end', () => {
res.send(result);
    });
  });

  reqs.on('error', (e) => {
    console.error(e);
  });

  reqs.write(data);
  reqs.end();
});


app.post('/api/post-to-facebook', (req, res) => {
    const { pageId, accessToken } = req.body;
    const message = req.body.message || 'Become a Facebook developer!';
    const link = req.body.link || 'https://developers.facebook.com';
    const callToAction = req.body.callToAction || { type: 'SIGN_UP', value: { link: 'https://developers.facebook.com' } };
    const published = req.body.published || 1;

    const url = `https://graph.facebook.com/${pageId}/feed?message=${message}&link=${link}&call_to_action=${JSON.stringify(callToAction)}&published=${published}&access_token=${accessToken}`;

    const options = {
        method: 'POST',
        headers: {
            'Content-Length': '0',
        },
    };

    let result = '';
    const reqs = https.request(url, options, (response) => {
        response.setEncoding('utf8');
        response.on('data', (chunk) => {
            result += chunk;
        });

        response.on('end', () => {
            res.send(result);
        });
    });

    reqs.on('error', (e) => {
        console.error(e);
        res.status(500).send('An error occurred while posting to Facebook');
    });

    reqs.end();
});




app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
