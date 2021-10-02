const express = require('express');
const isAuth = require('../middleware/auth');
const { VM } = require('vm2');

const router = express.Router();

router.post('/check', isAuth, (req, res, next) => {
    const { calc } = req.body;
    const result = new VM().run(`${calc}`);

    return res.status(200).json({message: result})
});

module.exports = router;