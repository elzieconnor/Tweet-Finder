'use strict';

const express = require('express'),
	cookieParser = require('cookie-parser'),
	expressSession = require('express-session'),
	passport = require('passport'),
	ensureAuthenticated = require('./modules/ensureAuthenticated'),
	TwitterStrategy = require('passport-twitter').Strategy,
	Twitter = require('twitter'),
	request = require('request'),
	http = require('http'),
	app = express();

const T = new Twitter({
	consumer_key: 'vLHfUa437ECQDnCqbikfpHnxh',
	consumer_secret: 'ygZ6HH19vMwm3hGQnSFGKimaBNClzPZUWKoq4TKXqNnOTZPkP4',
	access_token_key: '898531406703407108-qkmMO2wAyyXjo8XIG2B59dSlWY6OXZQ',
	access_token_secret: 'vBNdwsDeaI8WNQ1gWdtp70keg0EsutgpWNeliD56uj8v6'
});

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({
	extended: true
}));

app.use(express.static('resources'));

app.use(expressSession({ secret: 'burger', resave: false, saveUninitialized: false, cookie : { secure: false }}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new TwitterStrategy({
	consumerKey: 'vLHfUa437ECQDnCqbikfpHnxh',
	consumerSecret: 'ygZ6HH19vMwm3hGQnSFGKimaBNClzPZUWKoq4TKXqNnOTZPkP4',
	callbackURL: "http://localhost:3000/auth/twitter/callback" 
	},
	function(token, tokenSecret, profile, done) {
		return done(null, profile);
		})
);

passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (user, done) {
	done(null, user);
});

app.get('/', function(req, res){
	res.render('login');
});

app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/auth/twitter/callback', passport.authenticate('twitter', {
	failureRedirect: '/login',
	successRedirect: '/normal'
}));

app.get('/logout', ensureAuthenticated.ensureAuthenticated, function (req, res) {
	req.logout();
	res.redirect('/');
});

app.get('/normal', ensureAuthenticated.ensureAuthenticated, async(req, res) => {
	try {
		const data = await T.get('search/tweets', {q: '#csc365', count: 8, result_type: 'recent'});
		res.render('normal', { tweet_0: data.statuses[0].text,
			tweet_1: data.statuses[1].text,
			tweet_2: data.statuses[2].text,
			tweet_3: data.statuses[3].text,
			tweet_4: data.statuses[4].text,
			tweet_5: data.statuses[5].text,
			tweet_6: data.statuses[6].text,
			tweet_7: data.statuses[7].text,
			id_0: data.statuses[0].id_str,
			id_1: data.statuses[1].id_str,
			id_2: data.statuses[2].id_str,
			id_3: data.statuses[3].id_str,
			id_4: data.statuses[4].id_str,
			id_5: data.statuses[5].id_str,
			id_6: data.statuses[6].id_str,
			id_7: data.statuses[7].id_str
		});
	} catch(error) {
		console.log(error);
	}
});

app.get('/tweet/:id', ensureAuthenticated.ensureAuthenticated, async(req, res) => {
	try {
		const data = await T.get('statuses/show/' + req.params.id, {});    
		res.render('tweet', { stweet_text: [data.text], stweet_id: [data.id], stweet_name: [data.user.name], stweet_username: [data.user.screen_name], stweet_created: [data.created_at], stweet_picture: [data.user.profile_image_url_https] });
	} catch(error) {
		console.log(error);
	}
});

app.listen(3000, function () {
	console.log('Listening on http://localhost:3000');
});