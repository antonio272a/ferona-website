// Id's for the interaction with the HTML
const threediumContainerId = "container3d_replace";
const topPartContainerId = "top-part-container";
const bottomPartContainerId = "bottom-part-container";
const topMaterialContainerId = "top-material-container";
const bottomMaterialContainerId = "bottom-material-container";
const mannequinBtnId = 'toggle-mannequin-btn';
const saveButtonId = 'save-btn';

// Classes for the styling
const materialContainerClassName = "border border-danger border-2";
const notSelectedMaterialButtonClassName = 'btn btn-secondary btn-sm m-1';
const selectedMaterialButtonClassName = 'btn btn-primary btn-sm m-1';
const selectedPartButtonClassName = 'btn btn-primary m-1';
const notSelectePartButtonClassName = 'btn btn-secondary m-1';
const materialSubContainerClassName = "border border-warning border-2";
const partImageClassName = ""

const showImage = false;
const id = 42547;

// CallBacks to interact with the user
const notAllMaterialsSelected = (partsArray) => {
  const partsTextForAlert = partsArray.reduce((acc, act, i) => {
    if (i !== 0) {
      return `${acc}, ${act}`;
    }
    return `${act}`;
  }, "");

  window.alert(
    `Please selecte material for the following parts: \n - ${partsTextForAlert}`
  );
}


window.onload = async () => {
  let flagInterract = true;

  // In the application the sku will come from somewhere like the URL;
  const sku = "sku-0";

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

  //  42494; 42594 42489

  // top(02) 42476
  // subpart 42489

  const options = {
    distID: "latest",
    solution3DName: skuReference[sku].solution3DName,
    projectName: "first-project",
    solution3DID: id || skuReference[sku].solution3DID,
    containerID: threediumContainerId,

    onLoadingChanged: function (loading) {
      loadingBar.style.width = loading.progress + "%";
    },

    onCameraInteraction: function () {
      if (flagInterract) {
        document.getElementsByClassName("drag-and-scroll")[0].style.display =
          "none";

        Unlimited3D.enableAutoRotate({
          enable: false,
        });

        flagInterract = false;
      }
    },
  };

  const threedium = new Threedium();
  await threedium.init(options);
  await threedium.setDefaultMateirals();

  // add the selectedMaterials keys to the store
  const selectedMaterials = {};
  threedium.parts
    .filter((part) => part.startsWith("[") && !part.includes("#"))
    .forEach((part) => (selectedMaterials[part] = null));

  const initialState = {
    selectedTop:
      threedium.parts.find((part) => part.startsWith("[top](01)")) || "",
    selectedBottom:
      threedium.parts.find((part) => part.startsWith("[bottom](01)")) || "",
    parts: threedium.parts,
    materials: threedium.materials,
  };

  const store = new Store(initialState);
  const materialsStore = new Store(selectedMaterials);

  const topPartContainer = document.getElementById(topPartContainerId);
  const bottomPartContainer = document.getElementById(bottomPartContainerId);
  const topMaterialContainer = document.getElementById(topMaterialContainerId);
  const bottomMaterialContainer = document.getElementById(
    bottomMaterialContainerId
  );

  const clearButtons = () => {
    topPartContainer.innerHTML = "";
    bottomPartContainer.innerHTML = "";
    topMaterialContainer.innerHTML = "";
    bottomMaterialContainer.innerHTML = "";
  };

  const handlePartInput = ({ target: { id } }) => {
    const partType = id.slice(id.indexOf("[") + 1, id.indexOf("]"));
    const capitalizedPartType = partType.replace(/^\w/, (c) => c.toUpperCase());
    store.setState({ [`selected${capitalizedPartType}`]: id });
  };

  const genericCreatePartsButtons = (parts, container, selected) => {
    parts.forEach((name) => {
      const button = document.createElement("button");
      button.innerText = name.includes("#")
        ? name.slice(0, name.indexOf("#"))
        : name;
      button.id = name;
      button.addEventListener("click", handlePartInput);

      if (name === selected) {
        button.disabled = true;
        button.className = selectedPartButtonClassName;
      } else {
        button.className = notSelectePartButtonClassName;
      }
      container.appendChild(button);
    });
  };

  const createPartsButtons = () => {
    const {
      state: { parts, selectedTop, selectedBottom },
    } = store;
    const topParts = parts.filter((part) => part.startsWith("[top]"));
    const bottomParts = parts.filter((part) => part.startsWith("[bottom]"));

    genericCreatePartsButtons(topParts, topPartContainer, selectedTop);

    genericCreatePartsButtons(bottomParts, bottomPartContainer, selectedBottom);
  };

  const getSubParts = (selectedPart) => {
    const {
      state: { parts },
    } = store;
    const partType = selectedPart.slice(0, selectedPart.indexOf("]") + 1);
    const partNumber = selectedPart.slice(
      selectedPart.indexOf("("),
      selectedPart.indexOf(")") + 1
    );

    subPartsIndex = selectedPart
      .slice(selectedPart.indexOf("{") + 1, selectedPart.indexOf("}"))
      .split("-");

    const subParts = parts.filter((part) => {
      const isSubNode = part.startsWith(`[subpart]${partType}${partNumber}`);
      const isSubPart = subPartsIndex.some((index) =>
        part.startsWith(`${partType}(${index})`)
      );
      return isSubNode || isSubPart;
    });

    return subParts;
  };

  const toggleDisabledMaterialButtons = (material, disabled) => {
    const reference = material.slice(material.indexOf('|') + 1, material.indexOf('{')).trim()
    const possibleButtons = threedium.materials.filter((mat) => {
      const matReference = mat.slice(mat.indexOf("|") + 1).trim();
      return matReference.startsWith(reference);
    })
    possibleButtons.forEach((possibleButton) => {
      const button = document.getElementById(possibleButton);
      if(button) button.disabled = disabled;
    })
  }

  const createMaterialsButtons = (part, container) => {
    const {
      state: { materials },
    } = store;
    const { applyMaterials } = threedium;
    const partContainer = document.createElement("div");
    const materialSubContainer = document.createElement('div')
    const partImage = document.createElement('img');
    
    materialSubContainer.className = materialSubContainerClassName
    const partRealName = partNamesReference[id][part] // tirar o id no deploy
    
    partImage.src = partImages[partRealName]
    partImage.className = partImageClassName
    partContainer.appendChild(partImage);

    console.log(partRealName);

    partContainer.id = part;
    partContainer.className = materialContainerClassName;

    const filteredMaterials = materials.filter((material) => {
      const subMaterialPlus = material.includes('[subpart]') ? 4 : 0;
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
    });

    filteredMaterials.forEach((material) => {
      const isSubPart = material.includes("[subpart]");
      const firstIndex = material.indexOf("[");
      const lastIndex = isSubPart
        ? material.indexOf("}") + 1
        : material.indexOf(")") + 1;
      const partReference = material.slice(firstIndex, lastIndex);
      const part = threedium.parts.find((p) => p.startsWith(partReference));
      const isSelected = materialsStore.state[part] === material;

      const button = document.createElement("button");
      if (showImage) {
        const materialKey = material.slice(0, material.indexOf("|")).trim().toLowerCase();
        const image = document.createElement('img');
        image.src = materialImages[materialKey] || "./assets/images/materials/red.jpg";
        if(!materialImages[materialKey]) console.log(material);
        image.style.width = "10px"
        image.id = material
        button.appendChild(image)
      } else {
        button.innerText = material;
      }
      
      button.id = material;
      // buttton.innerText = material;

      if (isSelected) {
        button.disabled = true;
        button.className = selectedMaterialButtonClassName;
      } else {
        button.className = notSelectedMaterialButtonClassName;
      }

      button.onclick = async ({ target: { id } }) => {
        materialsStore.setState({ [part]: id });
        toggleDisabledMaterialButtons(id, true);
        await applyMaterials(id);
        toggleDisabledMaterialButtons(id, false);
      };

      materialSubContainer.appendChild(button);
    });
    partContainer.appendChild(materialSubContainer)
    container.appendChild(partContainer);
  };

  const createMaterialContainers = () => {
    const {
      state: { selectedTop, selectedBottom },
    } = store;

    if (selectedTop) {
      const topSubParts = getSubParts(selectedTop);

      if (!selectedTop.includes("#")) {
        createMaterialsButtons(selectedTop, topMaterialContainer);
      }

      topSubParts.forEach((subPart) => {
        if (!subPart.includes("#")) {
          createMaterialsButtons(subPart, topMaterialContainer);
        }
      });
    }

    if (selectedBottom) {
      const bottomSubParts = getSubParts(selectedBottom);

      if (!selectedBottom.includes("#")) {
        createMaterialsButtons(selectedBottom, bottomMaterialContainer);
      }

      bottomSubParts.forEach((subPart) => {
        if (!subPart.includes("#")) {
          createMaterialsButtons(subPart, bottomMaterialContainer);
        }
      });
    }
  };

  const selectParts = async () => {
    const { selectPart } = threedium;
    const {
      state: { selectedTop, selectedBottom },
    } = store;
    if (selectedTop) await selectPart(selectedTop);

    if (selectedBottom) await selectPart(selectedBottom);
  };

  store.setStateCallback(async () => {
    clearButtons();
    createPartsButtons();
    createMaterialContainers();
    await selectParts();
  });

  materialsStore.setStateCallback(() => {
    clearButtons();
    createPartsButtons();
    createMaterialContainers();
  });

  let mannequinDisplayed = true;

  const mannequinBtn = document.getElementById(mannequinBtnId);
  mannequinBtn.addEventListener("click", () => {
    const { showMannequin, hideMannequin } = threedium;
    mannequinDisplayed ? hideMannequin() : showMannequin();
    mannequinDisplayed = !mannequinDisplayed;
  });

  const saveButton = document.getElementById(saveButtonId);

  saveButton.addEventListener("click", () => {
    const {
      state: { selectedTop, selectedBottom },
    } = store;

    const selectedTopReference =
      selectedTop.indexOf("{") > 0
        ? selectedTop.slice(0, selectedTop.indexOf("{"))
        : selectedTop;

    const selectedBottomReference =
      selectedBottom.indexOf("{") > 0
        ? selectedBottom.slice(0, selectedBottom.indexOf("{"))
        : selectedBottom;

    

    const selectedPartsWithIndependentMaterials = threedium.parts
      .filter((part) => {
        const isPart = part === selectedTop || part === selectedBottom;
        const isSubNode =
          part.startsWith(`[subpart]${selectedTopReference}`) ||
          part.startsWith(`[subpart]${selectedBottomReference}`);
        const hasIndependentColor = !part.includes("#");
        selectedBottom.slice(
          selectedBottom.indexOf("{") + 1,
          selectedBottom.indexOf("}")
        );
        let isBottomSubPart = false;
        let isTopSubPart = false;

        if (selectedBottom.indexOf("{") > 0) {
          part.startsWith(
            `[bottom](${selectedBottom.slice(
              selectedBottom.indexOf("{") + 1,
              selectedBottom.indexOf("}")
            )})`
          );
        }

        if (selectedTop.indexOf("{") > 0) {
          isTopSubPart = part.startsWith(
            `[top](${selectedTop.slice(
              selectedTop.indexOf("{") + 1,
              selectedTop.indexOf("}")
            )})`
          );
        }

        return (
          (isPart || isBottomSubPart || isTopSubPart || isSubNode) &&
          hasIndependentColor
        );
      });

      const allColorsSelected = selectedPartsWithIndependentMaterials.every(
        (part) => materialsStore.state[part] !== null
      );


      if (!allColorsSelected) {
        const notSelectedMaterialParts =
          selectedPartsWithIndependentMaterials.filter(
            (part) => materialsStore.state[part] === null
          );

        notAllMaterialsSelected(notSelectedMaterialParts);
        return;
      }

      const mappedSelectedPartsWithIndependentMaterials =
        selectedPartsWithIndependentMaterials.map((part) => {
          const { solution3DID: id } = skuReference[sku];

          const material = materialsStore.state[part];
          try {
            return {
              part: partNamesReference[id][part],
              material: material.slice(0, material.indexOf("|")).trim() || "",
            };
          } catch (error) {
            return part;
          }
        });

    const selectedPartsWithDependentMaterials = threedium.parts
      .filter((part) => {
        const hasTag = part.includes("#") && part.includes("$");
        if (!hasTag) return false;

        const dependentFromReference = part.slice(
          part.indexOf("#") + 1,
          part.indexOf("$")
        );

        const isPart = selectedTop === part || selectedBottom === part;

        const isDependent =
          selectedTop.startsWith(dependentFromReference) ||
          selectedBottom.startsWith(dependentFromReference);

        const isSubPart =
          part.startsWith(
            `[subpart]${selectedTop.slice(
              selectedTop.indexOf("["),
              selectedTop.indexOf(")") + 1
            )}`
          ) ||
          part.startsWith(
            `[subpart]${selectedBottom.slice(
              selectedBottom.indexOf("["),
              selectedBottom.indexOf(")") + 1
            )}`
          );

        const topSubPartNumber = selectedTop.slice(
          selectedTop.indexOf("{") + 1,
          selectedTop.indexOf("}")
        );
        const bottomSubPartNumber = selectedBottom.slice(
          selectedBottom.indexOf("{") + 1,
          selectedBottom.indexOf("}")
        );
        const isSubPartFromSubPart =
          part.startsWith(`[subpart][top](${topSubPartNumber})`) ||
          part.startsWith(`[subpart][bottom](${bottomSubPartNumber})`);

        const isDependentFromSubPart =
          dependentFromReference.startsWith(`[top](${topSubPartNumber})`) ||
          dependentFromReference.startsWith(`[bottom](${bottomSubPartNumber})`);

        return (
          (isPart || isSubPart || isSubPartFromSubPart) &&
          (isDependentFromSubPart || isDependent)
        );
      })
      .map((part) => {
        const { solution3DID: id } = skuReference[sku];
        const reference = part.slice(part.indexOf("#") + 1, part.indexOf("$"));
        const dependentFromPart = threedium.parts.find((p) =>
          p.startsWith(reference)
        );
        const material = materialsStore.state[dependentFromPart];

        return {
          part: partNamesReference[id][part],
          material: material.slice(0, material.indexOf("|")).trim(),
        };
      });

    const partsToSave = [
      ...mappedSelectedPartsWithIndependentMaterials,
      ...selectedPartsWithDependentMaterials,
    ];

    console.log(partsToSave);
    sessionStorage.setItem(
      sku,
      JSON.stringify({
        parts: partsToSave,
        image: "url",
      })
    );
  });
 
  await store._stateCallback();
}