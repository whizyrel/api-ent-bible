const sg = require('sendgrid');

/**
 * @Class MailMgr
 */
class MailMgr {
  /**
   * @function configure
   * @param {Object} Object
   * @return {Object}
   */
  configure(
      {
        method = 'POST', path = '/v3/mail/send',
        from, content, sendAt = null, replyTo = null,
        spamcheck = {enable: false, threshold: 0, post_to_url: null},
      }
  ) {
    this.method = method;
    this.path = path;
    this.sendAt = sendAt;
    this.spamcheck = spamcheck;

    Array.isArray(from) ?
      (() => {
        const [email, name] = from;
        this.from = {
          email: email,
          name: name,
        };
      })() :
      this.from = {
        email: from,
      };

    if (replyTo !== null) {
      replyTo.length === 3 ?
      (() => {
        const [subject, email, name] = replyTo;
        this.replyTo = {
          email: email,
          name: name,
          subject: subject,
        };
      }) :
      this.replyTo = {
        email: replyTo[1] || this.from.email,
        subject: replyTo[0],
      };
    } {
      typeof replyTo === 'string' ?
        this.replyTo = {
          email: this.from.email,
          subject: replyTo,
        } :
        MailMgr
            .errMsg(
                'subject cannot be null'
            );
    }

    // Check if Array of Arrays
    content
        .forEach((el) => {
          if (typeof el !== 'string') {
            (() => {
              const [type, value] = content;
              MailMgr.splitValue(type, value, this);
            })();
            return;
          }
          return (() => {
            this.content = content
                .map((el) => {
                  return (
                  // Element is an Array
                  Array.isArray(el) ?
                    (() => {
                      const [type, value] = el;
                      return {
                        type: `text/${type}`,
                        value: value,
                      };
                    })() :
                    // element is a string
                    {
                      type: 'text/html;',
                      value: el,
                    }
                  );
                });
          }
          )();
        });

    return this;
  }

  /**
 * @function splitValue
 * @param {String} typ
 * @param {Array} val
 * @param {Object} cl
 */
  static splitValue(typ, val, cl) {
    Array
        .isArray(val) ?
      cl.content = val
          .map((el) => {
            return {
              type: `text/${typ}`,
              value: el,
            };
          }) :
      cl.content = [{
        type: `text/${typ}`,
        value: val,
      }];
  }

  /**
   * @function setKey
   * @param {String} cl
   * @param {Object} key
   * @return {Obejct} `cl`
   */
  static setKey(cl, key) {
    cl.sg = sg(key);
    return cl;
  }

  /**
   * @function errMsg
   * @param {String} msg
   */
  static errMsg(msg) {
    throw new Error(`${msg}`);
  }

  /**
  * @function createHTML
  * @param {Object} array
  * @param {Object} sg
  * @return {Object}
  */
  personalize(array) {
    this.request =
      this.sg
          .emptyRequest({
            method: this.method,
            path: this.path,
            body: {
              personalizations: array,
              from: this.from,
              reply_to: this.replyTo,
              content: this.content,
              send_at: this.sendAt,
              spam_check: this.spamcheck,
            },
          });

    return this;
  }

  /**
   * @function createText
   * @param {Object} `Configuraton Object` text
   * @return {Object} `text`
   */
  createText({head, body, foot}) {
    return (
      `${
        (head ? head : '')
      }\n${body ? body : MailMgr.errMsg(
          'Object must have a body property'
      )}\n${
      foot ? foot : ''}`
    )
        .split('\n')
        .filter((el) => {
          return el !== '';
        })
        .join('\n');
  }

  /**
  * @function createHTML
  * @return {Object}
  */
  createHTML() {
    return {
      addBody: () => {

      },
      createBody: () => {

      },
      addFooter: () => {

      },
    };
  }

  /**
  * @function sendMail
  * @param {Object} sg
  * @return {Object} Object
  */
  sendMail() {
    return this.sg
    // eslint-disable-next-line new-cap
        .API(this.request);
  }
}

module.exports = (key) => {
  return MailMgr.setKey(new MailMgr(), key);
};

const mailMgr = new MailMgr();

MailMgr.setKey(mailMgr,
    'SG.-GMXJgBTSkiK9MEeLFlHTw.' +
  'jXGMgd3KAXmtWHwr70ENRDSLzsJ-D7Ny-Z-pyv2ceco'
);

/*
console.log(
    mailMgr
        .configure(
            {
              from: ['olaleyeisrael@gmail.com', 'Israel Oluwole'],
              replyTo: 'subject',
              content: [
                plain', ['hello there!'],
                // 'value',
              ],
            }
        ).personalize([])
);
 */
