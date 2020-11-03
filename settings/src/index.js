'use strict';

const utils = require('./utils');
const consts_global = require('./constants/consts_global');
const page = require('./page');
const page_search = require('./search');
const page_model = require('./model');

module.exports = {
	page: async (url, key) => {
		try {
			const keys = utils.options_to_keys(key);
			const source = await utils.url_to_source(url);
			const datas = page.scraping_page(source, keys);
			return utils.sanitizer(datas);
		} catch (error) {
			return utils.error_message(error);
		}
	},
	model: async (name, key) => {
		try {
			const keys = utils.options_to_keys(key);
			const url = utils.name_to_url(name);
			const source = await utils.url_to_source(url);
			const datas = page_model.scrap(source, keys);
			const datas_filtered = page_model.filter_value(datas, keys);
			return utils.sanitizer(datas_filtered);
		} catch (error) {
			return utils.error_message(error);
		}
	},
	search: async (search, key, options) => {
		try {
			const keys = utils.options_to_keys(key);
			if (!options || !options.page) {
				options = options ? options : {};
				options.page = 1;
			}

			const source = await utils.multi_url_to_source(search, options);
			const datas = page_search.scraping_search(source, keys, options);
			return utils.sanitizer(datas);
		} catch (error) {
			return utils.error_message(error);
		}
	}
};
