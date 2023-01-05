const fs = require("fs");
const readline = require("readline");

async function csvtojson(path) {
  const data = [];
  const fileStream = fs.createReadStream(path, "utf8");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  for await (let line of rl) {
    line = line
      .substring(line.indexOf(":") + 1)
      .replace(";", "")
      .toLowerCase();
    if (line.length === 0) continue;
    line = line.split(", ").reduce((p, c) => {
      const [field, value] = c.split("=");
      if (field === "timestamp") p[field] = new Date(Number(value) * 1000);
      else p[field] = value;
      return p;
    }, {});
    data.push(line);
  }

  return data;
}

module.exports = csvtojson;
