const to = require("./to");

module.exports = async function(page, site) {
  // every switch stmt should return an array of link objects
  let $err, $linkObjects, $promiseForData, $array;

  switch (site.name) {
    /* ------------------------------------------------------------- */
    case "cnn":
      [$err, $linkObjects] = await to(
        page.$$eval(".cd__headline-text", links => {
          let top10 = links.slice(0, 10);

          $promiseForData = new Promise((resolve, reject) => {
            $array = [];
            for (let link of top10) {
              let anchor = link.closest("a");
              $array.push({ text: link.textContent.trim(), href: anchor.href });
            }

            resolve($array);
          });

          return $promiseForData;
        })
      );

      break;
    /* ------------------------------------------------------------- */
    case "foxnews":
      [$err, $linkObjects] = await to(
        page.evaluate(() => {
          const anchors = Array.from(document.querySelectorAll(".title a"));

          $promiseForData = new Promise((resolve, reject) => {
            $array = [];

            for (let anchor of anchors) {
              if ($array.length >= 10) {
                break;
              } else if (anchor.textContent.length > 25) {
                $array.push({
                  text: anchor.textContent.trim(),
                  href: anchor.href
                });
              }
            }

            resolve($array);
          });

          return $promiseForData;
        })
      );
      break;
    /* ------------------------------------------------------------- */
    case "msnbc":
      [$err, $linkObjects] = await to(
        page.evaluate(() => {
          const titles = Array.from(
            document.querySelectorAll(
              ".featured-slider-menu__item__link__title"
            )
          );

          $promiseForData = new Promise((resolve, reject) => {
            $array = [];

            for (let title of titles) {
              if ($array.length >= 10) {
                break;
              } else {
                const anchor = title.closest(
                  ".featured-slider-menu__item__link"
                );
                $array.push({
                  text: title.textContent.trim(),
                  href: anchor.href
                });
              }
            }
            resolve($array);
          });

          return $promiseForData;
        })
      );
      break;
    /* ------------------------------------------------------------- */
    case "bloomberg":
      [$err, $linkObjects] = await to(
        page.evaluate(() => {
          const anchors = Array.from(
            document.querySelectorAll(
              ".story-package-module__story__headline-link,  .single-story-module__headline-link"
            )
          );

          $promiseForData = new Promise((resolve, reject) => {
            $array = [];

            for (let anchor of anchors) {
              if ($array.length >= 10) {
                break;
              } else {
                $array.push({
                  text: anchor.textContent.trim(),
                  href: anchor.href
                });
              }
            }
            resolve($array);
          });

          return $promiseForData;
        })
      );
      break;
    /* ------------------------------------------------------------- */
    case "nytimes":
      [$err, $linkObjects] = await to(
        page.evaluate(() => {
          const anchors = Array.from(
            document.querySelectorAll(".story-heading a")
          );

          $promiseForData = new Promise((resolve, reject) => {
            $array = [];

            for (let anchor of anchors) {
              if ($array.length >= 10) {
                break;
              } else {
                const title = anchor.closest(".story-heading");
                $array.push({
                  text: title.textContent.trim(),
                  href: anchor.href
                });
              }
            }
            resolve($array);
          });

          return $promiseForData;
        })
      );
      break;
    /* ------------------------------------------------------------- */
    case "thenewyorker":
      [$err, $linkObjects] = await to(
        page.evaluate(() => {
          const titles = Array.from(
            document.querySelectorAll(".Card__hed___31cLY")
          );

          $promiseForData = new Promise((resolve, reject) => {
            $array = [];

            for (let title of titles) {
              if ($array.length >= 10) {
                break;
              } else {
                const anchor = title.closest("a");
                $array.push({
                  text: title.textContent.trim(),
                  href: anchor.href
                });
              }
            }
            resolve($array);
          });

          return $promiseForData;
        })
      );
      break;
    /* ------------------------------------------------------------- */
    case "huffpo":
      [$err, $linkObjects] = await to(
        page.evaluate(() => {
          const titles = Array.from(document.querySelectorAll(".card__link"));

          $promiseForData = new Promise((resolve, reject) => {
            $array = [];

            for (let title of titles) {
              if ($array.length >= 10) {
                break;
              } else {
                $array.push({
                  text: title.textContent.trim(),
                  href: title.href
                });
              }
            }
            resolve($array);
          });

          return $promiseForData;
        })
      );
      break;
    /* ------------------------------------------------------------- */
    case "yahoonews":
      [$err, $linkObjects] = await to(
        page.evaluate(() => {
          const titles = Array.from(
            document.querySelectorAll(".js-stream-content a")
          );

          $promiseForData = new Promise((resolve, reject) => {
            $array = [];

            for (let title of titles) {
              if ($array.length >= 10) {
                break;
              } else {
                $array.push({
                  text: title.textContent.trim(),
                  href: title.href
                });
              }
            }
            resolve($array);
          });

          return $promiseForData;
        })
      );
      break;
    /* ------------------------------------------------------------- */
    case "googlenews":
      [$err, $linkObjects] = await to(
        page.evaluate(() => {
          const titles = Array.from(document.querySelectorAll(".kWyHVd a"));

          $promiseForData = new Promise((resolve, reject) => {
            $array = [];

            for (let title of titles) {
              if ($array.length >= 10) {
                break;
              } else {
                $array.push({
                  text: title.textContent.trim(),
                  href: title.href
                });
              }
            }
            resolve($array);
          });

          return $promiseForData;
        })
      );
      break;
    /* ------------------------------------------------------------- */
    case "nbcnews":
      [$err, $linkObjects] = await to(
        page.evaluate(() => {
          const lead = Array.from(
            document.querySelectorAll(".item-heading_lead")
          )[0];
          const titles = Array.from(
            document.querySelectorAll(".item-heading_sm")
          );

          titles.unshift(lead);

          $promiseForData = new Promise((resolve, reject) => {
            $array = [];

            for (let title of titles) {
              if ($array.length >= 10) {
                break;
              } else {
                const anchor = title.closest("a");
                $array.push({
                  text: title.textContent.trim(),
                  href: anchor.href
                });
              }
            }
            resolve($array);
          });

          return $promiseForData;
        })
      );
      break;
    /* ------------------------------------------------------------- */
    case "dailymail":
      [$err, $linkObjects] = await to(
        page.evaluate(() => {
          const titles = Array.from(
            document.querySelectorAll(".linkro-darkred a")
          );

          $promiseForData = new Promise((resolve, reject) => {
            $array = [];

            for (let title of titles) {
              if ($array.length >= 10) {
                break;
              } else {
                $array.push({
                  text: title.textContent.trim(),
                  href: title.href
                });
              }
            }

            resolve($array);
          });

          return $promiseForData;
        })
      );
      break;
    /* ------------------------------------------------------------- */
    case "guardian":
      [$err, $linkObjects] = await to(
        page.evaluate(() => {
          const titles = Array.from(
            document.querySelectorAll(".u-faux-block-link__overlay")
          );

          $promiseForData = new Promise((resolve, reject) => {
            $array = [];

            for (let title of titles) {
              if ($array.length >= 10) {
                break;
              } else {
                $array.push({
                  text: title.textContent.trim(),
                  href: title.href
                });
              }
            }

            resolve($array);
          });

          return $promiseForData;
        })
      );
      break;
    /* ------------------------------------------------------------- */
    case "wsj":
      [$err, $linkObjects] = await to(
        page.evaluate(() => {
          const titles = Array.from(
            document.querySelectorAll(".wsj-headline-link")
          );

          $promiseForData = new Promise((resolve, reject) => {
            $array = [];

            for (let title of titles) {
              if ($array.length >= 10) {
                break;
              } else {
                $array.push({
                  text: title.textContent.trim(),
                  href: title.href
                });
              }
            }

            resolve($array);
          });

          return $promiseForData;
        })
      );
      break;
    /* ------------------------------------------------------------- */
    case "abcnews":
      [$err, $linkObjects] = await to(
        page.evaluate(() => {
          const titles = Array.from(
            document.querySelectorAll(".white-ln", ".black-ln")
          );

          $promiseForData = new Promise((resolve, reject) => {
            $array = [];

            for (let title of titles) {
              if ($array.length >= 10) {
                break;
              } else {
                if (title.href.includes("http")) {
                  $array.push({
                    text: title.textContent.trim(),
                    href: title.href
                  });
                }
              }
            }

            resolve($array);
          });

          return $promiseForData;
        })
      );
      break;
    /* ------------------------------------------------------------- */
    case "bbcnews":
      [$err, $linkObjects] = await to(
        page.evaluate(() => {
          const titles = Array.from(document.querySelectorAll(".media__link"));

          $promiseForData = new Promise((resolve, reject) => {
            $array = [];

            for (let title of titles) {
              if ($array.length >= 10) {
                break;
              } else {
                $array.push({
                  text: title.textContent.trim(),
                  href: title.href
                });
              }
            }

            resolve($array);
          });

          return $promiseForData;
        })
      );
      break;
    /* ------------------------------------------------------------- */
    case "usatoday":
      [$err, $linkObjects] = await to(
        page.evaluate(() => {
          const titles = Array.from(
            document.querySelectorAll(".js-asset-headline")
          );

          $promiseForData = new Promise((resolve, reject) => {
            $array = [];

            for (let title of titles) {
              if ($array.length >= 10) {
                break;
              } else {
                const anchor = title.closest("a");
                $array.push({
                  text: title.textContent.trim(),
                  href: anchor.href
                });
              }
            }

            resolve($array);
          });

          return $promiseForData;
        })
      );
      break;
    /* ------------------------------------------------------------- */
    case "latimes":
      [$err, $linkObjects] = await to(
        page.evaluate(() => {
          const titles = Array.from(
            document.querySelectorAll(".card-content h5 a")
          );

          $promiseForData = new Promise((resolve, reject) => {
            $array = [];

            for (let title of titles) {
              if ($array.length >= 10) {
                break;
              } else {
                const anchor = title.closest("a");
                $array.push({
                  text: title.textContent.trim(),
                  href: anchor.href
                });
              }
            }

            resolve($array);
          });

          return $promiseForData;
        })
      );
      break;
    /* ------------------------------------------------------------- */
    case "cbsnews":
      [$err, $linkObjects] = await to(
        page.evaluate(() => {
          const titles = Array.from(
            document.querySelectorAll(".item-full-lead .title")
          );

          $promiseForData = new Promise((resolve, reject) => {
            $array = [];

            for (let title of titles) {
              if ($array.length >= 10) {
                break;
              } else {
                const anchor = title.closest("a");
                $array.push({
                  text: title.textContent.trim(),
                  href: anchor.href
                });
              }
            }

            resolve($array);
          });

          return $promiseForData;
        })
      );
      break;
    /* ------------------------------------------------------------- */
    case "reuters":
      [$err, $linkObjects] = await to(
        page.evaluate(() => {
          const titles = Array.from(
            document.querySelectorAll(".story-title a", ".story-content a")
          );

          $promiseForData = new Promise((resolve, reject) => {
            $array = [];

            for (let title of titles) {
              if ($array.length >= 10) {
                break;
              } else {
                $array.push({
                  text: title.textContent.trim(),
                  href: title.href
                });
              }
            }

            resolve($array);
          });

          return $promiseForData;
        })
      );
      break;
    /* ------------------------------------------------------------- */
    case "thehill":
      [$err, $linkObjects] = await to(
        page.evaluate(() => {
          const titles = Array.from(
            document.querySelectorAll(
              ".top-story-headline a, .top-story-item h4 a"
            )
          );

          $promiseForData = new Promise((resolve, reject) => {
            $array = [];

            for (let title of titles) {
              if ($array.length >= 10) {
                break;
              } else {
                $array.push({
                  text: title.textContent.trim(),
                  href: title.href
                });
              }
            }

            resolve($array);
          });

          return $promiseForData;
        })
      );
      break;
    /* ------------------------------------------------------------- */
    case "time":
      [$err, $linkObjects] = await to(
        page.evaluate(() => {
          const titles = Array.from(document.querySelectorAll(".headline a"));

          $promiseForData = new Promise((resolve, reject) => {
            $array = [];

            for (let title of titles) {
              if ($array.length >= 10) {
                break;
              } else {
                $array.push({
                  text: title.textContent.trim(),
                  href: title.href
                });
              }
            }

            resolve($array);
          });

          return $promiseForData;
        })
      );
      break;
    /* ------------------------------------------------------------- */
    case "nationalreview":
      [$err, $linkObjects] = await to(
        page.evaluate(() => {
          const titles = Array.from(
            document.querySelectorAll(".post-list-article__title a")
          );

          $promiseForData = new Promise((resolve, reject) => {
            $array = [];

            for (let title of titles) {
              if ($array.length >= 10) {
                break;
              } else {
                $array.push({
                  text: title.textContent.trim(),
                  href: title.href
                });
              }
            }

            resolve($array);
          });

          return $promiseForData;
        })
      );
      break;
    /* ------------------------------------------------------------- */
    case "theatlantic":
      [$err, $linkObjects] = await to(
        page.evaluate(() => {
          const titles = Array.from(
            document.querySelectorAll(
              ".c-cover-story__hed-link, .c-offlede__hed-link, .c-story-strip__hed-link, c-card__hed a"
            )
          );

          $promiseForData = new Promise((resolve, reject) => {
            $array = [];

            for (let title of titles) {
              if ($array.length >= 10) {
                break;
              } else {
                $array.push({
                  text: title.textContent.trim(),
                  href: title.href
                });
              }
            }

            resolve($array);
          });

          return $promiseForData;
        })
      );
      break;
    /* ------------------------------------------------------------- */
    case "politico":
      [$err, $linkObjects] = await to(
        page.evaluate(() => {
          const titles = Array.from(document.querySelectorAll(".headline a"));

          $promiseForData = new Promise((resolve, reject) => {
            $array = [];

            for (let title of titles) {
              if ($array.length >= 10) {
                break;
              } else {
                $array.push({
                  text: title.textContent.trim(),
                  href: title.href
                });
              }
            }

            resolve($array);
          });

          return $promiseForData;
        })
      );
      break;
    /* ------------------------------------------------------------- */
    case "theweeklystandard":
      [$err, $linkObjects] = await to(
        page.evaluate(() => {
          const titles = Array.from(
            document.querySelectorAll(".HeroTextBelowPromo-title a")
          );

          $promiseForData = new Promise((resolve, reject) => {
            $array = [];

            for (let title of titles) {
              if ($array.length >= 10) {
                break;
              } else {
                if (title.textContent.length) {
                  $array.push({
                    text: title.textContent.trim(),
                    href: title.href
                  });
                }
              }
            }

            resolve($array);
          });

          return $promiseForData;
        })
      );
      break;
    /* ------------------------------------------------------------- */
    case "vox":
      [$err, $linkObjects] = await to(
        page.evaluate(() => {
          const titles = Array.from(
            document.querySelectorAll(".c-entry-box--compact__title a")
          );

          $promiseForData = new Promise((resolve, reject) => {
            $array = [];

            for (let title of titles) {
              if ($array.length >= 10) {
                break;
              } else {
                $array.push({
                  text: title.textContent.trim(),
                  href: title.href
                });
              }
            }

            resolve($array);
          });

          return $promiseForData;
        })
      );
      break;
    /* ------------------------------------------------------------- */
    case "washingtontimes":
      [$err, $linkObjects] = await to(
        page.evaluate(() => {
          const titles = Array.from(
            document.querySelectorAll(".article-headline a")
          );

          $promiseForData = new Promise((resolve, reject) => {
            $array = [];

            for (let title of titles) {
              if ($array.length >= 10) {
                break;
              } else {
                $array.push({
                  text: title.textContent.trim(),
                  href: title.href
                });
              }
            }

            resolve($array);
          });

          return $promiseForData;
        })
      );
      break;
    /* ------------------------------------------------------------- */
    case "slate":
      [$err, $linkObjects] = await to(
        page.evaluate(() => {
          const titles = Array.from(
            document.querySelectorAll(
              ".story-card__headline, .story-teaser__headline"
            )
          );

          $promiseForData = new Promise((resolve, reject) => {
            $array = [];

            for (let title of titles) {
              if ($array.length >= 10) {
                break;
              } else {
                const link = title.closest("a");
                $array.push({
                  text: title.textContent.trim(),
                  href: link.href
                });
              }
            }

            resolve($array);
          });

          return $promiseForData;
        })
      );
      break;
    /* ------------------------------------------------------------- */
    case "washingtonexaminer":
      [$err, $linkObjects] = await to(
        page.evaluate(() => {
          const titles = Array.from(document.querySelectorAll(".Link"));

          $promiseForData = new Promise((resolve, reject) => {
            $array = [];

            for (let title of titles) {
              if ($array.length >= 10) {
                break;
              } else {
                if (title.textContent.length && title.href.includes("/news/")) {
                  $array.push({
                    text: title.textContent.trim(),
                    href: title.href
                  });
                }
              }
            }

            resolve($array);
          });

          return $promiseForData;
        })
      );
      break;
    /* ------------------------------------------------------------- */
    case "nationalreview":
      [$err, $linkObjects] = await to(
        page.evaluate(() => {
          const titles = Array.from(document.querySelectorAll(".Link"));

          $promiseForData = new Promise((resolve, reject) => {
            $array = [];

            for (let title of titles) {
              if ($array.length >= 10) {
                break;
              } else {
                if (title.textContent.length && title.href.includes("/news/")) {
                  $array.push({
                    text: title.textContent.trim(),
                    href: title.href
                  });
                }
              }
            }

            resolve($array);
          });

          return $promiseForData;
        })
      );
      break;

    /* ------------------------------------------------------------- */
    case "dailybeast":
      [$err, $linkObjects] = await to(
        page.evaluate(() => {
          const titles = Array.from(document.querySelectorAll(".TitleText"));

          $promiseForData = new Promise((resolve, reject) => {
            $array = [];

            for (let title of titles) {
              if ($array.length >= 10) {
                break;
              } else {
                const link = title.closest("a");
                $array.push({
                  text: title.textContent.trim(),
                  href: link.href
                });
              }
            }

            resolve($array);
          });

          return $promiseForData;
        })
      );
      break;

    /* ------------------------------------------------------------- */
    case "federalist":
      [$err, $linkObjects] = await to(
        page.evaluate(() => {
          const titles = Array.from(
            document.querySelectorAll(".entry-title a")
          );

          $promiseForData = new Promise((resolve, reject) => {
            $array = [];

            for (let title of titles) {
              if ($array.length >= 10) {
                break;
              } else {
                $array.push({
                  text: title.textContent.trim(),
                  href: title.href
                });
              }
            }

            resolve($array);
          });

          return $promiseForData;
        })
      );
      break;
    /* ------------------------------------------------------------- */
    case "newrepublic":
      [$err, $linkObjects] = await to(
        page.evaluate(() => {
          const titles = Array.from(
            document.querySelectorAll(".card-headline")
          );

          $promiseForData = new Promise((resolve, reject) => {
            $array = [];

            for (let title of titles) {
              if ($array.length >= 10) {
                break;
              } else {
                const anchor = title.closest("a");
                $array.push({
                  text: title.textContent.trim(),
                  href: anchor.href
                });
              }
            }

            resolve($array);
          });

          return $promiseForData;
        })
      );
      break;
    /* ------------------------------------------------------------- */
    case "drudge":
      [$err, $linkObjects] = await to(
        page.evaluate(() => {
          const titles = Array.from(document.querySelectorAll("a"));

          $promiseForData = new Promise((resolve, reject) => {
            $array = [];

            for (let title of titles) {
              if ($array.length >= 10) {
                break;
              } else {
                $array.push({
                  text: title.textContent.trim(),
                  href: title.href
                });
              }
            }

            resolve($array);
          });

          return $promiseForData;
        })
      );
      break;
    /* ------------------------------------------------------------- */
    case "dailykos":
      [$err, $linkObjects] = await to(
        page.evaluate(() => {
          const titles = Array.from(
            document.querySelectorAll(".story-title a")
          );

          $promiseForData = new Promise((resolve, reject) => {
            $array = [];

            for (let title of titles) {
              if ($array.length >= 10) {
                break;
              } else {
                $array.push({
                  text: title.textContent.trim(),
                  href: title.href
                });
              }
            }

            resolve($array);
          });

          return $promiseForData;
        })
      );
      break;
    /* ------------------------------------------------------------- */
    case "newyorkpost":
      [$err, $linkObjects] = await to(
        page.evaluate(() => {
          const titles = Array.from(
            document.querySelectorAll(".headline-container h3")
          );

          $promiseForData = new Promise((resolve, reject) => {
            $array = [];

            for (let title of titles) {
              if ($array.length >= 10) {
                break;
              } else {
                const anchor = title.closest("a");
                $array.push({
                  text: title.textContent.trim(),
                  href: anchor.href
                });
              }
            }

            resolve($array);
          });

          return $promiseForData;
        })
      );
      break;
    /* ------------------------------------------------------------- */
    case "mediamatters":
      [$err, $linkObjects] = await to(
        page.evaluate(() => {
          const titles = Array.from(document.querySelectorAll("h1 a"));

          $promiseForData = new Promise((resolve, reject) => {
            $array = [];

            for (let title of titles) {
              if ($array.length >= 10) {
                break;
              } else {
                $array.push({
                  text: title.textContent.trim(),
                  href: title.href
                });
              }
            }

            resolve($array);
          });

          return $promiseForData;
        })
      );
      break;
    /* ------------------------------------------------------------- */
    case "dailycaller":
      [$err, $linkObjects] = await to(
        page.evaluate(() => {
          const titles = Array.from(document.querySelectorAll("h3 a"));

          $promiseForData = new Promise((resolve, reject) => {
            $array = [];

            for (let title of titles) {
              if ($array.length >= 10) {
                break;
              } else {
                $array.push({
                  text: title.textContent.trim(),
                  href: title.href
                });
              }
            }

            resolve($array);
          });

          return $promiseForData;
        })
      );
      break;
    /* ------------------------------------------------------------- */
    default:
      return [];
      break;
  }

  if ($err) console.log("Error scraping", $err);
  console.log(`+ Scraped and saved ${$linkObjects.length} links`);
  return { links: $linkObjects };
};
