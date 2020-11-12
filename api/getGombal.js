const axios = require("axios");

const APIURL = "https://api-neraka.vercel.app/api/";

exports.getGombal = async () => {
    const getWords = await axios.get(APIURL + "bucin");
    const result = getWords.data.result;
    const { kata } = result;
    return kata;
};

exports.getGay = async () => {
    const getPercentage = await axios.get(APIURL + "gay");
    const result = getPercentage.data.result;
    return result;
};

exports.getJodoh = async () => {
    const getPercentage = await axios.get(APIURL + "jodoh");
    const result = getPercentage.data.result;
    return result;
};
