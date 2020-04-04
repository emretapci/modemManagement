const axios = require('axios');
const fs = require('fs');

var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function base64Encode(g) { var c, e, a; var f, d, b; a = g.length; e = 0; c = ""; while (e < a) { f = g.charCodeAt(e++) & 255; if (e == a) { c += base64EncodeChars.charAt(f >> 2); c += base64EncodeChars.charAt((f & 3) << 4); c += "=="; break } d = g.charCodeAt(e++); if (e == a) { c += base64EncodeChars.charAt(f >> 2); c += base64EncodeChars.charAt(((f & 3) << 4) | ((d & 240) >> 4)); c += base64EncodeChars.charAt((d & 15) << 2); c += "="; break } b = g.charCodeAt(e++); c += base64EncodeChars.charAt(f >> 2); c += base64EncodeChars.charAt(((f & 3) << 4) | ((d & 240) >> 4)); c += base64EncodeChars.charAt(((d & 15) << 2) | ((b & 192) >> 6)); c += base64EncodeChars.charAt(b & 63) } return c }
function SHA256(p) { var k = 8; var n = 0; function i(q, t) { var s = (q & 65535) + (t & 65535); var r = (q >> 16) + (t >> 16) + (s >> 16); return (r << 16) | (s & 65535) } function e(r, q) { return (r >>> q) | (r << (32 - q)) } function f(r, q) { return (r >>> q) } function a(q, s, r) { return ((q & s) ^ ((~q) & r)) } function d(q, s, r) { return ((q & s) ^ (q & r) ^ (s & r)) } function g(q) { return (e(q, 2) ^ e(q, 13) ^ e(q, 22)) } function b(q) { return (e(q, 6) ^ e(q, 11) ^ e(q, 25)) } function o(q) { return (e(q, 7) ^ e(q, 18) ^ f(q, 3)) } function j(q) { return (e(q, 17) ^ e(q, 19) ^ f(q, 10)) } function c(r, s) { var E = new Array(1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298); var t = new Array(1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225); var q = new Array(64); var G, F, D, C, A, y, x, w, v, u; var B, z; r[s >> 5] |= 128 << (24 - s % 32); r[((s + 64 >> 9) << 4) + 15] = s; for (var v = 0; v < r.length; v += 16) { G = t[0]; F = t[1]; D = t[2]; C = t[3]; A = t[4]; y = t[5]; x = t[6]; w = t[7]; for (var u = 0; u < 64; u++) { if (u < 16) { q[u] = r[u + v] } else { q[u] = i(i(i(j(q[u - 2]), q[u - 7]), o(q[u - 15])), q[u - 16]) } B = i(i(i(i(w, b(A)), a(A, y, x)), E[u]), q[u]); z = i(g(G), d(G, F, D)); w = x; x = y; y = A; A = i(C, B); C = D; D = F; F = G; G = i(B, z) } t[0] = i(G, t[0]); t[1] = i(F, t[1]); t[2] = i(D, t[2]); t[3] = i(C, t[3]); t[4] = i(A, t[4]); t[5] = i(y, t[5]); t[6] = i(x, t[6]); t[7] = i(w, t[7]) } return t } function h(t) { var s = Array(); var q = (1 << k) - 1; for (var r = 0; r < t.length * k; r += k) { s[r >> 5] |= (t.charCodeAt(r / k) & q) << (24 - r % 32) } return s } function m(r) { r = r.replace(/\r\n/g, "\n"); var q = ""; for (var t = 0; t < r.length; t++) { var s = r.charCodeAt(t); if (s < 128) { q += String.fromCharCode(s) } else { if ((s > 127) && (s < 2048)) { q += String.fromCharCode((s >> 6) | 192); q += String.fromCharCode((s & 63) | 128) } else { q += String.fromCharCode((s >> 12) | 224); q += String.fromCharCode(((s >> 6) & 63) | 128); q += String.fromCharCode((s & 63) | 128) } } } return q } function l(s) { var r = n ? "0123456789ABCDEF" : "0123456789abcdef"; var t = ""; for (var q = 0; q < s.length * 4; q++) { t += r.charAt((s[q >> 2] >> ((3 - q % 4) * 8 + 4)) & 15) + r.charAt((s[q >> 2] >> ((3 - q % 4) * 8)) & 15) } return t } p = m(p); return l(c(h(p), p.length * k)) };

const stateFileName = './state.json';
let state = {
}
if (fs.existsSync(stateFileName)) {
	state = JSON.parse(fs.readFileSync(stateFileName).toString());
}

const login = () => {
	return new Promise((resolve, reject) => {
		axios({
			method: 'get',
			url: 'http://192.168.1.1'
		}).then(response => {
			const csrfParam = response.data.match(/csrf_param" content="([A-Za-z0-9]+)"/)[1];
			const csrfToken = response.data.match(/csrf_token" content="([A-Za-z0-9]+)"/)[1];
			const credentials = {
				username: 'admin',
				password: SHA256('admin' + base64Encode(SHA256('topitop2^^')) + csrfParam + csrfToken)
			}

			const cookie = response.headers['set-cookie'][0];
			const obj = {
				csrf: {
					csrf_param: csrfParam,
					csrf_token: csrfToken
				},
				data: {
					UserName: credentials.username,
					Password: credentials.password,
					LoginFlag: 1
				}
			}

			axios({
				method: 'post',
				url: 'http://192.168.1.1/api/system/user_login',
				headers: {
					'Accept': 'application/json, text/javascript, */*; q=0.01',
					'Accept-Encoding': 'gzip, deflate',
					'Accept-Language': 'en-US,en;q=0.9',
					'Connection': 'keep-alive',
					'Content-Type': 'application/json;charset=UTF-8',
					'Cookie': cookie,
					'Host': '192.168.1.1',
					'Origin': 'http://192.168.1.1',
					'Referer': 'http://192.168.1.1/',
					'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36',
					'X-Requested-With': 'XMLHttpRequest'
				},
				data: JSON.stringify(obj)
			}).then(response => {
				const result = response.data.match(/errorCategory":"([A-Za-z0-9]+)"/)[1];
				if (result == 'ok') {
					const cookie = response.headers['set-cookie'][0];
					const arr = cookie.split(';');
					let kvs = {}
					arr.forEach(x => {
						const kv = x.split('=');
						kvs[kv[0]] = kv[1];
					});
					resolve(kvs['SessionID_R3']);
				}
				else
					reject(result);
			});
		});
	});
}

const checkCookie = cookie => {
	if (!cookie)
		return Promise.resolve(false);

	return new Promise(resolve => {
		axios({
			method: 'get',
			url: 'http://192.168.1.1/api/system/firstupwan',
			headers: {
				'Cookie': `SessionID_R3=${cookie}`
			}
		}).then(response => {
			if (response.status == 200)
				resolve(true);
		}).catch(err => {
			resolve(false);
		})
	});
}

const getCookie = () => {
	return new Promise((resolve, reject) => {
		checkCookie(state.cookie).then(valid => {
			if (valid)
				resolve(state.cookie);
			else {
				login().then(cookie => {
					state.cookie = cookie;
					fs.writeFileSync(stateFileName, JSON.stringify(state, null, '\t'));
					checkCookie(cookie).then(valid => {
						if (valid)
							resolve(cookie);
						else {
							console.log('re-login failed.');
							reject(err);
						}
					});
				});
			}
		});
	});
}

const getCsrfTokens = async () => {
	const cookie = await getCookie();
	return new Promise((resolve, reject) => {
		axios({
			method: 'get',
			url: 'http://192.168.1.1/html/advance.html',
			headers: {
				'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
				'Accept-Encoding': 'gzip, deflate',
				'Accept-Language': 'en-US,en;q=0.9',
				'Cache-Control': 'max-age=0',
				'Connection': 'keep-alive',
				'Cookie': `SessionID_R3=${cookie}`,
				'Host': '192.168.1.1',
				'Upgrade-Insecure-Requests': '1',
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36'
			}
		}).then(response => {
			resolve({
				csrf_param: response.data.match(/csrf_param" content="([A-Za-z0-9]+)"/)[1],
				csrf_token: response.data.match(/csrf_token" content="([A-Za-z0-9]+)"/)[1]
			});
		}).catch(err => {
			reject(err);
		});
	});
}

const getMacFilters = async () => {
	const cookie = await getCookie();
	return new Promise((resolve, reject) => {
		axios({
			method: 'get',
			url: 'http://192.168.1.1/api/ntwk/macfilter',
			headers: {
				'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
				'Accept-Encoding': 'gzip, deflate',
				'Accept-Language': 'en-US,en;q=0.9',
				'Cache-Control': 'max-age=0',
				'Connection': 'keep-alive',
				'Cookie': `SessionID_R3=${cookie}`,
				'Host': '192.168.1.1',
				'Upgrade-Insecure-Requests': '1',
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36'
			}
		}).then(async response => {
			const filters = JSON.parse(response.data.match(/\/\*(.+)\*\//)[1]);
			const autoFilters = filters.filter(filter => filter.RuleName == 'auto');
			let autoFilter = autoFilters.length > 0 ? autoFilters[0] : null;
			let result = null;
			if (autoFilter) {
				result = {
					enabled: autoFilter.Enable,
					mac: autoFilter.Devices.map(device => device.MACAddress),
				}
				if (autoFilter.TimeMode == 0) {
					result.days = autoFilter.DailyFrom.replace(/^0+/, '') + '-' + autoFilter.DailyTo.replace(/^0+/, '');
				}
				else {
					result.days = {};
					if (autoFilter.Mondayenable)
						result.days.mon = autoFilter.MondayFrom.replace(/^0+/, '') + '-' + autoFilter.MondayTo.replace(/^0+/, '');
					if (autoFilter.Tuesdayenable)
						result.days.tue = autoFilter.TuesdayFrom.replace(/^0+/, '') + '-' + autoFilter.TuesdayTo.replace(/^0+/, '');
					if (autoFilter.Wednesdayenable)
						result.days.wed = autoFilter.WednesdayFrom.replace(/^0+/, '') + '-' + autoFilter.WednesdayTo.replace(/^0+/, '');
					if (autoFilter.Thursdayenable)
						result.days.thu = autoFilter.ThursdayFrom.replace(/^0+/, '') + '-' + autoFilter.ThursdayTo.replace(/^0+/, '');
					if (autoFilter.Fridayenable)
						result.days.fri = autoFilter.FridayFrom.replace(/^0+/, '') + '-' + autoFilter.FridayTo.replace(/^0+/, '');
					if (autoFilter.Saturdayenable)
						result.days.sat = autoFilter.SaturdayFrom.replace(/^0+/, '') + '-' + autoFilter.SaturdayTo.replace(/^0+/, '');
					if (autoFilter.Sundayenable)
						result.days.sun = autoFilter.SundayFrom.replace(/^0+/, '') + '-' + autoFilter.SundayTo.replace(/^0+/, '');
				}
				result.id = autoFilter.ID;
			}
			resolve(result);
		}).catch(err => {
			reject(err);
		});
	});
}

/*
{
	mac: [
		'70:28:8B:C5:7A:4F'
	],
	days: {
		mon: '8:00-10:00',
		tue: '10:00-11:00',
		thu: '10:00-11:00'
	}
	OR
	days: '8:00-10:00'
}
*/
const setMacFilters = async filter => {
	const cookie = await getCookie();
	return new Promise(async resolve => {
		let filterData = {
			Enable: true,
			Mondayenable: filter.days.mon != undefined,
			Tuesdayenable: filter.days.tue != undefined,
			Wednesdayenable: filter.days.wed != undefined,
			Thursdayenable: filter.days.thu != undefined,
			Fridayenable: filter.days.fri != undefined,
			Saturdayenable: filter.days.sat != undefined,
			Sundayenable: filter.days.sun != undefined
		}

		filterData['MondayFrom'] = '03:00';
		filterData['MondayTo'] = '03:01';
		filterData['TuesdayFrom'] = '03:00';
		filterData['TuesdayTo'] = '03:01';
		filterData['WednesdayFrom'] = '03:00';
		filterData['WednesdayTo'] = '03:01';
		filterData['ThursdayFrom'] = '03:00';
		filterData['ThursdayTo'] = '03:01';
		filterData['FridayFrom'] = '03:00';
		filterData['FridayTo'] = '03:01';
		filterData['SaturdayFrom'] = '03:00';
		filterData['SaturdayTo'] = '03:01';
		filterData['SundayFrom'] = '03:00';
		filterData['SundayTo'] = '03:01';
		filterData['DailyFrom'] = '03:00';
		filterData['DailyTo'] = '03:00';

		if (filter.days.mon != undefined) {
			filterData['MondayFrom'] = filter.days.mon.split('-')[0].padStart(5, '0');
			filterData['MondayTo'] = filter.days.mon.split('-')[1].padStart(5, '0');
		}
		if (filter.days.tue != undefined) {
			filterData['TuesdayFrom'] = filter.days.tue.split('-')[0].padStart(5, '0');
			filterData['TuesdayTo'] = filter.days.tue.split('-')[1].padStart(5, '0');
		}
		if (filter.days.wed != undefined) {
			filterData['WednesdayFrom'] = filter.days.web.split('-')[0].padStart(5, '0');
			filterData['WednesdayTo'] = filter.days.web.split('-')[1].padStart(5, '0');
		}
		if (filter.days.thu != undefined) {
			filterData['ThursdayFrom'] = filter.days.thu.split('-')[0].padStart(5, '0');
			filterData['ThursdayTo'] = filter.days.thu.split('-')[1].padStart(5, '0');
		}
		if (filter.days.fri != undefined) {
			filterData['FridayFrom'] = filter.days.fri.split('-')[0].padStart(5, '0');
			filterData['FridayTo'] = filter.days.fri.split('-')[1].padStart(5, '0');
		}
		if (filter.days.sat != undefined) {
			filterData['SaturdayFrom'] = filter.days.sat.split('-')[0].padStart(5, '0');
			filterData['SaturdayTo'] = filter.days.sat.split('-')[1].padStart(5, '0');
		}
		if (filter.days.sun != undefined) {
			filterData['SundayFrom'] = filter.days.sun.split('-')[0].padStart(5, '0');
			filterData['SundayTo'] = filter.days.sun.split('-')[1].padStart(5, '0');
		}
		filterData.Devices = filter.mac.map(m => ({ MACAddress: m }));
		filterData.RuleName = 'auto';
		filterData.ID = 'InternetGatewayDevice.X_FireWall.TimeRule.1.';
		if (typeof filter.days == 'string') {
			filterData.TimeMode = 0;
			filterData.DailyFrom = filter.days.split('-')[0].padStart(5, '0');
			filterData.DailyTo = filter.days.split('-')[1].padStart(5, '0');
		}
		else {
			filterData.TimeMode = 1;
		}
		filterData.isActiveItem = true;

		const existingFilter = await getMacFilters();

		let data = {
			csrf: await getCsrfTokens(cookie),
			data: filterData
		}

		if (existingFilter) {
			data.action = 'update';
			data.data.ID = existingFilter.id;
		}
		else {
			data.action = 'create';
		}

		axios({
			method: 'post',
			url: 'http://192.168.1.1/api/ntwk/macfilter',
			headers: {
				'Accept': 'application/json, text/javascript, */*; q=0.01',
				'Accept-Encoding': 'gzip, deflate',
				'Accept-Language': 'en-US,en;q=0.9',
				'Connection': 'keep-alive',
				'Content-Type': 'application/json;charset=UTF-8',
				'Cookie': `SessionID_R3=${cookie}`,
				'Host': '192.168.1.1',
				'Origin': 'http://192.168.1.1',
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36'
			},
			data
		}).then(response => {
			const result = response.data.match(/errcode":([0-9]+)/)[1];
			resolve(result == 0);
		}).catch(err => {
			resolve(err);
		});
	});
}

const getDevices = async () => {
	const cookie = await getCookie();
	return new Promise(resolve => {
		axios({
			method: 'get',
			url: 'http://192.168.1.1/api/system/HostInfo',
			headers: {
				'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
				'Accept-Encoding': 'gzip, deflate',
				'Accept-Language': 'en-US,en;q=0.9',
				'Cache-Control': 'max-age=0',
				'Connection': 'keep-alive',
				'Cookie': `SessionID_R3=${cookie}`,
				'Host': '192.168.1.1',
				'Upgrade-Insecure-Requests': '1',
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36'
			}
		}).then(response => {
			const devicesRead = JSON.parse(response.data.match(/\/\*(.+)\*\//)[1])
				.map(device => ({ hostname: device.HostName, mac: device.MACAddress }));
			const devicesFromState = state.devices;
			let devicesMerged = devicesFromState.concat(devicesRead.filter(device => !devicesFromState.find(device2 => device2.mac == device.mac)));
			state.devices = devicesMerged;
			fs.writeFileSync(stateFileName, JSON.stringify(state, null, '\t'));
			resolve(state.devices);
		}).catch(err => {
			reject(err);
		});
	});
}

const setDeviceName = (mac, name) => {
	let existingDevice = state.devices.find(device => device.mac == mac);
	if (!existingDevice)
		return false;
	existingDevice.name = name;
	fs.writeFileSync(stateFileName, JSON.stringify(state, null, '\t'));

	return true;
}

const enableDevice = async mac => {
	const filters = await getMacFilters();
}

const disableDevice = async mac => {

}

getDevices().then(devices => {
	getMacFilters().then(filter => {
		state.disabled = filter.mac;
		fs.writeFileSync(stateFileName, JSON.stringify(state, null, '\t'));
	});
});

module.exports = {
	getDevices,
	getMacFilters,
	setMacFilters,
	enableDevice,
	disableDevice,
	setDeviceName
}
