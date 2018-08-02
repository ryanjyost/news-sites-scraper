module.exports = [
  {
    name: "cnn",
    url: "https://www.cnn.com",
    file: "cnn",
    title: "CNN",
    rss: [
      {
        category: "politics",
        type: "rss",
        url: "http://rss.cnn.com/rss/cnn_allpolitics.rss"
      }
      // {
      //   category: "opinion",
      //   type: "scrape",
      //   url: "https://www.cnn.com/specials/opinion/opinion-politics"
      // }
    ]
  },
  {
    name: "foxnews",
    url: "https://www.foxnews.com",
    file: "foxnews",
    logo:
      "https://res.cloudinary.com/ryanjyost/image/upload/v1529257416/logos/foxnews-logo.png",
    title: "Fox News",
    rss: [
      {
        category: "politics",
        type: "rss",
        url: "http://feeds.foxnews.com/foxnews/politics"
      },
      {
        category: "opinion",
        type: "rss",
        url: "http://feeds.foxnews.com/foxnews/opinion"
      }
    ]
  },
  {
    name: "msnbc",
    url: "https://www.msnbc.com",
    file: "msnbc",
    logo:
      "https://res.cloudinary.com/ryanjyost/image/upload/v1529257748/logos/msnbc-logo.svg",
    title: "MSNBC News",
    rss: [
      {
        category: "politics",
        type: "rss",
        url: "https://www.msnbc.com/feeds/latest"
      }
    ]
  },
  {
    name: "bloomberg",
    url: "https://www.bloomberg.com/",
    file: "bloomberg",
    title: "Bloomberg",
    rss: [
      {
        category: "politics",
        type: "scrape",
        url: "https://www.bloomberg.com/politics"
      },
      {
        category: "opinion",
        type: "scrape",
        url: "https://www.bloomberg.com/opinion"
      }
    ]
  },
  {
    name: "nytimes",
    url: "https://www.nytimes.com/",
    file: "nytimes",
    title: "The New York Times",
    rss: [
      {
        category: "politics",
        type: "rss",
        url: "https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml"
      },
      {
        category: "opinion",
        type: "scrape",
        url:
          "https://www.nytimes.com/section/opinion/contributors?action=click&contentCollection=opinion&region=navbar&module=collectionsnav&pagetype=sectionfront&pgtype=sectionfront"
      }
    ]
  },
  // {
  //   name: "thenewyorker",
  //   url: "https://www.newyorker.com/",
  //   file: "thenewyorker",
  //   title: "The New Yorker",
  //   rss: [
  //     {
  //       category: "politics",
  //       type: "rss",
  //       url: "https://www.newyorker.com/feed/news/news-desk"
  //     },
  //     {
  //       category: "opinion",
  //       type: "rss",
  //       url: "https://www.newyorker.com/feed/news/daily-comment"
  //     }
  //   ]
  // },
  {
    name: "huffpo",
    url: "https://www.huffingtonpost.com/",
    title: "The Huffington Post",
    rss: [
      {
        category: "politics",
        type: "rss",
        url: "https://www.huffingtonpost.com/section/politics/feed"
      },
      {
        category: "opinion",
        type: "rss",
        url: "https://www.huffingtonpost.com/section/opinion/feed"
      }
    ]
  },
  {
    name: "guardian",
    url: "https://www.theguardian.com/us",
    title: "The Guardian",
    rss: [
      {
        category: "politics",
        type: "rss",
        url: "https://www.theguardian.com/world/rss"
      },
      {
        category: "opinion",
        type: "rss",
        url: "https://www.theguardian.com/us/commentisfree/rss"
      }
    ]
  },
  {
    name: "wsj",
    url: "https://www.wsj.com/",
    title: "The Wall Street Journal",
    rss: [
      {
        category: "politics",
        type: "rss",
        url: "https://www.wsj.com/xml/rss/3_7085.xml"
      },
      {
        category: "opinion",
        type: "rss",
        url: "https://www.wsj.com/xml/rss/3_7041.xml"
      }
    ]
  },
  {
    name: "abcnews",
    url: "https://abcnews.go.com/",
    title: "ABC News",
    rss: [
      {
        category: "politics",
        type: "rss",
        url: "https://abcnews.go.com/abcnews/politicsheadlines"
      }
    ]
  },
  {
    name: "bbcnews",
    url: "https://www.bbc.com/",
    title: "BBC News",
    rss: [
      {
        category: "politics",
        type: "scrape",
        url: "https://www.bbc.com/"
      }
    ]
  },
  {
    name: "usatoday",
    url: "https://www.usatoday.com/",
    title: "USA Today",
    rss: [
      {
        category: "politics",
        type: "rss",
        url: "http://rssfeeds.usatoday.com/UsatodaycomWashington-TopStories"
      },
      {
        category: "opinion",
        type: "rss",
        url: "http://rssfeeds.usatoday.com/News-Opinion"
      }
    ]
  },
  {
    name: "latimes",
    url: "https://www.latimes.com/",
    title: "Los Angeles Times",
    rss: [
      {
        category: "politics",
        type: "rss",
        url: "https://www.latimes.com/nation/politics/rss2.0.xml"
      },
      {
        category: "opinion",
        type: "rss",
        url: "https://www.latimes.com/opinion/op-ed/rss2.0.xml"
      }
    ]
  },
  {
    name: "cbsnews",
    url: "https://www.cbsnews.com/",
    title: "CBS News",
    rss: [
      {
        category: "politics",
        type: "rss",
        url: "https://www.cbsnews.com/latest/rss/politics"
      }
      // {
      //   category: "opinion",
      //   type: "rss",
      //   url: "https://www.cbsnews.com/latest/rss/opinion"
      // }
    ]
  },
  {
    name: "reuters",
    url: "https://www.reuters.com/",
    title: "Reuters",
    rss: [
      {
        category: "politics",
        type: "rss",
        url: "http://feeds.reuters.com/Reuters/PoliticsNews"
      }
    ]
  },
  {
    name: "thehill",
    url: "https://thehill.com/",
    title: "The Hill",
    rss: [
      {
        category: "politics",
        type: "rss",
        url: "https://thehill.com/rss/syndicator/19109"
      }
      // {
      //   category: "opinion",
      //   type: "rss",
      //   url: "https://thehill.com/taxonomy/term/1116/feed"
      // }
    ]
  },
  // {
  //   name: "time",
  //   url: "https://time.com/",
  //   title: "Time",
  //   rss: [
  //     {
  //       category: "politics",
  //       type: "rss",
  //       url: "https://feeds.feedburner.com/timeblogs/swampland"
  //     },
  //     {
  //       category: "opinion",
  //       type: "rss",
  //       url: "https://feeds.feedburner.com/time/ideas"
  //     }
  //   ]
  // },
  {
    name: "nationalreview",
    url: "https://www.nationalreview.com/",
    title: "National Review",
    rss: [
      {
        category: "opinion",
        type: "rss",
        url: "https://www.nationalreview.com/feed/"
      }
    ]
  },
  {
    name: "theatlantic",
    url: "https://www.theatlantic.com/",
    title: "The Atlantic",
    rss: [
      {
        category: "politics",
        type: "rss",
        url: "https://www.theatlantic.com/feed/channel/politics/"
      }
    ]
  },
  {
    name: "politico",
    url: "https://www.politico.com/",
    title: "Politico",
    rss: [
      {
        category: "politics",
        type: "rss",
        url: "https://www.politico.com/rss/politics08.xml"
      }
    ]
  },
  {
    name: "vox",
    url: "https://www.vox.com/",
    title: "Vox",
    rss: [
      {
        category: "politics",
        type: "rss",
        url: "https://www.vox.com/rss/index.xml"
      }
    ]
  },
  {
    name: "washingtontimes",
    url: "https://www.washingtontimes.com/",
    title: "The Washington Times",
    rss: [
      {
        category: "politics",
        type: "rss",
        url: "https://www.washingtontimes.com/rss/headlines/news/politics/"
      },
      {
        category: "opinion",
        type: "rss",
        url: "https://www.washingtontimes.com/rss/headlines/opinion/"
      }
    ]
  },
  // {
  //   name: "slate",
  //   url: "https://slate.com/",
  //   title: "Slate Magazine",
  //   rss: [
  //     {
  //       category: "opinion",
  //       type: "rss",
  //       url: "https://feeds.slate.com/slate-101526"
  //     }
  //   ]
  // },
  {
    name: "washingtonexaminer",
    url: "https://www.washingtonexaminer.com/",
    title: "The Washington Examiner",
    rss: [
      {
        category: "politics",
        type: "rss",
        url: "https://www.washingtonexaminer.com/tag/politics.rss"
      },
      {
        category: "opinion",
        type: "rss",
        url: "https://www.washingtonexaminer.com/tag/opinion.rss"
      }
    ]
  },
  // {
  //   name: "dailybeast",
  //   url: "https://www.thedailybeast.com/",
  //   title: "The Daily Best",
  //   rss: [
  //     {
  //       category: "politics",
  //       type: "rss",
  //       url: "https://feeds.thedailybeast.com/rss/articles"
  //     }
  //   ]
  // },
  // {
  //   name: "federalist",
  //   url: "https://thefederalist.com/",
  //   title: "The Federalist",
  //   rss: [
  //     {
  //       category: "opinion",
  //       type: "rss",
  //       url: "https://thefederalist.com/feed/"
  //     }
  //   ]
  // },
  {
    name: "newrepublic",
    url: "https://newrepublic.com/",
    title: "The New Republic",
    rss: [
      {
        category: "opinion",
        type: "rss",
        url: "https://newrepublic.com/rss.xml"
      }
    ]
  },
  // {
  //   name: "drudge",
  //   url: "https://www.drudgereport.com/",
  //   title: "Drudge Report",
  //   rss: [
  //     {
  //       category: "politics",
  //       type: "rss",
  //       url: "https://feeds.feedburner.com/DrudgeReportFeed"
  //     }
  //   ]
  // },
  {
    name: "newyorkpost",
    url: "https://nypost.com/",
    title: "New York Post",
    rss: [
      {
        category: "politics",
        type: "rss",
        url: "https://nypost.com/news/feed/"
      }
    ]
  }
  // {
  //   name: "dailycaller",
  //   url: "https://dailycaller.com/",
  //   title: "The Daily Caller",
  //   rss: [
  //     {
  //       category: "politics",
  //       type: "rss",
  //       url: "https://feeds.feedburner.com/dailycaller"
  //     },
  //     {
  //       category: "opinion",
  //       type: "rss",
  //       url: "https://feeds.feedburner.com/dailycaller-opinion"
  //     }
  //   ]
  // }
];
