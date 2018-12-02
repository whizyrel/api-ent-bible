// const mogoose = require('mongoose');
const Chapter = require('../models/chapter');

const booksTitle = [
	'genesis',
	'exodus',
	'leviticus',
	'numbers',
	'deuteronomy',
	'joshua',
	'judges',
	'ruth',
	'1 samuel',
	'2 samuel',
	'1 kings',
	'2 kings',
	'1 chronicles',
	'2 chronicles',
	'ezra',
	'nehemiah',
	'esther',
	'job',
	'psalms',
	'proverbs',
	'ecclesiastes',
	'song of solomon',
	'isaiah',
	'jeremiah',
	'lamentations',
	'ezekiel',
	'daniel',
	'hosea',
	'joel',
	'amos',
	'obadiah',
	'jonah',
	'micah',
	'nahum',
	'habakkuk',
	'zephaniah',
	'haggai',
	'zechariah',
	'malachi',
	'matthew',
	'mark',
	'luke',
	'john',
	'acts',
	'romans',
	'1 corinthians',
	'2 corinthians',
	'galatians',
	'ephesians',
	'philippians',
	'colossians',
	'1 thessalonians',
	'2 thessalonians',
	'1 timothy',
	'2 timothy',
	'titus',
	'philemon',
	'hebrews',
	'james',
	'1 peter',
	'2 peter',
	'1 john',
	'2 john',
	'3 john',
	'jude',
	'revelation'
];

const parseStringReq = (arr) => {
	const a = [];
	arr.forEach((cur) => {
		if (cur.includes('-')) {
			const strtInd = booksTitle.indexOf(cur.split('-')[0]);
			const endInd = booksTitle.indexOf(cur.split('-')[1]);

			if (strtInd > endInd) {
				for (let r = strtInd; r >= endInd; r--) {
					a.push(booksTitle[r]);
				}
			} else {
				for (let r = strtInd; r <= endInd; r++) {
					a.push(booksTitle[r]);
				}
			}
		} else {
			a.push(cur);
		}
	});
	return a;
};

const getRes = (arr, req, res) => {
	Chapter.find({ version: req.query.vrsn, bookTitle: { $in: arr } })
		.sort({ $natural: 1 })
		.select('-_id chapterNo bookTitle version verses')
		.exec()
		.then((docs) => {
			res.status(200).json({ results: docs });
		})
		.catch((err) => {
			res.status(400).json({
				error: err + ': Something went wrong!'
			});
		});
};

// @ts-ignore
const parseNumReq = (arr) => {
	const a = [];
	arr.forEach((cur) => {
		if (cur.includes('-')) {
			// @ts-ignore
			let strtInd = parseInt(cur.split('-')[0]);
			// @ts-ignore
			let endInd = parseInt(cur.split('-')[1]);

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

const parseChapReq = (arr) => {
	const a = [];
	arr.forEach((cur) => {
		if (cur.includes('-')) {
			// @ts-ignore
			let strtInd = parseInt(cur.split('-')[0]);
			// @ts-ignore
			let endInd = parseInt(cur.split('-')[1]);

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

// @ts-ignore
exports.getAll = (req, res, next) => {
	const requests = req.query.vrsn.toLowerCase().split('|');
	Chapter.find({ version: { $in: requests } })
		.select('-_id chapterNo bookTitle version verses')
		.exec()
		.then((docs) => {
			if (docs.length > 0) {
				return res.status(200).json({
					request: docs
				});
			}
			res.status(422).json({
				message: 'please check your queries again'
			});
		})
		.catch((err) => {
			res.status(400).json({
				message: err + 'Something went wrong!'
			});
		});
};

// @ts-ignore
exports.getBook = (req, res, next) => {
	// vrsn=kjv&bk=genesis-ezra%7Cmatthew-john%7cjoshua
	const reqArr = req.query.bk.split('|');
	getRes(parseStringReq(reqArr), req, res);
};

// @ts-ignore
exports.getChapter = (req, res, next) => {
	const reqArr = req.query.chp.split('|');
	const requests = parseChapReq(reqArr);

	Chapter.find({
		version: req.query.vrsn.toLowerCase(),
		bookTitle: req.query.bk.toLowerCase(),
		chapterNo: { $in: requests }
	})
		.select('-_id chapterNo bookTitle version verses')
		.then((docs) => {
			if (docs.length > 0) {
				return res.status(200).json({
					request: docs
				});
			}
			res.status(422).json({
				message: 'please check your queries again'
			});
		})
		.catch((err) => {
			res.status(400).json({
				error: err + 'Something went wrong'
			});
		});
};

// @ts-ignore
exports.getVerse = (req, res, next) => {
	const reqArr = req.query.vrs.split('|');
	const requests = parseNumReq(reqArr).sort(function(a, b) {
		return a - b;
	});
	Chapter.find({
		version: req.query.vrsn.toLowerCase(),
		bookTitle: req.query.bk.toLowerCase(),
		chapterNo: `chapter-${parseInt(req.query.chp)}`.toLowerCase()
	})
		.select('-_id chapterNo bookTitle version verses')
		.then((doc) => {
			if (doc.length > 0) {
				let verses = requests.map((vrs) => {
					return doc[0].verses[vrs - 1];
				});
				verses.forEach((el, i) => {
					if (el == verses[i - 1]) {
						verses.splice(i, 1);
					}
				});
				return res.status(200).json({
					request: verses
				});
			}
			res.status(422).json({
				message: 'please check your queries again'
			});
		})
		.catch((err) => {
			res.status(400).json({
				error: err + ': Something went wrong with your request'
			});
		});
};
