const mement = require('moment');

let generateMessage = (from, text) => {
  return {
    from,
    text,
    createdAt: mement().valueOf()
  };
};

let generateLocationMessage = (from, lat, lng) => {
  return {
    from,
    url: `https://google.com/maps?q=${lat}, ${lng}`,
    createdAt: mement().valueOf()
  };
};

module.exports = {generateMessage, generateLocationMessage};
