function root() {
	return '/plans';
}

function plans( siteName = ':site', intervalType ) {
	if ( intervalType ) {
		return `${ root() }/${ intervalType }/${ siteName }`;
	}
	return `${ root() }/${ siteName }`;
}

function plansDestination( siteName = ':site', destinationType = ':destinationType?' ) {
	return plans( siteName ) + `/${ destinationType }`;
}

export default {
	plans,
	plansDestination
};
