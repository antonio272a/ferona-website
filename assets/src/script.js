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

const showImage = false;
const id = 42444;

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
  const sku = "SKU-1831245R718";

  // reference for the threedium based on the sku's;

  const skuReference = {
    "SKU-1831245R718": {
      solution3DID: id,
      solution3DName: "sa-001-td-chart",
    },
  };

  //  42494; 42594 42489

  // top(02) 42476
  // subpart 42489

  const options = {
    distID: "latest",
    solution3DName: skuReference[sku].solution3DName,
    projectName: "first-project",
    solution3DID: skuReference[sku].solution3DID,
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

  const createMaterialsButtons = (part, container) => {
    const {
      state: { materials },
    } = store;
    const { applyMaterials } = threedium;
    const partContainer = document.createElement("div");
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

      button.onclick = ({ target: { id } }) => {
        materialsStore.setState({ [part]: id });
        applyMaterials(id);
      };

      partContainer.appendChild(button);
    });

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
      })
      .map((part) => {
        const { solution3DID: id } = skuReference[sku];

        const material = materialsStore.state[part];
        return {
          part: partNamesReference[id][part],
          material: material.slice(0, material.indexOf("|")).trim(),
        };
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
      ...selectedPartsWithIndependentMaterials,
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
  console.log();
  await store._stateCallback();
}