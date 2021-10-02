const express = require('express');
const contentType = require('content-type');
const request = require("request");
const isAuth = require('../middleware/auth');

const router = express.Router();

router.post('/url', isAuth, (req, res) => {
  try {
    request(req.body).on('error', (err) => {
      return res.json({message: "Something went wrong"});
    }).on('response', (response) => {
      let result = []
      response.on('data', (chunk) => { result.push(chunk) })
      response.on('end', () => {
        try {
          let mimeType = contentType.parse(response.headers['content-type'] || 'text/plain').type;
          if(mimeType == 'text/html' && req.body.url) {
            result.unshift(Buffer.from(`<base href="${encodeURI(req.body.url)}"></base>`))
          }
          res.json({content: `data:${mimeType};base64,${Buffer.concat(result).toString('base64')}`})
        } catch(err) { return res.json({message: "Something went wrong"}) }
      })
    })
  } catch(err) { return res.json({message: "Something went wrong"}) }
});

module.exports = router;
