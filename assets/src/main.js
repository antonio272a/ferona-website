window.onload = async () => {
partImageOnMaterialClassName;

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
        Unlimited3D.enableAutoRotate({
          enable: false,
        });
      }
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
      const partImage = document.createElement('img')
      const button = document.createElement("button");
      
      button.id = name;
      button.addEventListener("click", handlePartInput);
      
      const partRealName = partNamesReference[skuReference[sku].solution3DID][name];
      partImage.src = partImages[partRealName];
      partImage.className = partImageOnPartClassName;
      partImage.id = name

      button.appendChild(partImage)
      if (name === selected) {
        button.disabled = true;
        button.className = selectedPartButtonClassName;
      } else {
        button.className = notSelectedPartButtonClassName;
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
    const partRealName = partNamesReference[skuReference[sku].solution3DID][part];

    partImage.src = partImages[partRealName]
    partImage.className = partImageOnMaterialClassName
    partContainer.appendChild(partImage);

    partContainer.id = part;
    partContainer.className = partMaterialContainerClassName;

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
  
      const materialKey = material.slice(0, material.indexOf("|")).trim().toLowerCase();
      const image = document.createElement('img');
      image.src = materialImages[materialKey];
      if(!materialImages[materialKey]) console.log(material);
      image.style.width = "10px"
      image.id = material
      button.appendChild(image)
    
      
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

  saveButton.addEventListener("click", async () => {
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
        const realNames =
          notSelectedMaterialParts.map((part) => partNamesReference[skuReference[sku].solution3DID][part]);
        notAllMaterialsSelected(realNames);
        return;
      }

      const mappedSelectedPartsWithIndependentMaterials =
        selectedPartsWithIndependentMaterials.map((part) => {
          const { solution3DID: id } = skuReference[sku];

          const material = materialsStore.state[part];
          try {

            return {
              part: partNamesReference[skuReference[sku].solution3DID][part],
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
          part: partNamesReference[skuReference[sku].solution3DID][part],
          material: material.slice(0, material.indexOf("|")).trim(),
        };
      });

    const partsToSave = [
      ...mappedSelectedPartsWithIndependentMaterials,
      ...selectedPartsWithDependentMaterials,
    ];

    await new Promise((resolve, reject) => {
      Unlimited3D.setCameraPosition(
        { position: threedium.default_position },
        (e) => {
          if (e) return reject();
          resolve();
        }
      );
    });

    await new Promise((r) => setTimeout(r, 1000));
    
    Unlimited3D.getSnapshot(snapshotSize, (e, imageUrl) => {
      if(e) return console.log(e);

      onSave(sku, partsToSave, imageUrl)
    });
    
  });
 
  await store._stateCallback();
}