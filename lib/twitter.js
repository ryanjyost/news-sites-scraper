const Twitter = require("twitter");
const sites = require("../sites");

const client = new Twitter({
  consumer_key: "LOYn0wyBUf3sQMZUTqed5tw5D",
  consumer_secret: "yyU1FyoQeScSOQuWyxDB1DN7g6a6rgwlDG3Mnu62A1m3jXib75",
  access_token_key: "738553940715950080-0BQGCfe4QbaGHEupeiQ95DZGKELGfC5",
  access_token_secret: "RNdTVuaUGf6tLHRcycbMcYkg24NVnxk2VbFXKCtewiRB9"
});

module.exports = async function() {
  for (let site of sites) {
    console.log(`======= ${site.title} ======= `);

    let params = { screen_name: site.screenName, trim_user: true, count: 50 };
    await client.get("statuses/user_timeline", params, function(
      error,
      tweets,
      response
    ) {
      if (!error) {
        for (let tweet of tweets) {
          console.log("Text", tweet.text);
          console.log(
            "Hashtags",
            tweet.entities.hashtags,
            tweet.entities.user_mentions
          );
        }
      } else {
        console.log(error);
      }
    });
  }
};
