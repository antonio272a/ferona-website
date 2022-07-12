const materialsPrices = {
  "black washed taffeta 01": 7,
  "black beige washed taffeta 08": 10,
  "black yellow washed taffeta 37": 10,
  "black light blue washed taffeta 49": 10,
  "black navy washed taffeta 82": 10,
  "yellow firework print double georgette": 8,
  "black firework print double georgette": 8,
  "black spangle sequins": 8,
  "black royal micro satin 01": 10,
  "black firework print stretch": 20,
  "olive brown cotton satin spandex 24": 8,
  "lime royal micro satin 68": 10,
  "aubergine cotton satin spandex 12": 8,
  "olive royal micro satin 56": 10,
  "black firework print duchess": 20,
  "yellow firework print duchess": 20,
  "black radiance 01": 10,
  "brown cotton satin spandex 24": 8,
  "beige camel radiance 36": 10,
  "navy radiance 04": 10,
  "black double georgette": 8,
  "black aubergine cotton satin spandex 12": 8,
  "black square leather": 12,
  "aubergine radiance 04": 10,
  "black organza": 10,
  "glitter tulle": 12,
  "beige royal micro satin 08": 10,
  "brown royal micro satin 38": 10,
  "orange royal micro satin 53": 10,
  "aubergine camel radiance 07": 8,
  "aubergine orange radiance 32": 8,
  "gold organza": 10,
  "white glitter tulle": 12,
  "navy royal micro satin 12": 10,
  "navy organza": 10,
  "aubergine royal micro satin 62": 10,
  "navy glitter tulle": 12,
  "off white crepe du chine": 12,
  "orange radiance 32": 8,
  "off white royal micro satin 02": 10,
  "light brown micro satin 38": 10,
  "dark brown micro satin 06": 10,
  "off white radiance 02": 8,
  "brown radiance 07": 8,
  "dark brown cotton satin 24": 10,
  "light brown cotton satin 31": 10,
  "geranium orange cotton satin 31": 10,
  "black lime royal micro satin 68": 10,
  "black cotton satin 01": 10,
  "forest green radiance 45": 8,
  "military green cotton satin 42": 10,
  "black yellow royal micro satin 37": 10,
  "black beige royal micro satin 08": 10,
  "yellow radiance 18": 8,
  "forest green light blue radiance 35": 8,
  "black marocain 01": 15,
  "yellow marocain 18": 15,
  "forest green marocain 34": 15,
  "black firework print marocain": 20,
  "yellow firework print marocain": 20,
  "olive navy marocain 13": 15,
  "light blue royal micro satin 73": 10,
};


const partsMeters = {
  "TA001": 1,
  "TA002": 0.8,
  "TA003-LINE": 0.2,
  "TA003-SLEEVES": 0.8,
  "TB001": 0.5,
  "TB002": 0.4,
  "TB003-FRILL": 0.5,
  "TB003-SLEEVES": 0.4,
  "TC001": 1,
  "TC002": 1,
  "TC003": 2,
  "TD001": 2,
  "SA001-SKIRT": 1,
  "SA001-FRILL": 3,
  "SA002-SKIRT": 1,
  "SA002-FRILL": 3,
  "SB001-SKIRT": 2,
  "SB001-FRILL": 3,
  "SB002-SKIRT": 3,
  "SB002-FRILL": 4,
  "SC001": 3,
  "SC002": 4.5,
  "SD001": 3,
  "SD002": 4.5,
  "PA001": 3.5,
  "PA002": 1.2,
  "DR001": 3
}

const partsPrices = {
  "TA001": 50,
  "TA002": 75,
  "TA003-SLEEVES": 80,
  "TB001": 55,
  "TB002": 65,
  "TB003-SLEEVES": 90,
  "TC001": 75,
  "TC002": 60,
  "TC003": 95,
  "TD001": 95,
  "SA001-FRILL": 80,
  "SA002-FRILL": 150,
  "SB001-FRILL": 90,
  "SB002-FRILL": 175,
  "SC001": 120,
  "SC002": 150,
  "SD001": 120,
  "SD002": 150,
  "PA001": 80,
  "PA002": 50,
  "DR001": 150
}

const calculateTotal = (result) => {
  const finalMultiplier = 3
  // console.log(result);
  const materialPrices = result.reduce((acc, {part, material}) => (
    acc + (materialsPrices[material] * partsMeters[part])
  ), 0);
  
  const partPrices = result.reduce((acc, {part}) => {
    const partPrice = partsPrices[part] || 0
    // console.log(part, partPrice);
    return acc + partPrice
  }, 0)
  // console.log(partPrices, materialPrices);
  const finalPrice = (partPrices + materialPrices) * finalMultiplier

  return finalPrice;
}

const calculateTotalForChart = async (sku) => {
  return new Promise(async (resolve, reject) => {
    const testContainer = document.getElementById('test-container')
    const skuDiv = document.createElement('div')
    skuDiv.id = sku
    testContainer.appendChild(skuDiv)
    const options = {
      distID: "latest",
      solution3DName: skuReference[sku].solution3DName,
      projectName: "first-project",
      solution3DID: skuReference[sku].solution3DID,
      containerID: sku,
      
      onLoadingChanged: function (loading) {
        loadingBar.style.width = loading.progress + "%";
      },
      
      onCameraInteraction: function () {
        Unlimited3D.enableAutoRotate({
          enable: false,
        });
      }
    };
    
    const threedium = new Threedium();
    await threedium.init(options);
    await threedium.setDefaultMateirals();
    threedium.setCameraControl();
    const relevantParts = threedium.parts.filter((part) => !part.includes('#') || part.includes('$') );
    
    const getCheapestMaterialsForPart = (part) => {
      const { materials } = threedium;      
      
      const filteredMaterials = materials.filter((material) => {
        const subMaterialPlus = material.includes("[subpart]") ? 4 : 0;
        const materialReference = material.slice(
          material.indexOf("["),
          material.indexOf(")") + 1 + subMaterialPlus
          );
      const isMaterial = materialReference.startsWith(
        part.slice(0, part.indexOf(")") + 1 + subMaterialPlus)
        );
        if (material.match(/{/g)) {
          const isSubMaterial = material.match(/{/g).length > 2;
          return isMaterial && !isSubMaterial;
        }
        
        return isMaterial;
      }).map((material) => material.slice(0, material.indexOf('|')).trim().toLowerCase());
      const sortedByPrice = filteredMaterials.sort((a, b) => materialsPrices[a] - materialsPrices[b]);
      // console.log(filteredMaterials.map((mat) => ({ material: mat, price: materialsPrices[mat] })));
      
      return sortedByPrice[0];
    }
        
    const topPartAndSubParts = relevantParts.filter((part) => (
      part.startsWith('[top](01)') || part.startsWith('[subpart][top](01)')
      ));
      
    const bottomPartAndSubParts = relevantParts.filter((part) => (
      part.startsWith('[bottom](01)') || part.startsWith('[subpart][bottom](01)')
    ));
        
    const minorParts = [...topPartAndSubParts, ...bottomPartAndSubParts];
    
    const cheapestCombination = minorParts.map((part) => {
      const partName = partNamesReference[skuReference[sku].solution3DID][part]
      
      if(part.includes('#')) {
        const dependsFromReference = part.slice(part.indexOf('#') + 1, part.indexOf('$'))
        
        const dependsFrom = relevantParts.find((p) => p.startsWith(dependsFromReference));
        
        return {
          part: partName,
          material: getCheapestMaterialsForPart(dependsFrom),
        };
      }
      
      return {
        part: partName,
        material: getCheapestMaterialsForPart(part),
      };
    });
        
    // console.log(cheapestCombination);
    const finalPrice = calculateTotal(cheapestCombination);
    // console.log(skuReference[sku].solution3DName, `${finalPrice.toFixed(2)} EUR`);
    resolve(`${skuReference[sku].solution3DName}\t${finalPrice.toFixed(2)} EUR`)
    // const input = document.createElement('input')
    // input.type = 'text'
    // input.value = `${finalPrice.toFixed(2)} EUR`;
    // document.getElementById('test-btn').appendChild(input)
    // input.focus()
    // navigator.clipboard.writeText(input.value);
  })
}

const results = [];
const executeChartCalc = async (array, index) => {
  if(!array[index]) return;
  const result = await calculateTotalForChart(array[index]);
  console.log(array[index], result);
  results.push(result);
  return executeChartCalc(array, index + 1);
}

window.onload = async() => {
  
  const startBtn = document.getElementById('toggle-mannequin-btn');
  startBtn.innerText = 'start the count';
  startBtn.className = 'btn btn-success btn-lg';
  startBtn.addEventListener('click', async () => {
    const skus = Object.keys(skuReference);
    await executeChartCalc(skus, 0);
    // console.log(results);
    const resultsText = results.reduce((acc, act) => (`${acc}${act}\r`), '')
    const testBtn = document.getElementById('test-btn');
    testBtn.innerText = 'Done! click here to copy the result'
    const audio = new Audio('./min_price_script/alert.mp3');
    audio.play()
    testBtn.addEventListener('click', async () => {
      navigator.clipboard.writeText(resultsText);
      testBtn.innerText = 'Copied!';
      await new Promise((r) => setTimeout(() => r(), 1000))
      testBtn.innerText = "Done! click here to copy the result";
    })
  })
    // await Promise.all(teste);
    // console.log(teste);
  // const teste = await calculateTotalForChart(sku)
  
}