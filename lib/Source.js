class Source {
  constructor(site) {
    this.site = site;
  }

  logSite() {
    console.log(this.site.name);
  }
}

module.exports = Source;
