module.exports = {
	VIDEOS_LIST: '#videoSearchResult .pcVideoListItem',
	videos_search_selectors: {
		LINK: 'a',
		TITLE: '.title a',
		HD: 'a .marker-overlays .hd-thumbnail',
		DURATION: 'a .marker-overlays .duration',
		VIEWS: '.videoDetailsBlock var',
		PREMIUM: 'a .marker-overlays .premiumIcon',
		AUTHOR: '.videoUploaderBlock .usernameWrap a',
		RATINGS: '.rating-container .value'
	},
	videos_element_attributs: {
		LINK: 'href',
		TITLE: 'title',
		HD: null,
		DURATION: 'innerHTML',
		VIEWS: 'innerHTML',
		PREMIUM: null,
		AUTHOR: 'innerHTML',
		RATINGS: 'innerHTML',
		RELATED_SEARCH: 'multi_textContent',
		RELATED_PORNSTARS: 'multi_textContent',
		ACTOR: 'innerHTML',
		VIDEO_NUMBER: 'innerHTML',
		VIEW_NUMBER: 'innerHTML',
		RANK: 'innerHTML'
	}
};
