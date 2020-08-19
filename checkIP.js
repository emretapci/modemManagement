const axios = require('axios');
const fs = require('fs');
const modem = require('./modem');

const filename = './logs/log.txt';

const rebootRequired = async () => {
	const res = await axios({
		method: 'get',
		url: 'http://bot.whatismyipaddress.com/'
	});
	const externalIPModem = await modem.getExternalIp();
	const externalIPReal = res.data;
	return externalIPModem != externalIPReal;
}

const check = async () => {
	const rebootReq = await rebootRequired();
	if (rebootReq) {
		fs.appendFileSync(filename, Date.now() + '\n');
		modem.reboot();
	}
}

const reboots = () => {
	return fs.readFileSync(filename).toString().split('\n').map(epoch => new Date(epoch));
}

setInterval(check, 60000 * 5);

check();

module.exports = { reboots }