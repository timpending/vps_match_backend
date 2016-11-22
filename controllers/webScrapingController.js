'use strict'
const cheerio = require('cheerio')
const requestPromise = require('request-promise')
const fs = require('fs')

module.exports = class lowEndBoxScrapingController {
  constructor() {}
  // parse from file
  parseFromFile() {
    // emulates array of objects from couch
    var boxes = JSON.parse(fs.readFileSync('low_end_box_results.json'))
    return this.parseRawDetailPageData(boxes)
  }
  parseRawDetailPageData(detailHtmlArray) {
    return detailHtmlArray.map((pos, i, arr) => {
      return this.scrapeDetail(cheerio.load(pos.raw_html))
    })
  }

  scrapeDetail($) {
    // let $ = cheerio.load(fs.readFileSync('box_detail.html'))
    let tags = []
    let paragraphs = []
    let title = $('.post .storytitle a').text()

    let table = $(".post .storycontent table").map(function(i, v) {
      var $td = $('td ul', this);
      var $tdTitle = $('td strong')
      var optionObject = {}
      optionObject[$tdTitle.eq(0).text()] = $td.eq(0).text().split("\n")
      optionObject[$tdTitle.eq(1).text()] = $td.eq(1).text().split("\n")
      optionObject[$tdTitle.eq(2).text()] = $td.eq(2).text().split("\n")
      return optionObject
    }).get();

    // scrape tags
    $('.post .meta a').each(function(i, elem) {
      tags.push($(this).text())
    })

    // scrape pagragraphs
    $('.post .storycontent p').each(function(i, elem){
      paragraphs.push($(this).text())
    })

    //titl

    var boxObject = {
      title,
      tags,
      models_vailable: table,
      paragraphs
    }
    return boxObject
  }
}
