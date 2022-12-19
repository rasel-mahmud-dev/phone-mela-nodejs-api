import passport from "passport"

const GoogleStrategy = require('passport-google-oauth20').Strategy;

const GOOGLE_REDIRECT_URL = process.env.BACKEND_URI + "/api/auth/callback/google"
// it will redirect to = "/api/auth/callback/google"


passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_REDIRECT_URL
    },
    async function (accessToken, refreshToken, profile, cb) {

        let email = profile.emails && profile.emails.length > 0 && profile.emails[0]
        let photo = profile.photos && profile.photos.length > 0 && profile.photos[0]
        cb(null, {
            id: profile.id,
            username: profile.displayName,
            email: email?.value,
            photo: photo?.value
        })
    }
));

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

module.exports = {}