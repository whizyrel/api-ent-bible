const express = require('express');
const route = express.Router();

const {
  getAll, getBook, getChapter,
  getVerse,
} = require('../../controllers/v2/api');

const apiAuth = require('../../middlewares/v2/api-auth');
const {
  checkQuery,
} = require('../../middlewares/v2/api-req-parser');


// [route] list all [queries: bible version] --> books
// [updates] queries for bible versions
route.get('/all', /* apiAuth,*/ checkQuery, getAll);

// [route] list [queries : bible version, book]--> book
route.get('/bks/:wh', /* apiAuth,*/ checkQuery, getBook);

// [route] list [queries : bible version, book and chapter]--> chapter
route.get('/chp/:wh', /* apiAuth, */ checkQuery, getChapter);

// [route] list [queries : bible version, book, chapter, verse]--> verses
route.get('/vrs/:wh', /* apiAuth,*/ checkQuery, getVerse);

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
