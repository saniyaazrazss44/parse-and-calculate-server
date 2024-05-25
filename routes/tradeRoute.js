const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const Trade = require('../models/trade');

router.use(bodyParser.json());
const upload = multer({ dest: 'uploads/' });

router.post('/addCSV', upload.single('file'), async (req, res) => {

    if (!req.file) {
        return res.status(400).json({
            status: 400,
            message: "No file uploaded."
        });
    }

    const filePath = req.file.path;
    const trades = [];

    try {
        const fileStream = fs.createReadStream(filePath);

        const parseCSV = async () => {
            return new Promise((resolve, reject) => {
                fileStream
                    .pipe(csv())
                    .on('data', (row) => {
                        const [base_coin, quote_coin] = row['Market'].split('/');
                        trades.push({
                            user_id: row['User_ID'],
                            utc_time: new Date(row['UTC_Time']),
                            operation: row['Operation'],
                            market: row['Market'],
                            base_coin,
                            quote_coin,
                            amount: parseFloat(row['Buy/Sell Amount']),
                            price: parseFloat(row['Price'])
                        });
                    })
                    .on('end', resolve)
                    .on('error', reject);
            });
        };

        await parseCSV();
        await Trade.insertMany(trades);

        res.status(200).json({
            status: 200,
            message: 'CSV file successfully processed and data stored.'
        })

    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Error processing CSV file'
        })

    } finally {
        fs.promises.unlink(filePath).catch(err => console.error('Error deleting file:', err));
    }
});

router.post('/balance', async (req, res) => {
    try {
        const { timestamp } = req.body;
        const queryTimestamp = new Date(timestamp);

        if (isNaN(queryTimestamp)) {
            return res.status(400).json({
                status: 400,
                message: 'Invalid timestamp format. Use "YYYY-MM-DD HH:mm:ss".'
            });
        }

        const trades = await Trade.find({ utc_time: { $lt: queryTimestamp } });

        const balances = trades.reduce((acc, trade) => {
            const { market, operation, amount } = trade;
            const [base_coin] = market.split('/');

            if (!acc[base_coin]) {
                acc[base_coin] = 0;
            }

            if (operation === 'Buy') {
                acc[base_coin] += amount;
            } else if (operation === 'Sell') {
                acc[base_coin] -= amount;
            }

            return acc;
        }, {});

        res.status(200).json({
            status: 200,
            response: balances
        })

    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Internal Server Error'
        });
    }
});

module.exports = router;