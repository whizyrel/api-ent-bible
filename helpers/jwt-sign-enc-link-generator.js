// 'use strict';

/* eslint-disable new-cap */
/* eslint-disable require-jsdoc */
const JWT = require('jsonwebtoken');

/*
JWTOptions: {
  payload: 'payload',
  key: 'key',
  options: {},
}
url: 'url',
options: {mode: 'param || query', name: 'query field title'},
protocol = 'http',
*/

class Bingo {
  // eslint-disable-next-line max-len
  form(JWTOptions, options, url, name = options.name, protocol = 'http') {
    this.payload = JWTOptions.payload;
    this.JWTKey = JWTOptions.key;
    this.options = JWTOptions.options;
    this.mode = options.mode;
    this.name = name;
    this.urlString = url;
    this.protocol = protocol;
  }

  create(obj) {
    this.payload = obj.payload;
    this.JWTKey = obj.key;
    this.options = obj.options;
  }

  static checkFields(bingo) {
    const result = [];
    const fields = [];
    // console.log(bingo);

    for (const bing in bingo) {
      if (bing) {
        fields.push(bingo[bing]);
      }
    }
    fields.forEach((cur, index) => {
      if (typeof cur !== 'object') {
        result.push(cur !== '' && cur !== undefined);
      } else {
        Object.entries(cur).forEach((cur, index) => {
          for (const c in cur) {
            if (c > 0) {
              const el = cur[c];
              result.push(el !== undefined && el !== '');
            }
          }
        });
      }
    });
    return result.includes(false);
  }

  JWTSign() {
    if (Bingo.checkFields(this)) {
      const errorMessage = new Error('Oops! something went wrong');
      console.log(errorMessage) && res.status(500).json({
        error: errorMessage,
      });
    } else {
      // console.log(this.payload);
      return JWT.sign(
          this.payload,
          this.JWTKey,
          this.options
      );
    }
  }
  get Object() {
    return this;
  }
  get token() {
    // console.log(this.JWTSign());
    return this.JWTSign();
  }

  encryptedLink() {
    // eslint-disable-next-line max-len
    const encLink = `${this.protocol}://${this.urlString}${this.mode === 'param' ? '/' : `/?${this.name}=`}${this.JWTSign()}`;
    return encLink;
  }
}

/* const hey = new Bingo();
hey.create({
  payload: {
    email: 'knjbhvgcffgvhbjnksd',
  },
  key: 'knfnjfk',
  options: {
    expiresIn: 5600,
  },
});
console.log(hey.Object);
console.log(hey.JWTSign()); */

module.exports = new Bingo();

