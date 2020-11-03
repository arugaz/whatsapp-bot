module.exports = {
	GIFS_LIST: '.gifsWrapper .gifVideoBlock',
	gifs_search_selectors: {
		TITLE: '.title',
		THUMBNAIL_URL: '.gifVideo',
		LINK_MP4: '.gifVideo',
		LINK_WEBM: '.gifVideo'
	},
	gifs_element_attributs: {
		TITLE: 'textContent',
		THUMBNAIL_URL: 'data-poster',
		LINK_MP4: 'data-mp4',
		LINK_WEBM: 'data-webm'
	}
};
