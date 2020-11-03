const utils = require('./utils');
const consts_global = require('./constants/consts_global');
const consts_page = require('./constants/consts_page');

module.exports = {
	scraper_video_informations: (source, keys) => {
		let rsl = {};

		if (keys.includes(consts_global.keys.DOWNLOAD_URLS)) {
			const matches = source.match(/(?<=\*\/)\w+/g);
			const urls = [];

			for (const match of matches) {
				const regex = new RegExp('(?<=' + match + '=")[^;]+(?=")', 'g');
				const value = source.match(regex)[0].replace(/[" +]/g, '');

				if (value.startsWith('https')) {
					if (urls.length === 4) {
						break;
					}

					urls.push(value);
				} else {
					urls[urls.length - 1] += value;
				}
			}

			rsl = urls.map(x => [x.match(/(?<=_|\/)\d*P(?=_)/g)[0], x]);
			rsl = Object.fromEntries(rsl);
		}

		return Object.keys(rsl).length > 0 ? rsl : null;
	},
	scraper_comments_informations: (doc, keys) => {
		if (keys.includes(consts_global.keys.COMMENTS)) {
			return {[consts_global.keys.COMMENTS]: utils.scraper_array(doc, consts_page.COMMENTS_LIST, consts_page.comment_selectors, consts_page.page_element_attributs)};
		}

		return {};
	},
	scraper_related_videos_informations: (doc, keys) => {
		if (keys.includes(consts_global.keys.RELATED_VIDEOS)) {
			return {[consts_global.keys.RELATED_VIDEOS]: utils.scraper_array(doc, consts_page.RELATED_VIDEOS_LIST, consts_page.related_videos_selectors, consts_page.page_related_videos_element_attributs)};
		}

		return {};
	},
	scraping_page: (source, keys) => {
		const doc = utils.source_to_dom(source);

		let datas = {};

		datas = {...datas, ...utils.scraper_content_informations(doc, keys, consts_page.page_selectors, consts_page.page_element_attributs)};
		datas = {...datas, DOWNLOAD_URLS: module.exports.scraper_video_informations(source, keys)};
		datas = {...datas, ...module.exports.scraper_comments_informations(doc, keys)};
		datas = {...datas, ...module.exports.scraper_related_videos_informations(doc, keys)};

		return datas;
	}
};
