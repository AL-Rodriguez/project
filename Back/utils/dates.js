const { format, formatISO9075, parse } = require("date-fns");

function formatDate(date) {
    return format(new Date(date), "yyyy-MM-dd HH:mm:ss");
  }


function dateTransform(date) {
    const parseDate = parse(date, "yyyy-M-dd", new Date());
    const sqlDate = formatISO9075(parseDate);
    return sqlDate;
  }

  module.exports = {
    dateTransform,
    formatDate
  }