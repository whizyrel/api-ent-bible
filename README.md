# bibleAPI
A consumable RESTful service. It provides the bible on-demand.

## Usage

### root url

```js
// say root url is
const rootUrl = `api-ent-bible.appspot.com`;
``` 

## v1

```js
const v1 = `${rootUrl}/v1/api`;
```

sample response:
```js
{
  "request": [
    ...,
    {
      "version": "..."
      "verses": [...],
      "bookTitle": "...",
      "chapterNo": "..."
    },
    ...
  ]
}
```

#### All books

make a GET request to /all?key=['api key']&vrsn=kjv

### Chapters of a book

for single book
make a GET request to /bks/?vrsn=kjv&key=KrIr9m7fFLJmv&bk=jude

for alternative books
make a GET request to /bks/?vrsn=kjv&key=KrIr9m7fFLJmv&bk=jude|titus

for range of books
make a GET request to /bks/?vrsn=kjv&key=KrIr9m7fFLJmv&bk=jude-revelation

### verses of a chapter

/chp/?vrsn=kjv&key=KrIr9m7fFLJmv&chp=12&bk=genesis.
It follows same for above as regards alternative and ranges.

### a verse of a chapter in a book

vrs/?key=KrIr9m7fFLJmv&vrsn=kjv&bk=genesis&chp=13&vrs=15
It follows same for above as regards alternative and ranges.

## v2
upcoming support for scripturer-reference queryparam like so: gen 6:5-9

## Versions currently supported
- kjv
