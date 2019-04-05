// const mogoose = require('mongoose');
const Chapter = require('../models/chapter');
const helpers = require('../helpers/req-parser');

// @ts-ignore
exports.getAll = (req, res, next) => {
  //  vrsn=kjv&key=5c02a6aa8fc2261e18e46849
  const requests = req.query.vrsn.toLowerCase().split('|');
  Chapter.find({
    version: {
      $in: requests,
    },
  })
      .select('-_id chapterNo bookTitle version verses')
      .exec()
      .then((docs) => {
        if (docs.length > 0) {
          return res.status(200).json({
            request: docs,
          });
        }
        res.status(422).json({
          message: 'please check your queries again',
        });
      })
      .catch((err) => {
        res.status(400).json({
          message: err + 'Something went wrong!',
        });
      });
};

// @ts-ignore
exports.getBook = (req, res, next) => {
  // vrsn=kjv&bk=genesis-ezra%7Cmatthew-john%7cjoshua&key='insert key here'
  const reqArr = req.query.bk.split('|');
  helpers.getRes(helpers.parseStringReq(reqArr), req, res);
};

// @ts-ignore
exports.getChapter = (req, res, next) => {
  // ?vrsn=kjv&bk=revelation&chp=18-15|1&key='insert key here'
  const reqArr = req.query.chp.split('|');
  const requests = helpers.parseChapReq(reqArr);

  Chapter.find({
    version: req.query.vrsn.toLowerCase(),
    bookTitle: req.query.bk.toLowerCase(),
    chapterNo: {
      $in: requests,
    },
  })
      .select('-_id chapterNo bookTitle version verses')
      .then((docs) => {
        if (docs.length > 0) {
          return res.status(200).json({
            request: docs,
          });
        }
        res.status(422).json({
          message: 'please check your queries again',
        });
      })
      .catch((err) => {
        res.status(400).json({
          error: err + 'Something went wrong',
        });
      });
};

// @ts-ignore
exports.getVerse = (req, res, next) => {
  // ?vrsn=kjv&bk=revelation&chp=18-15|1&vrs=4&&key='insert key here'
  const reqArr = req.query.vrs.split('|');
  // do something about repeated verses coming from designated helper function
  const requests = helpers.parseNumReq(reqArr).sort(function(a, b) {
    return a - b;
  });

  const chapters = helpers
      .parseNumReq(req.query.chp.split('|'))
      .sort(function(a, b) {
        return a - b;
      })
      .map((chaptReq) => {
        return `chapter-${parseInt(chaptReq)}`.toLowerCase();
      });

  Chapter.find({
    version: req.query.vrsn.toLowerCase(),
    bookTitle: req.query.bk.toLowerCase(),
    chapterNo: {
      $in: chapters,
    },
  })
      .select('-_id chapterNo bookTitle version verses')
      .then((docs) => {
        if (docs.length > 0) {
        // grab verses
          const verses = [];
          requests.forEach((vrs) => {
            verses.push(docs.map((doc) => {
              return doc.verses[vrs - 1];
            })[0]);
          });
          /*
          .map((el, i) => {
            if (el == verses[i - 1]) {
              return verses.splice(i, 1);
            }
          })
           */
          return res.status(200).json({
            request: verses,
          });
        }
        res.status(422).json({
          message: 'please check your queries again',
        });
      })
      .catch((err) => {
        res.status(400).json({
          error: err + ': Something went wrong with your request',
        });
      });
};
