const express = require('express');
const axios = require('axios')
const fs = require('fs')
const htmlParser = require('node-html-parser');

let financeRouter = express.Router()

const getPrices = async bank => {
	let html, rootHtml;
	switch (bank) {
		case 'enpara':
			html = await axios({
				method: 'get',
				url: 'https://www.qnbfinansbank.enpara.com/hesaplar/doviz-ve-altin-kurlari'
			});

			rootHtml = htmlParser.parse(html.data);
			let banks = ['USD', 'EUR', 'Altın'];

			return banks.map(type => ({
				type,
				buy: parseFloat(rootHtml.querySelectorAll('div.enpara-gold-exchange-rates__table div.enpara-gold-exchange-rates__table-item')
					.filter(node => node.querySelectorAll('span')[0].rawText.startsWith(type))[0]
					.querySelectorAll('span')[1].childNodes[0].rawText.replace(',', '.')),
				sell: parseFloat(rootHtml.querySelectorAll('div.enpara-gold-exchange-rates__table div.enpara-gold-exchange-rates__table-item')
					.filter(node => node.querySelectorAll('span')[0].rawText.startsWith(type))[0]
					.querySelectorAll('span')[2].childNodes[0].rawText.replace(',', '.'))
			}));
		case 'ziraat':
			html = await axios({
				method: 'get',
				url: 'https://www.ziraatbank.com.tr/tr/fiyatlar-ve-oranlar'
			});

			rootHtml = htmlParser.parse(html.data);

			return rootHtml.querySelectorAll('div.js-item').filter(node => node.getAttribute('data-id') === 'rdIntBranchDoviz')[0]
				.querySelector('div.table table tbody').childNodes.filter(node => node.tagName === 'tr').map(trNode => ({
					type: trNode.querySelectorAll('td')[0].childNodes[0].rawText,
					buy: parseFloat(trNode.querySelectorAll('td')[2].childNodes[0].rawText.replace(',', '.')),
					sell: parseFloat(trNode.querySelectorAll('td')[3].childNodes[0].rawText.replace(',', '.'))
				})).concat(
					rootHtml.querySelectorAll('div.js-item').filter(node => node.getAttribute('data-id') === 'rdIntBranchAltin')[0]
						.querySelector('div.table table tbody').childNodes.filter(node => node.tagName === 'tr').map(trNode => ({
							type: trNode.querySelectorAll('td')[0].childNodes[0].rawText.replace(/\*/g, ''),
							buy: parseFloat(trNode.querySelectorAll('td')[2].childNodes[0].rawText.replace(',', '.')),
							sell: parseFloat(trNode.querySelectorAll('td')[3].childNodes[0].rawText.replace(',', '.'))
						})));
		case 'altın':
			html = await axios({
				method: 'get',
				url: 'http://www.altinkaynak.com/Altin/Kur/Guncel'
			});

			rootHtml = htmlParser.parse(html.data);

			let priceLinesToptan = rootHtml.querySelectorAll('table').filter(node => node.getAttribute('class') === 'table gold')[0].querySelectorAll('tbody tr')
				.filter(node => node.getAttribute('data-flag'));
			let priceLinesParekende = rootHtml.querySelectorAll('table').filter(node => node.getAttribute('class') === 'table')[0].querySelectorAll('tbody tr')
				.filter(node => node.getAttribute('data-flag'));

			return priceLinesToptan.concat(priceLinesParekende).map(priceLine => {
				let type = priceLine.querySelector('td').childNodes[0].rawText;
				let buy = priceLine.querySelectorAll('td').filter(node => node.getAttribute('id') === 'td' + priceLine.getAttribute('data-flag') + 'Buy')[0]
					.childNodes[0].rawText;
				let sell = priceLine.querySelectorAll('td').filter(node => node.getAttribute('id') === 'td' + priceLine.getAttribute('data-flag') + 'Sell')[0]
					.childNodes[0].rawText;
				return {
					type,
					buy: parseFloat(buy),
					sell: parseFloat(sell)
				}
			});
	}
}

financeRouter.get('/prices', async (req, res) => {
	res.status(200).json({
		enpara: await getPrices('enpara'),
		ziraat: await getPrices('ziraat'),
		altın: await getPrices('altın')
	});
});

const summary = async () => {
	const financeData = JSON.parse(fs.readFileSync('./data/finance.json'));

	let prices = {
		enpara: await getPrices('enpara'),
		ziraat: await getPrices('ziraat'),
		altın: await getPrices('altın')
	}

	let currency = ['* USD', '* EUR', '* GBP', 'enpara Altın', 'ziraat A01', 'ziraat A02'];
	let liquidGold = [
		'Has Altın Toptan',
		'Külçe Altın Toptan',
		'Gram Altın Toptan',
		'Ata Cumhuriyet Toptan',
		'Eski Çeyrek Altın',
		'Eski Yarım Altın',
		'Eski Teklik Altın',
		'Gümüş',
		'Yarım Altın',
		'Teklik Altın',
		'Gremse Altın',
		'Resat Altın',
		'Hamit Altın',
		'Gram Altın'
	];

	let otherGold = [
		'22 Ayar Eski Bilezik',
		'Gümüş',
		'18 Ayar Altın',
		'14 Ayar Altın'
	];

	//console.log(financeData.map(asset => ((prices[asset.bank].filter(price => price.type === asset.type)[0] || { buy: 0 }).buy).toFixed() + ' x ' + asset.amount + ' ' + asset.type).join('\n'));

	const notFound = financeData.filter(asset => !prices[asset.bank] || prices[asset.bank].filter(price => price.type === asset.type).length === 0)
		.map(asset => asset.type);

	if (notFound.length > 0)
		return {
			eksik: notFound,
			toplam: financeData.reduce((total, asset) => total + (prices[asset.bank].filter(price => price.type === asset.type)[0] || { buy: 0 }).buy * asset.amount, 0)
		}
	else
		return {
			toplam: financeData.reduce((total, asset) => total + (prices[asset.bank].filter(price => price.type === asset.type)[0] || { buy: 0 }).buy * asset.amount, 0).toFixed(2),
			döviz: financeData.filter(asset => currency.filter(cur => (cur.split(' ')[0] === '*' || cur.split(' ')[0] === asset.bank) && cur.split(' ')[1] === asset.type).length > 0)
				.reduce((total, asset) => total + (prices[asset.bank].filter(price => price.type === asset.type)[0] || { buy: 0 }).buy * asset.amount, 0).toFixed(2),
			yatırımAltını: financeData.filter(asset => liquidGold.filter(type => asset.type == type).length > 0).reduce((total, asset) => total + (prices[asset.bank].filter(price => price.type === asset.type)[0] || { buy: 0 }).buy * asset.amount, 0).toFixed(2),
			ziynetAltını: financeData.filter(asset => otherGold.filter(type => asset.type == type).length > 0).reduce((total, asset) => total + (prices[asset.bank].filter(price => price.type === asset.type)[0] || { buy: 0 }).buy * asset.amount, 0).toFixed(2),
		}
};

financeRouter.get('/total', async (req, res) => res.status(200).json(await summary()));

setInterval(async () => {
	fs.appendFileSync('./data/history.txt', (new Date()).toString() + ' # ' + JSON.stringify(await summary()) + '\n');
}, 10 * 60 * 1000);

module.exports = { financeRouter }
