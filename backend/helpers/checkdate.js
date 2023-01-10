function isValidDate(dateString) {
  return new Date(dateString).toString() !== "Invalid Date";
}

module.exports = isValidDate;
