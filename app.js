const express = require('express');
const bodyParser = require('body-parser');
const modem = require('./modem');
const checkIP = require('./checkIP');

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
})

const start = () => app.listen(process.env.PORT ? process.env.PORT : 4001);

module.exports = { start };
