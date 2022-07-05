// Id's for the interaction with the HTML
const topPartContainerId = "top-part-container";
const bottomPartContainerId = "bottom-part-container";
const topMaterialContainerId = "top-material-container";
const bottomMaterialContainerId = "bottom-material-container";
const mannequinBtnId = 'toggle-mannequin-btn';

// Classes for the styling
const materialContainerClassName = "border border-danger border-2";


window.onload = async () => {
  let flagInterract = true;

  const referenceObj = {
    "SKU-1831245R718": {
      solution3DID: "42548",
      solution3DName: "sc002-ta",
    },
  };

  //  42494; 42594

  const options = {
    distID: "latest",
    solution3DName: "sa001-td-chart",
    projectName: "first-project",
    solution3DID: "42494",
    containerID: "container3d_replace",

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

  const initialState = {
    selectedTop: threedium.parts.find((part) => part.startsWith("[top](01)")),
    selectedBottom: threedium.parts.find((part) =>
      part.startsWith("[bottom](01)")
    ),
    selectedTopMaterials: [],
    selectedBottomMaterials: [],
    parts: threedium.parts,
    materials: threedium.materials,
  };

  const store = new Store(initialState);
  const selectedMaterials = selectedMaterials;

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
      const label = document.createElement("label");
      label.htmlFor = name;
      label.innerText = name;

      const input = document.createElement("input");
      input.type = "checkbox";
      input.id = name;
      input.onchange = handlePartInput;

      if (name === selected) {
        input.checked = true;
        input.disabled = true;
      }

      label.appendChild(input);
      container.appendChild(label);
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
      const materialReference = material.slice(
        material.indexOf("["),
        material.indexOf(")") + 1
      );
      const isMaterial = materialReference.startsWith(
        part.slice(0, part.indexOf(")") + 1)
      );
      if (material.match(/{/g)) {
        const isSubMaterial = material.match(/{/g).length > 2;
        return isMaterial && !isSubMaterial;
      }

      return isMaterial;
    });

    filteredMaterials.forEach((material) => {
      const buttton = document.createElement("button");
      buttton.id = material;
      buttton.innerText = material;
      buttton.onclick = ({ target: { id } }) => {
        
        applyMaterials(id)
      };

      partContainer.appendChild(buttton);
    });

    container.appendChild(partContainer);
  };

  const createMaterialContainers = () => {
    const {
      state: { selectedTop, selectedBottom },
    } = store;

    const topSubParts = getSubParts(selectedTop);

    if (!selectedTop.includes("#")) {
      createMaterialsButtons(selectedTop, topMaterialContainer);
    }

    topSubParts.forEach((subPart) => {
      if (!subPart.includes("#")) {
        createMaterialsButtons(subPart, topMaterialContainer);
      }
    });

    const bottomSubParts = getSubParts(selectedBottom);

    if (!selectedBottom.includes("#")) {
      createMaterialsButtons(selectedBottom, bottomMaterialContainer);
    }

    bottomSubParts.forEach((subPart) => {
      if (!subPart.includes("#")) {
        createMaterialsButtons(subPart, bottomMaterialContainer);
      }
    });
  };

  const selectParts = async () => {
    const { selectPart } = threedium;
    const {
      state: { selectedTop, selectedBottom },
    } = store;
    await selectPart(selectedTop);
    await selectPart(selectedBottom);
  };

  store.setStateCallback(async () => {
    clearButtons();
    createPartsButtons();
    createMaterialContainers();
    await selectParts();
  });

  let mannequinDisplayed = true;

  const mannequinBtn = document.getElementById(mannequinBtnId);
  mannequinBtn.addEventListener("click", () => {
    const { showMannequin, hideMannequin } = threedium;
    mannequinDisplayed ? hideMannequin() : showMannequin();
    mannequinDisplayed = !mannequinDisplayed;
  });

  document.getElementById("change1").addEventListener("click", async () => {
    // console.log(threedium.parts);
    // console.log(threedium.materials);
    console.log(store.state);
  });

  // document.getElementById("change1").addEventListener("click", async () => {
  //   console.log(threedium);
  // });
  await store._stateCallback();
}