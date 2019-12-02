const express = require('express');
// eslint-disable-next-line new-cap
const route = express.Router();

const {
  getAll, getBook, getChapter,
  getVerse,
} = require('../../controllers/v1/api');

const apiAuth = require('../../middlewares/api-auth');
const {
  checkAll, checkBookQuery,
  checkChapQuery, checkVrsQuery,
} = require('../../middlewares/api-req-parser');


// [route] list all [queries: bible version] --> books
// [updates] queries for bible versions
route.get('/all', apiAuth, checkAll, getAll);

// [route] list [queries : bible version, book]--> book
route.get('/bks', apiAuth, checkBookQuery, getBook);

// [route] list [queries : bible version, book and chapter]--> chapter
route.get('/chp', apiAuth, checkChapQuery, getChapter);

// [route] list [queries : bible version, book, chapter, verse]--> verses
route.get('/vrs', apiAuth, checkVrsQuery, getVerse);

module.exports = route;

// [user keys] GET --> db --> resources
/*
    /all --> the whole bible
    /verse --> verse
    /chapter --> chapter
    /book --> book
    with bible versions into consideration
*/

// [admin keys] PUT, DELETE, PATCH, GET --> db --> resource
