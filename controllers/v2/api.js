const Chapter = require('../../models/chapter');
const {
  getRes, parseStringReq, parseChapReq, parseNumReq,
} = require('../../helpers/req-parser');

// @ts-ignore
exports.getAll = (req, res, next) => {
  const {query: {vrsn}} = req;

  //  vrsn=kjv&key=5c02a6aa8fc2261e18e46849
  const requests = vrsn.toLowerCase().split('|');

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
        return res.status(422).json({
          message: 'please check your queries again',
        });
      })
      .catch((err) => {
        return res.status(400).json({
          message: err + 'Something went wrong!',
        });
      });
};

// @ts-ignore
exports.getBook = (req, res, next) => {
  const {query: {bk}} = req;

  // vrsn=kjv&bk=genesis-ezra%7Cmatthew-john%7cjoshua&key='insert key here'
  const reqArr = bk.split('|');
  console.log({req: reqArr});

  getRes(parseStringReq(reqArr), req, res);
};

// @ts-ignore
exports.getChapter = (req, res, next) => {
  const {query: {vrsn}} = req;
  // ?vrsn=kjv&bk=genesis&chp=1&vrs=5-8|3-5|1-2&key='insert key here'
  const reqArr = chp.split('|');
  const requests = parseChapReq(reqArr);

  Chapter.find({
    version: vrsn.toLowerCase(),
    bookTitle: bk.toLowerCase(),
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
        return res.status(422).json({
          message: 'please check your queries again',
        });
      })
      .catch((err) => {
        return res.status(400).json({
          error: err + 'Something went wrong',
        });
      });
};

// @ts-ignore
exports.getVerse = (req, res, next) => {
  const {query: {vrs, chp, bk}} = req;
  // ?vrsn=kjv&bk=revelation&chp=18-15|1&vrs=4&&key='insert key here'
  const reqArr = vrs.split('|');
  // do something about repeated verses coming from designated helper function
  const requests = parseNumReq(reqArr).sort(function(a, b) {
    return a - b;
  });

  const chapters = helpers
      .parseNumReq(chp.split('|'))
      .sort(function(a, b) {
        return a - b;
      })
      .map((chaptReq) => {
        return `chapter-${parseInt(chaptReq)}`.toLowerCase();
      });

  Chapter.find({
    version: vrsn.toLowerCase(),
    bookTitle: bk.toLowerCase(),
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
          console.log(verses);
          return res.status(200).json({
            request: verses.filter((el, i) => {
              if (el !== verses[i - 1]) {
                return el;
              }
            }),
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
