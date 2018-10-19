// const Twitter = require("twitter");
// const sites = require("../sites");
//
//
// module.exports = async function() {
//   for (let site of sites) {
//     console.log(`======= ${site.title} ======= `);
//
//     let params = { screen_name: site.screenName, trim_user: true, count: 50 };
//     await client.get("statuses/user_timeline", params, function(
//       error,
//       tweets,
//       response
//     ) {
//       if (!error) {
//         for (let tweet of tweets) {
//           console.log("Text", tweet.text);
//           console.log(
//             "Hashtags",
//             tweet.entities.hashtags,
//             tweet.entities.user_mentions
//           );
//         }
//       } else {
//         console.log(error);
//       }
//     });
//   }
// };
