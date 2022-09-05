// Id's for the interaction with the HTML
const threediumContainerId = "container3d_replace";
const topPartContainerId = "top-part-container";
const bottomPartContainerId = "bottom-part-container";
const topMaterialContainerId = "top-material-container";
const bottomMaterialContainerId = "bottom-material-container";
const mannequinBtnId = "toggle-mannequin-btn";
const saveButtonId = "save-btn";

// Classes for the styling
const partMaterialContainerClassName = "border border-danger border-2";
const materialSubContainerClassName = "border border-warning border-2";
const notSelectedMaterialButtonClassName = "btn btn-secondary btn-sm m-1";
const selectedMaterialButtonClassName = "btn btn-primary btn-sm m-1";
const selectedPartButtonClassName = "btn btn-primary m-1";
const notSelectedPartButtonClassName = "btn btn-secondary m-1";
const partImageOnPartClassName = "";
const partImageOnMaterialClassName = "";


// CallBacks to interact with the user

// In case the user does not select a material for one of the selected parts
const notAllMaterialsSelected = (partsArray) => {
  const partsTextForAlert = partsArray.reduce((acc, act, i) => {
    if (i !== 0) {
      return `${acc}, ${act}`;
    }
    return `${act}`;
  }, "");

  window.alert(
    `Please select material for the following parts: \n - ${partsTextForAlert}`
  );
};

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
  TA001: 1,
  TA002: 0.8,
  "TA003-LINE": 0.2,
  "TA003-SLEEVES": 0.8,
  TB001: 0.5,
  TB002: 0.4,
  "TB003-FRILL": 0.5,
  "TB003-SLEEVES": 0.4,
  TC001: 1,
  TC002: 1,
  TC003: 2,
  TD001: 2,
  "SA001-SKIRT": 1,
  "SA001-FRILL": 3,
  "SA002-SKIRT": 1,
  "SA002-FRILL": 3,
  "SB001-SKIRT": 2,
  "SB001-FRILL": 3,
  "SB002-SKIRT": 3,
  "SB002-FRILL": 4,
  SC001: 3,
  SC002: 4.5,
  SD001: 3,
  SD002: 4.5,
  PA001: 3.5,
  PA002: 1.2,
  DR001: 3,
};

const partsPrices = {
  TA001: 50,
  TA002: 75,
  "TA003-SLEEVES": 80,
  TB001: 55,
  TB002: 65,
  "TB003-SLEEVES": 90,
  TC001: 75,
  TC002: 60,
  TC003: 95,
  TD001: 95,
  "SA001-FRILL": 80,
  "SA002-FRILL": 150,
  "SB001-FRILL": 90,
  "SB002-FRILL": 175,
  SC001: 120,
  SC002: 150,
  SD001: 120,
  SD002: 150,
  PA001: 80,
  PA002: 50,
  DR001: 150,
};

const calculateTotal = (result) => {
  const finalMultiplier = 3;
  // console.log(result);
  const materialPrices = result.reduce(
    (acc, { part, material }) =>
      acc + materialsPrices[material] * partsMeters[part],
    0
  );

  const partPrices = result.reduce((acc, { part }) => {
    const partPrice = partsPrices[part] || 0;
    // console.log(part, partPrice);
    return acc + partPrice;
  }, 0);
  // console.log(partPrices, materialPrices);
  const finalPrice = (partPrices + materialPrices) * finalMultiplier;

  return finalPrice;
};

// on clicking the saving button
// productSku: the sku of the product
// parts: An array with all the selected parts and their respective materials
// image: the url of the chart image
const onSave = (productSku, parts, image) => {
  console.log(productSku, parts, image);
  const result = {
    parts,
    image,
  };
  console.log(calculateTotal(result.parts));
  sessionStorage.setItem(productSku, JSON.stringify(result));
};

// size of the snapshot on save
const snapshotSize = { width: 1280, height: 720 };
const snapshotType = 'url' // types: 'url' / 'blob' / 'base64'  

// In the application the sku will come from somewhere like the URL;
const sku = 'sku-0';

// reference for the threedium based on the sku's;

const skuReference = {
  "sku-0": { solution3DID: "42507", solution3DName: "TD001" },
  "sku-1": { solution3DID: "42444", solution3DName: "DR 001" },
  "sku-2": { solution3DID: "42476", solution3DName: "PA001 TA" },
  "sku-3": { solution3DID: "42478", solution3DName: "PA001 TB" },
  "sku-4": { solution3DID: "42480", solution3DName: "PA001 TD" },
  "sku-5": { solution3DID: "42481", solution3DName: "PA001 TC" },
  "sku-6": { solution3DID: "42508", solution3DName: "PA002 TA" },
  "sku-7": { solution3DID: "42509", solution3DName: "PA002 TB" },
  "sku-8": { solution3DID: "42510", solution3DName: "PA002 TC" },
  "sku-9": { solution3DID: "42519", solution3DName: "PA002 TD" },
  "sku-10": { solution3DID: "42487", solution3DName: "SA001 TA" },
  "sku-11": { solution3DID: "42488", solution3DName: "SA001 TB" },
  "sku-12": { solution3DID: "42489", solution3DName: "SA001 TC" },
  "sku-13": { solution3DID: "42494", solution3DName: "SA001 TD" },
  "sku-14": { solution3DID: "42495", solution3DName: "SB001 TA" },
  "sku-15": { solution3DID: "42520", solution3DName: "SA002 TA" },
  "sku-16": { solution3DID: "42521", solution3DName: "SA002 TB" },
  "sku-17": { solution3DID: "42522", solution3DName: "SA002 TC" },
  "sku-18": { solution3DID: "42523", solution3DName: "SA002 TD" },
  "sku-19": { solution3DID: "42496", solution3DName: "SB001 TB" },
  "sku-20": { solution3DID: "42497", solution3DName: "SB001 TC" },
  "sku-21": { solution3DID: "42498", solution3DName: "SB001 TD" },
  "sku-22": { solution3DID: "42544", solution3DName: "SB002 TA" },
  "sku-23": { solution3DID: "42545", solution3DName: "SB002 TB" },
  "sku-24": { solution3DID: "42546", solution3DName: "SB002 TC" },
  "sku-25": { solution3DID: "42547", solution3DName: "SB002 TD" },
  "sku-26": { solution3DID: "42499", solution3DName: "SC001 TA" },
  "sku-27": { solution3DID: "42500", solution3DName: "SC001 TB" },
  "sku-28": { solution3DID: "42501", solution3DName: "SC001 TC" },
  "sku-29": { solution3DID: "42502", solution3DName: "SC001 TD" },
  "sku-30": { solution3DID: "42548", solution3DName: "SC002 TA" },
  "sku-31": { solution3DID: "42575", solution3DName: "SC002 TB" },
  "sku-32": { solution3DID: "42576", solution3DName: "SC002 TC" },
  "sku-33": { solution3DID: "42577", solution3DName: "SC002 TD" },
  "sku-34": { solution3DID: "42503", solution3DName: "SD001 TA" },
  "sku-35": { solution3DID: "42504", solution3DName: "SD001 TB" },
  "sku-36": { solution3DID: "42505", solution3DName: "SD001 TC" },
  "sku-37": { solution3DID: "42506", solution3DName: "SD001 TD" },
  "sku-38": { solution3DID: "42578", solution3DName: "SD002 TA" },
  "sku-39": { solution3DID: "42579", solution3DName: "SD002 TB" },
  "sku-40": { solution3DID: "42580", solution3DName: "SD002 TC" },
  "sku-41": { solution3DID: "42581", solution3DName: "SD002 TD" },
};