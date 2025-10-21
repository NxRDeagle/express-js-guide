import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import { GoogleUser } from "../mongoose/schemas/google-user.mjs";

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const findUser = await GoogleUser.findById(id);
    if (!findUser) {
      throw new Error("User Not Found.");
    }
    done(null, findUser);
  } catch (err) {
    done(err, null);
  }
});

export default passport.use(
  new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      let findUser;
      try {
        findUser = await GoogleUser.findOne({ googleId: profile.id });
      } catch (err) {
        done(err, null);
      }
      try {
        if (!findUser) {
          const newUser = new GoogleUser({
            username: profile.displayName,
            googleId: profile.id,
          });
          const newSavedUser = await newUser.save();
          return done(null, newSavedUser);
        }
        return done(null, findUser);
      } catch (err) {
        console.log(err);
        done(err, null);
      }
    }
  )
);
