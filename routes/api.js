const express = require('express');
const apiController = require('../controllers/api');

const route = express.Router();

// [route] list all [queries: bible version] --> books
// [updates] queries for bible versions
route.get('/all', apiController.getAll);

// [route] list [queries : bible version, book and chapter]--> daily reading 
route.get('/dr', apiController.getDr);

// [route] list [queries : bible version, book]--> book 
route.get('/book', apiController.getBook);

// [route] list [queries : bible version, book and chapter]--> chapter 
route.get('/chapter', apiController.getChapter);

// [route] list [queries : bible version, book, chapter, verse]--> verses 
route.get('/verse', apiController.getVerse);

// [user keys] GET --> db --> resources
/*
    /all --> the whole bible
    /dr --> daily reading
    /verse --> verse
    /chapter --> chapter
    /book --> book
    with bible versions into consideration
*/

// [admin keys] PUT, DELETE, PATCH, GET --> db --> resource
module.exports = route;