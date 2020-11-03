module.exports = {
	PROFIL_INFOS_LIST: '.infoPiece',
	model_selectors: {
		TITLE: 'h1',
		RANK_MODEL: '.rankingInfo div:nth-child(1) .big',
		RANK_WEEK_MODEL: '.rankingInfo div:nth-child(2) .big',
		RANK_MONTH_MODEL: '.rankingInfo div:nth-child(3) .big',
		RANK_LAST_MONTH_MODEL: '.rankingInfo div:nth-child(4) .big',
		RANK_YEAR_MODEL: '.rankingInfo div:nth-child(5) .big',
		DESCRIPTION: '.model-details .aboutMeSection div:nth-child(2)',
		VIDEO_NUMBER: '.pornstarVideosCounter'
	},
	model_element_attributs: {
		TITLE: 'innerHTML',
		DESCRIPTION: 'innerHTML',
		RANK_MODEL: 'textContent',
		RANK_WEEK_MODEL: 'textContent',
		RANK_MONTH_MODEL: 'textContent',
		RANK_LAST_MONTH_MODEL: 'textContent',
		RANK_YEAR_MODEL: 'textContent',
		VIDEO_NUMBER: 'textContent'
	}
};
