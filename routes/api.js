const express = require('express');
const apiController = require('../controllers/api');
const apiAuth = require("../middlewares/api-auth");
const reqParser = require('../middlewares/api-req-parser');

// console.log(reqParser);

const route = express.Router();

// [route] list all [queries: bible version] --> books
// [updates] queries for bible versions
route.get('/all', apiAuth, reqParser.checkAll, apiController.getAll);

// [route] list [queries : bible version, book]--> book 
route.get('/bks', apiAuth, reqParser.checkBookQuery, apiController.getBook);

// [route] list [queries : bible version, book and chapter]--> chapter 
route.get("/chp", apiAuth, reqParser.checkChapQuery, apiController.getChapter);

// [route] list [queries : bible version, book, chapter, verse]--> verses 
route.get('/vrs', apiAuth, reqParser.checkVrsQuery, apiController.getVerse);

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
