const to = require("./to.js");

module.exports = async function(page, site) {
  let $selector, $ad, $err;
  const timeout = ms => new Promise(res => setTimeout(res, ms));
  switch (site.name) {
    /* ----------------------------------- */
    case "msnbc":
      [$err, $selector] = await to(page.$(".pane-homepage2-homepage"));
      if ($err) console.error("Error", err);

      if ($selector) {
        await page.evaluate(thing => {
          window.scrollBy(0, thing.offsetTop - 50);
          return window.pageYOffset;
        }, $selector);
      }
      break;
    /* ----------------------------------- */
    case "nytimes":
      [$err, $selector] = await to(page.$(".welc-close"));
      if ($err) console.error("Error", err);

      if ($selector) {
        await $selector.click();
      }
      break;
    /* ----------------------------------- */
    case "thenewyorker":
      [$err, $selector] = await to(page.$(".PageSections__container___2--Bs"));
      if ($err) console.error("Error", err);

      if ($selector) {
        await page.evaluate(thing => {
          window.scrollBy(0, thing.offsetTop - 20);
          return window.pageYOffset;
        }, $selector);
      }
      break;
    /* ----------------------------------- */
    case "dailymail":
      await timeout(5000);
      break;
    /* ----------------------------------- */
    case "washpo":
      await timeout(5000);
      break;
    /* ----------------------------------- */
    case "usatoday":
      [$err, $selector] = await to(page.$(".partner-scroll"));
      if ($err) console.error("Error", err);

      if ($selector) {
        await $selector.click();
      }
      break;
    /* ----------------------------------- */
    case "cbsnews":
      [$err, $selector] = await to(page.$("#cto_banner_content"));
      if ($err) console.error("Error", err);

      if ($selector) {
        await page.evaluate(thing => {
          window.scrollBy(0, thing.offsetTop - 20);
          return window.pageYOffset;
        }, $selector);
      }
      break;
    /* ----------------------------------- */
    case "thehill":
      [$err, $selector] = await to(page.$(".img_ad"));
      if ($err) console.error("Error", err);

      if ($selector) {
        await page.evaluate(thing => {
          window.scrollBy(0, thing.offsetTop - 20);
          return window.pageYOffset;
        }, $selector);
      }
      break;

    /* ----------------------------------- */
    case "theatlantic":
      [$err, $selector] = await to(page.$("#site"));
      if ($err) console.error("Error", err);

      if ($selector) {
        await page.evaluate(thing => {
          window.scrollBy(0, thing.offsetTop);
          return window.pageYOffset;
        }, $selector);
      }
      break;

      [$err, $ad] = await to(page.$(".l-hp-b-top__ad--full"));
      if ($err) console.error("Error", err);

      if ($ad) {
        await page.evaluate(thing => {
          thing.style.display = "none";
          return thing;
        }, $ad);
      }
      break;

    /* ----------------------------------- */
    case "politico":
      let ad, header;
      [$err, header] = await to(page.$("header"));
      [$err, ad] = await to(page.$(".ad"));

      if ($err) console.error("Error", err);

      if (header) {
        await page.evaluate(thing => {
          window.scrollBy(0, thing.offsetHeight);
          return window.pageYOffset;
        }, header);
      }
      if (ad) {
        await page.evaluate(thing => {
          window.scrollBy(0, thing.offsetHeight);
          return window.pageYOffset;
        }, ad);
      }

      break;

    /* ----------------------------------- */
    case "theweeklystandard":
      [$err, $selector] = await to(page.$(".dy-lb-close"));

      if ($selector) {
        await $selector.click();
      }
      break;

    /* ----------------------------------- */
    case "vox":
      [$err, $selector] = await to(page.$("m-ad"));

      if ($selector) {
        await page.evaluate(thing => {
          thing.style.height = "0px";
          return thing;
        }, $selector);
      }
      break;

    /* ----------------------------------- */
    case "washingtontimes":
      [$err, $selector] = await to(page.$("#ad-lead"));

      if ($selector) {
        await page.evaluate(thing => {
          thing.style.display = "none";
          const header = thing.closest(".container");
          header.style.height = "0px";
          return thing;
        }, $selector);
      }
      break;

    /* ----------------------------------- */
    case "slate":
      [$err, $selector] = await to(page.$(".top-ad"));

      if ($selector) {
        await page.evaluate(thing => {
          thing.style.display = "none";
          return thing;
        }, $selector);
      }
      break;

    /* ----------------------------------- */
    case "washingtonexaminer":
      [$err, $selector] = await to(page.$(".GoogleDfpAd"));

      if ($selector) {
        await page.evaluate(thing => {
          thing.style.display = "none";
          const header = thing.closest(".Page-above");
          header.style.height = "0px";
          return thing;
        }, $selector);
      }
      break;

    /* ----------------------------------- */
    case "dailybeast":
      [$err, $selector] = await to(page.$(".AdSlot"));

      if ($selector) {
        await page.evaluate(thing => {
          thing.style.display = "none";
          return thing;
        }, $selector);
      }
      break;

    /* ----------------------------------- */
    case "newrepublic":
      [$err, $selector] = await to(page.$(".site-popup"));

      if ($selector) {
        await page.evaluate(thing => {
          thing.style.display = "none";
          return thing;
        }, $selector);
      }
      break;

    /* ----------------------------------- */
    case "drudge":
      [$err, $selector] = await to(page.$("center"));

      if ($selector) {
        await page.evaluate(thing => {
          thing.style.display = "none";
          return thing;
        }, $selector);
      }
      break;

    /* ----------------------------------- */
    case "dailykos":
      [$err, $selector] = await to(page.$(".banner-ad-row"));

      if ($selector) {
        await page.evaluate(thing => {
          thing.style.display = "none";
          return thing;
        }, $selector);
      }
      break;

    /* ----------------------------------- */
    case "newyorkpost":
      [$err, $selector] = await to(page.$("#header-billboard-ad"));

      if ($selector) {
        await page.evaluate(thing => {
          thing.style.display = "none";
          return thing;
        }, $selector);
      }
      break;

    /* ----------------------------------- */
    case "dailycaller":
      [$err, $selector] = await to(page.$(".topad"));

      if ($selector) {
        await page.evaluate(thing => {
          thing.style.display = "none";
          return thing;
        }, $selector);
      }

      [$err, $selector] = await to(page.$(".onesignal-popover-container"));

      if ($selector) {
        await page.evaluate(thing => {
          thing.style.display = "none";
          return thing;
        }, $selector);
      }
      break;

    /* ----------------------------------- */
    default:
      return new Promise((resolve, reject) => {
        resolve();
      });
      break;
  }
};
