function ensureAuthenticated (req, res, next) {
	if (req.isAuthenticated()) {
		next();
	}
	else {
		res.render('nope', { message: "Log in first!" })
	}
};

module.exports = {
    ensureAuthenticated: ensureAuthenticated
};