const express = require('express');
const bodyParser = require('body-parser');
const modem = require('./modem');
const checkIP = require('./checkIP');
const axios = require('axios')
const htmlParser = require('node-html-parser');
const fs = require('fs');

require('./checkIP');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json', limit: '500kb' }));

app.use('/', express.static('./frontend/build'));

app.get('/devices', async (req, res) => {
	res.status(200).json(await modem.getDevices());
});

app.get('/filters', async (req, res) => {
	res.status(200).json(await modem.getMacFilters());
});

app.put('/filters', async (req, res) => {
	res.status(200).json(await modem.setMacFilters(req.body));
});

/*
{
	mac: <mac>,
	name: <name>
}
*/
app.put('/name', (req, res) => {
	res.status(200).json(modem.setDeviceName(req.body.mac, req.body.name));
});

app.put('/enable', async (req, res) => {
	res.status(200).json(await modem.enableDevice(req.body.mac));
});

app.put('/disable', async (req, res) => {
	res.status(200).json(await modem.disableDevice(req.body.mac));
});

app.get('/reboot', async (req, res) => {
	res.status(200).json(await modem.reboot());
});

app.get('/reboots', (req, res) => {
	res.status(200).json(checkIP.reboots());
});

app.get('/finance', async (req, res) => {
	const financeData = JSON.parse(fs.readFileSync('/data/finance.json'));

	const html = await axios({
		method: 'get',
		url: 'https://www.qnbfinansbank.enpara.com/hesaplar/doviz-ve-altin-kurlari'
	});

	const usd = parseFloat(htmlParser.parse(html.data).querySelector('div.enpara-gold-exchange-rates__table').childNodes[3].childNodes[2].structuredText.match('\\d+,\\d+')[0].replace(',', '.'));
	const eur = parseFloat(htmlParser.parse(html.data).querySelector('div.enpara-gold-exchange-rates__table').childNodes[5].childNodes[2].structuredText.match('\\d+,\\d+')[0].replace(',', '.'));
	const xau = parseFloat(htmlParser.parse(html.data).querySelector('div.enpara-gold-exchange-rates__table').childNodes[7].childNodes[2].structuredText.match('\\d+,\\d+')[0].replace(',', '.'));

	const cost = financeData.cost;
	const amount = financeData.amount;

	res.status(200).json({
		USD: usd,
		EUR: eur,
		XAU: xau,
		profit: (usd - cost.usd) * amount.usd + (eur - cost.eur) * amount.eur + (xau - cost.xau) * amount.xau
	});
});

const start = () => app.listen(process.env.PORT ? process.env.PORT : 4001);

module.exports = { start };
