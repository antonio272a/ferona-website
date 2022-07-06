const fs = require('fs')

const json = {}

const materials = fs.readFileSync('./materials.txt').toString().replace(/\r/g, '').split('\n');

materials.forEach((material) => {
  json[material.toLowerCase()] = "../images/materials/black.png";
});

fs.writeFileSync('materialImages.json', JSON.stringify(json));