/* eslint-disable no-console */
const axios = require('axios').default;
const cheerio = require('cheerio');
const qs = require('qs');

const ramalanCinta = (n1, t1, n2, t2) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  new Promise((resolve, reject) => {
    const data = qs.stringify({
      nama1: n1,
      tanggal1: t1.split('-')[0],
      bulan1: t1.split('-')[1],
      tahun1: t1.split('-')[2],
      nama2: n2,
      tanggal2: t2.split('-')[0],
      bulan2: t2.split('-')[1],
      tahun2: t2.split('-')[2],
      submit: '+Submit!+',
    });
    const config = {
      method: 'post',
      url: 'http://www.primbon.com/ramalan_cinta.php',
      data,
    };
    axios(config)
      .then((response) => {
        const $ = cheerio.load(response.data);
        let text = `*${$('#body > b:nth-child(1)').text()}*\n\n`;
        text += `*${$('#body > b:nth-child(4)').text()}*\n`;
        text += `${$('#body').contents()[9].data}\n\n`;
        text += `*${$('#body > b:nth-child(8)').text()}*\n`;
        text += `${$('#body').contents()[15].data}\n\n`;
        text += `*${$('#body > b:nth-child(12)').text()}*${$('#body').contents()[20].data}\n`;
        text += `*${$('#body > b:nth-child(14)').text()}*${$('#body').contents()[23].data}\n\n`;
        text += `${$('#body').contents()[29].data.trim()}`;
        // console.log(result);
        resolve(text);
      })
      .catch((error) => reject(error));
  });

module.exports.ramalanCinta = ramalanCinta;
