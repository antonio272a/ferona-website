const fs = require('fs');

const lines = fs.readFileSync('./materials_with_price.txt').toString().replace(/\r/g, '').split('\n');
const json = {}
lines.forEach((line) => {
  const [material, price] = line.split('\t');
  json[material.trim().toLowerCase()] = Number(price)
})

fs.writeFileSync('./materiais_com_preco.json', JSON.stringify(json))