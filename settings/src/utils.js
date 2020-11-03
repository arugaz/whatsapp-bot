const consts_global = require('./constants/consts_global');
const consts_page = require('./constants/consts_page');
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();
const jsdom = require('jsdom');
const {JSDOM} = jsdom;
const got = require('got');
const promise = require('promise');

module.exports = {
	is_parameter_missing: parameter => {
		return parameter === null || parameter === '' || parameter === undefined;
	},
	options_to_keys: key => {
		if (module.exports.is_parameter_missing(key)) {
			throw new Error('A key need to be used with this call');
		}

		const array_keys = Array.isArray(key) ? key : [key];
		const array_keys_uppercase = array_keys.map(x => x.toUpperCase());

		if (array_keys_uppercase.length === 0) {
			throw new Error('A key need to be used with this call');
		}

		return array_keys_uppercase;
	},
	createLink: (url, page, options) => {
		let q = '';
		if (options.production) {
			q += '&p=' + options.production;
		}

		const search = options.search ? options.search : 'video';
		return consts_global.links.BASE_URL + search + consts_global.links.SEARCH + url + '&page=' + (page + 1) + q;
	},
	url_to_source: async url => {
		url = module.exports.http_to_https(url);
		const safe_url = url.toLowerCase();
		const response = await got(safe_url);
		return response.body;
	},
	http_to_https: url => {
		return url.replace(/^http:/gi, 'https:');
	},
	multi_url_to_source: async (url, options) => {
		return promise.all([...new Array(options.page)].map(async (page, index) => {
			return module.exports.url_to_source(module.exports.createLink(url, index, options));
		}));
	},
	name_to_url: name => {
		if (module.exports.is_parameter_missing(name)) {
			return null;
		}

		const slug = name.replace(/\s/gi, '-').toLowerCase();
		return consts_global.links.BASE_URL + consts_global.links.MODEL + slug;
	},
	source_to_dom: source => {
		const dom = new JSDOM(source);
		return dom.window.document;
	},
	selectors_restriction: (keys, selectors) => {
		return Object.fromEntries(Object.keys(selectors).map(selector => {
			if (keys.includes(selector)) {
				return [selector, selectors[selector]];
			}

			return null;
		}).filter(x => x));
	},
	scraper_content_informations: (doc, keys, selectors, element_attributs) => {
		const selectors_restricted = module.exports.selectors_restriction(keys, selectors);
		return module.exports.scrap(doc, selectors_restricted, element_attributs);
	},
	convert_to_second: time => {
		if (module.exports.is_parameter_missing(time)) {
			return consts_global.NO_DATA;
		}

		const time_splitted = time.split(':');
		switch (time_splitted.length) {
			case 3:
				return ((+Number(time_splitted[0])) * 60 * 60) + ((+Number(time_splitted[1])) * 60) + (+Number(time_splitted[2]));
			case 2:
				return ((+Number(time_splitted[0])) * 60) + (+Number(time_splitted[1]));
			default:
				return Number(time);
		}
	},
	convert_KM_to_unit: units => {
		if (units.includes('K')) {
			return Number(units.replace('K', '')) * 1000;
		}

		if (units.includes('M')) {
			return Number(units.replace('M', '')) * 1000000;
		}

		return units;
	},
	scrap: (object, keys, attributs) => {
		return Object.fromEntries(Object.keys(keys).map(key => {
			switch (attributs[key]) {
				case 'innerHTML':
					if (!object.querySelector(keys[key])) {
						return [key, consts_global.NO_DATA];
					}

					return [key, object.querySelector(keys[key]).innerHTML];
				case 'dataContent':
					if (!object.querySelector(keys[key])) {
						return [key, consts_global.NO_DATA];
					}

					return [key, object.querySelector(keys[key]).getAttribute('content')];
				case 'textContent':
					if (!object.querySelector(keys[key])) {
						return [key, consts_global.NO_DATA];
					}

					return [key, object.querySelector(keys[key]).textContent];
				case 'multi_textContent': {
					const elm = [...object.querySelectorAll(keys[key])];
					if (!elm || elm.length === 0) {
						return [key, consts_global.NO_DATA];
					}

					return [key, elm.map(node => node.textContent)];
				}

				case 'javascript':
					return [key, JSON.parse(object.querySelector(keys[key]).textContent)[consts_page.javascript[key]]];
				case null:
					return object.querySelector(keys[key]) ? [key, true] : [key, false];
				default:
					return [key, object.querySelector(keys[key]).getAttribute(attributs[key])];
			}
		}));
	},
	scraper_array: (doc, global, selectors, attributs) => {
		const elements = [...doc.querySelectorAll(global)];
		return elements.map((element, index) => {
			const temporary = module.exports.scrap(element, selectors, attributs);
			return module.exports.sanitizer(temporary);
		});
	},
	sanitizer_number: value => {
		value = value.replace(/[()&A-Za-z,%]/g, '');
		value = Number(value);
		return value;
	},
	sanitizer_string: value => {
		value = value.replace(/[\t\n]/g, '');
		value = value.trim();
		value = entities.decode(value);
		return value;
	},
	sanitizer_key: value => {
		value = module.exports.sanitizer_string(value);
		value = value.replace(/\s/g, '_');
		value = value.replace(/:/g, '');
		value = value.toUpperCase();
		return value;
	},
	remove_duplicate: array => {
		return array.filter((item, index) => array.indexOf(item) === index);
	},
	sanitizer_array: array => {
		array = array.map(x => module.exports.sanitizer_string(x));
		return module.exports.remove_duplicate(array);
	},
	sanitizer_date: value => {
		return new Date(value);
	},
	sanitizer: datas => {
		const rsl = Object.keys(consts_global.type).map(x => {
			if (datas[x] === null || datas[x] === undefined) {
				return;
			}

			switch (consts_global.type[x]) {
				case consts_global.js_type.STRING:
					return [x.toLowerCase(), module.exports.sanitizer_string(datas[x])];
				case consts_global.js_type.ARRAY:
					return [x.toLowerCase(), module.exports.sanitizer_array(datas[x])];
				case consts_global.js_type.NUMBER:
					return [x.toLowerCase(), module.exports.sanitizer_number(datas[x])];
				case consts_global.js_type.BOOLEAN:
					return [x.toLowerCase(), Boolean(datas[x])];
				case consts_global.js_type.DATE:
					return [x.toLowerCase(), module.exports.sanitizer_date(datas[x])];
				case consts_global.js_type.NUMBER_KM:
					return [x.toLowerCase(), module.exports.convert_KM_to_unit(datas[x])];
				case consts_global.js_type.URL_PORNHUB:
					return [x.toLowerCase(), consts_global.links.BASE_URL + datas[x]];
				default:
					return [x.toLowerCase(), datas[x]];
			}
		}).filter(x => x);

		return Object.fromEntries(rsl);
	},
	error_message: error => {
		return {error: consts_global.errors.DEFAULT};
	}
};
