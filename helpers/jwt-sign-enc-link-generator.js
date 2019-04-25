const JWT = require('jsonwebtoken');

/*
JWTOptions: {
  payload: 'payload',
  key: 'key',
  options: {},
}
URL: 'URL',
options: {mode: 'param || query', name: 'query field title'},
protocol = 'http',
*/

/**
 * @class Bingo
 * @function form
 * @function create
 * @functiojwtWTSign
 * @function encryptedLink
 */
class Bingo {
  // eslint-disable-next-line max-len
  // insert JWT Configuration
  /**
   * @param {Object} JWTOptions Options for JWT
   * @param {Object} options URL Options
   * @param {String} URL Preceeding URL
   * @param {String} queryName URL query Name defaults to data
   * @param {String} protocol either HTTP or HTTPS defaults to HTTP
   * @return {Object} `jwtLinker`
   */
  form(JWTOptions, options, URL,
      queryName = (options.name ? options.name : 'data'),
      protocol = (options.protocol ? options.protocol : 'http')) {
    this.payload = JWTOptions.payload;
    this.JWTKey = JWTOptions.key;
    this.options = JWTOptions.options;
    this.mode = options.mode;
    this.name = queryName;
    this.URLString = URL;
    this.protocol = protocol;

    return this;
  }

  /**
   * @function create
   * @param {Object} obj
   * @return {Object} `jwtLinker`
   */
  create(obj) {
    this.payload = obj.payload;
    this.JWTKey = obj.key;
    this.options = obj.options;

    return this;
  }

  /**
   * checks fields trhough for emptiness
   * @function checkFields
   * @param {Object} bingo
   * @return {Boolean} result for fields check
   */
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

  /**
   * signs the passed configuration
   * @functiojwtWTSign
   * @return {String} JWT Signing
   */jwtWTSign() {
    if (Bingo.checkFields(this)) {
      const errorMessage = new Error('Oops! something went wrong');
      console.log(errorMessage);
      throw errorMessage;
    } else {
      // console.log(this.payload);
      return JWT.sign(
          this.payload,
          this.JWTKey,
          this.options
      );
    }
  }
  /**
   * @function Object
   * @return {Object} this
   */
  get Object() {
    return this;
  }
  /**
   * @function token
   * @return {String} `jwtWTSign`
   */
  get token() {
    // console.log(thijwtWTSign());
    return this.jwtSign();
  }

  /**
   * Function returns complete encryption link
   * @function encryptedLink
   * @return {String} encrypted Link
   */
  encryptedLink() {
    // eslint-disable-next-line max-len
    const encLink = `${
      this.protocol
    }://${
      this.URLString
    }${
      this.mode === 'param' ? `/${
        this.jwtWTSign()
      }`
        : `/?${
          this.name
        }=`}${
      this.jwtWTSign()
    }`;
    return encLink;
  }
}

/**
 * JWT helper
 * @module Bingo
 */
module.exports = new Bingo();

/*
const hey = new Bingo();
hey.form({
  payload: {
    email: 'knjbhvgcffgvhbjnksd',
  },
  key: 'knfnjfk',
  options: {
    expiresIn: 5600,
  },
}, {
  mode: 'query',
}, 'jdbnbnfeubnine');
console.log(hey.Object);
console.log(hejwtWTSign());
console.log(hey.encryptedLink());
 */
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
console.log(hejwtWTSign()); */
