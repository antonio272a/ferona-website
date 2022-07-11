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

// on clicking the saving button
// productSku: the sku of the product
// parts: An array with all the selected parts and their respective materials
// image: the url of the chart image
const onSave = (productSku, parts, image) => {
  console.log(productSku, parts, image);
  sessionStorage.setItem(
    productSku,
    JSON.stringify({
      parts,
      image
    })
  );
};

// size of the snapshot on save
const snapshotSize = { width: 1280, height: 720 };
const snapshotType = 'url' // types: 'url' / 'blob' / 'base64'  

// In the application the sku will come from somewhere like the URL;
const sku = "sku-30";

// reference for the threedium based on the sku's;

const skuReference = {
  "sku-0": { solution3DID: "42444", solution3DName: "DR 001" },
  "sku-1": { solution3DID: "42476", solution3DName: "PA001 TA" },
  "sku-2": { solution3DID: "42478", solution3DName: "PA001 TB" },
  "sku-3": { solution3DID: "42480", solution3DName: "PA001 TD" },
  "sku-4": { solution3DID: "42481", solution3DName: "PA001 TC" },
  "sku-5": { solution3DID: "42487", solution3DName: "SA001 TA" },
  "sku-6": { solution3DID: "42488", solution3DName: "SA001 TB" },
  "sku-7": { solution3DID: "42489", solution3DName: "SA001 TC" },
  "sku-8": { solution3DID: "42494", solution3DName: "SA001 TD" },
  "sku-9": { solution3DID: "42495", solution3DName: "SB001 TA" },
  "sku-10": { solution3DID: "42496", solution3DName: "SB001 TB" },
  "sku-11": { solution3DID: "42497", solution3DName: "SB001 TC" },
  "sku-12": { solution3DID: "42498", solution3DName: "SB001 TD" },
  "sku-13": { solution3DID: "42499", solution3DName: "SC001 TA" },
  "sku-14": { solution3DID: "42500", solution3DName: "SC001 TB" },
  "sku-15": { solution3DID: "42501", solution3DName: "SC001 TC" },
  "sku-16": { solution3DID: "42502", solution3DName: "SC001 TD" },
  "sku-17": { solution3DID: "42503", solution3DName: "SD001 TA" },
  "sku-18": { solution3DID: "42504", solution3DName: "SD001 TB" },
  "sku-19": { solution3DID: "42505", solution3DName: "SD001 TC" },
  "sku-20": { solution3DID: "42506", solution3DName: "SD001 TD" },
  "sku-21": { solution3DID: "42507", solution3DName: "TD001" },
  "sku-22": { solution3DID: "42508", solution3DName: "PA002 TA" },
  "sku-23": { solution3DID: "42509", solution3DName: "PA002 TB" },
  "sku-24": { solution3DID: "42510", solution3DName: "PA002 TC" },
  "sku-25": { solution3DID: "42519", solution3DName: "PA002 TD" },
  "sku-26": { solution3DID: "42520", solution3DName: "SA002 TA" },
  "sku-27": { solution3DID: "42521", solution3DName: "SA002 TB" },
  "sku-28": { solution3DID: "42522", solution3DName: "SA002 TC" },
  "sku-29": { solution3DID: "42523", solution3DName: "SA002 TD" },
  "sku-30": { solution3DID: "42544", solution3DName: "SB002 TA" },
  "sku-31": { solution3DID: "42545", solution3DName: "SB002 TB" },
  "sku-32": { solution3DID: "42546", solution3DName: "SB002 TC" },
  "sku-33": { solution3DID: "42547", solution3DName: "SB002 TD" },
  "sku-34": { solution3DID: "42548", solution3DName: "SC002 TA" },
  "sku-35": { solution3DID: "42575", solution3DName: "SC002 TB" },
  "sku-36": { solution3DID: "42576", solution3DName: "SC002 TC" },
  "sku-37": { solution3DID: "42577", solution3DName: "SC002 TD" },
  "sku-38": { solution3DID: "42578", solution3DName: "SD002 TA" },
  "sku-39": { solution3DID: "42579", solution3DName: "SD002 TB" },
  "sku-40": { solution3DID: "42580", solution3DName: "SD002 TC" },
  "sku-41": { solution3DID: "42581", solution3DName: "SD002 TD" },
};