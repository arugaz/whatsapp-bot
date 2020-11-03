const utils = require('./utils');
const consts_global = require('./constants/consts_global');
const consts_search = require('./constants/consts_search');
const consts_search_gifs = require('./constants/consts_search_gifs');
const consts_search_pornstars = require('./constants/consts_search_pornstars');
const consts_search_videos = require('./constants/consts_search_videos');
const jsdom = require('jsdom');
const {JSDOM} = jsdom;

module.exports = {
	scraping_search: (source, keys, options) => {
		const doc = utils.source_to_dom(source);

		let datas = {};
		datas = {...datas, ...utils.scraper_content_informations(doc, keys, consts_search.primary_search_selectors, consts_search.page_search_element_attributs)};
		if (!options.search || options.search === 'video') {
			datas[consts_global.keys.RESULTS] = utils.scraper_array(doc, consts_search_videos.VIDEOS_LIST, consts_search_videos.videos_search_selectors, consts_search_videos.videos_element_attributs);
		}

		if (options.search === 'pornstars') {
			datas[consts_global.keys.RESULTS] = utils.scraper_array(doc, consts_search_pornstars.PORNSTARS_LIST, consts_search_pornstars.pornstars_search_selectors, consts_search_pornstars.pornstars_element_attributs);
		}

		if (options.search === 'gifs') {
			datas[consts_global.keys.RESULTS] = utils.scraper_array(doc, consts_search_gifs.GIFS_LIST, consts_search_gifs.gifs_search_selectors, consts_search_gifs.gifs_element_attributs);
		}

		return datas;
	}
};
