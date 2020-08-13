const axios = require('axios');
const fs = require('fs');
const modem = require('./modem');

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
		fs.appendFileSync('./logs/log.txt', `[${new Date().toString()}] Rebooting modem.\n`);
		modem.reboot();
	}
	else {
		fs.appendFileSync('./logs/log.txt', `[${new Date().toString()}] Checked IPs, same.\n`);
	}
}

setInterval(check, 60000 * 5);

check();
