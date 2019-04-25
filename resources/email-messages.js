module.exports = (() => {
  return {
    signUpMail: (doc, verificationLink) => {
      return {
        head: `Welcome! ${
          doc.firstname
        },`,
        body:
          `Complete registration, click the link:${
            '\n'
          }${
            verificationLink
          }`,
        foot: `(c) ${
          new Date()
              .getFullYear()
        } Garbage Can Inc.`,
      };
    },
    verificationMail: (doc, APIKey) => {
      return {
        head: `Hi! ${
          doc.firstname
        },`,
        body:
          `Account Verified!:${
            '\n'
          }${
            APIKey
          }`,
        foot: `(c) ${
          new Date()
              .getFullYear()
        } Garbage Can Inc.`,
      };
    },
    recoveryLink: (doc, recoveryLink) => {
      return {
        head: `Welcome! ${
          doc.firstname
        },`,
        body: `Follow the link below to recover your account:${
          '\n'
        }${
          recoveryLink
        }`,
        foot: `(c) ${
          new Date()
              .getFullYear()
        } Garbage Can Inc.`,
      };
    },
    deleteMail: (doc) => {
      return {
        head: `Welcome! ${
          doc.firstname
        },`,
        body: `Your Account has been deleted.`,
        foot: `(c) ${
          new Date()
              .getFullYear()
        } Garbage Can Inc.`,
      };
    },
    joinMail: (doc, link) => {
      return {
        head: `Welcome! ${
          doc.firstname
        },`,
        body: `Click the Link to Verify your membership below:${
          '\n'
        }${
          link
        }`,
        foot: `Technical Unit,${
          '\n'
        }Living Faith Church${
          '\n'
        }Ring road, Ibadan`,
      };
    },
  };
})();
