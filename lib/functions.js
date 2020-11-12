const fetch = require('node-fetch')

const request = require('request')
const axios = require("axios")


const wallpaperanime = async () => {
    // const url = 'https://nekos.life/api/v2/img/wallpaper';
    // const response = await fetch(url);
    const response = await fetch('https://nekos.life/api/v2/img/wallpaper');
    if (!response.ok) throw new Error(`unexpected response`);
    const json = await response.json()
    return json.url
}

const lolie = async () => {
    const response = await fetch('https://mhankbarbar.herokuapp.com/api/randomloli');
    if (!response.ok) throw new Error(`unexpected response`);
    const json = await response.json()
    return json.result
}
const nekonime = async () => {
    const response = await fetch('https://mhankbarbar.herokuapp.com/api/nekonime');
    if (!response.ok) throw new Error(`unexpected response`);
    const json = await response.json()
    return json.result
}
const hentai = async () => {
    const response = await fetch('https://mhankbarbar.herokuapp.com/api/random/hentai');
    if (!response.ok) throw new Error(`unexpected response`);
    const json = await response.json()
    return json.result
}
const trap = async () => {
    const response = await fetch('https://mhankbarbar.herokuapp.com/api/random/trap');
    if (!response.ok) throw new Error(`unexpected response`);
    const json = await response.json()
    return json.result
}
const nfswneko = async () => {
    const response = await fetch('https://mhankbarbar.herokuapp.com/api/random/nsfwneko');
    if (!response.ok) throw new Error(`unexpected response`);
    const json = await response.json()
    return json.result
}
const liriklagu = async (lagu) => {
    const response = await fetch(`http://scrap.terhambar.com/lirik?word=${lagu}`)
    if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);
    const json = await response.json()
    if (json.status === true) return `Lirik ${lagu}\n\n${json.result.lirik}`
    return `[ Error ] Lirik Lagu ${lagu} tidak di temukan!`
}
exports.liriklagu = liriklagu;
exports.lolie = lolie;
exports.wallpaperanime = wallpaperanime;
exports.nekonime = nekonime;
exports.hentai = hentai;
exports.trap = trap;
exports.nfswneko = nfswneko;