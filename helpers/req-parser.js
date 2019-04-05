const Chapter = require('../models/chapter');
const booksTitle = require('../resources/books-title');

// @ts-ignore
exports.parseNumReq = (arr) => {
  const a = [];
  arr.forEach((cur) => {
    if (cur.includes('-')) {
      // @ts-ignore
      const strtInd = parseInt(cur.split('-')[0]);
      // @ts-ignore
      const endInd = parseInt(cur.split('-')[1]);

      if (strtInd > endInd) {
        for (let r = strtInd; r >= endInd; r--) {
          a.push(r);
        }
      } else {
        for (let r = strtInd; r <= endInd; r++) {
          a.push(r);
        }
      }
    } else {
      a.push(parseInt(cur));
    }
  });
  return a;
};

exports.parseStringReq = (arr) => {
  const a = [];
  arr.forEach((cur) => {
    if (cur.includes('-')) {
      const strtInd = booksTitle.booksTitle().indexOf(cur.split('-')[0]);
      const endInd = booksTitle.booksTitle().indexOf(cur.split('-')[1]);

      if (strtInd > endInd) {
        for (let r = strtInd; r >= endInd; r--) {
          a.push(booksTitle.booksTitle()[r]);
        }
      } else {
        for (let r = strtInd; r <= endInd; r++) {
          a.push(booksTitle.booksTitle()[r]);
        }
      }
    } else {
      a.push(cur);
    }
  });
  return a;
};

exports.parseChapReq = (arr) => {
  const a = [];
  arr.forEach((cur) => {
    if (cur.includes('-')) {
      // @ts-ignore
      const strtInd = parseInt(cur.split('-')[0]);
      // @ts-ignore
      const endInd = parseInt(cur.split('-')[1]);

      if (strtInd > endInd) {
        for (let r = strtInd; r >= endInd; r--) {
          a.push(`chapter-${r}`);
        }
      } else {
        for (let r = strtInd; r <= endInd; r++) {
          a.push(`chapter-${r}`);
        }
      }
    } else {
      a.push(`chapter-${parseInt(cur)}`);
    }
  });
  return a.sort();
};

exports.getRes = (arr, req, res) => {
  Chapter.find({version: req.query.vrsn, bookTitle: {$in: arr}})
      .sort({$natural: 1})
      .select('-_id chapterNo bookTitle version verses')
      .exec()
      .then((docs) => {
        res.status(200).json({results: docs});
      })
      .catch((err) => {
        res.status(400).json({
          error: err + ': Something went wrong!',
        });
      });
};
