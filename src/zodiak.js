/* eslint-disable no-console */
const axios = require('axios').default;

const getZodiak = (nama, tgl) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  new Promise((resolve, reject) => {
    // console.log(`${nama} - ${tgl}`);
    axios
      .get(`https://script.google.com/macros/exec?service=AKfycbw7gKzP-WYV2F5mc9RaR7yE3Ve1yN91Tjs91hp_jHSE02dSv9w&nama=${nama}&tanggal=${tgl}`)
      .then((response) => {
        // console.log(response.data);
        // eslint-disable-next-line object-curly-newline
        const { lahir, usia, ultah, zodiak } = response.data.data;
        let text = `*Nama*: ${nama}\n`;
        text += `*Lahir*: ${lahir}\n`;
        text += `*Usia*: ${usia}\n`;
        text += `*Ultah*: ${ultah}\n`;
        text += `*Zodiak*: ${zodiak}`;
        resolve(text);
      })
      .catch((error) => reject(error));
  });

module.exports.getZodiak = getZodiak;
