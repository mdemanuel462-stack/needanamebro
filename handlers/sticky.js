const fs = require('fs');

const path = './sticky.json';

let data = {};

if (fs.existsSync(path)) {

  try {

    data = JSON.parse(
      fs.readFileSync(path, 'utf8')
    );

  } catch {

    data = {};
  }
}

function save() {

  fs.writeFileSync(
    path,
    JSON.stringify(data, null, 2)
  );
}

module.exports = {
  data,
  save
};
