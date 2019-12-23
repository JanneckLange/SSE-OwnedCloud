module.exports = {
  user: {
    username: 'Max Mustermann',
    email: 'mustermann@mail.de',
    password: '1234abc!', //8 Zeichen mit Buchstaben/Nummern/Sonderzeichen
  },
  file: [{ content: '2123456jladkfg', name: 'test file' }],
  wrong_data: {
    email: ['hansPeter', 'hans@Peter', 'hansPeter.de'],
    password: ['1234', 'test', 'unsafe!', '1234567890', 'LongUnsafePassword!'],
  },
};
