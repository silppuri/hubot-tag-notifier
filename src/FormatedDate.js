const moment = require("moment");

const weekAgo = () => {
  return moment()
    .subtract(7, "d")
    .format("DD.MM.YYYY");
};

module.exports = { weekAgo };
