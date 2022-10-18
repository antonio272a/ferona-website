window.onload = async () => {
  const params = new URLSearchParams(window.location.search);
  const isBridal = params.get('scb') === 'bridal';


  const partsToShowOptions = ['both', 'top', 'bottom'];
  let partsToShow = 'both';

  const options = {
    distID: 'latest',
    solution3DName: skuReference[sku].solution3DName,
    projectName: 'first-project',
    solution3DID: skuReference[sku].solution3DID,
    containerID: threediumContainerId,

    onLoadingChanged: function (loading) {
      loadingBar.style.width = loading.progress + '%';
    },

    onCameraInteraction: function () {
      Unlimited3D.enableAutoRotate({
        enable: false,
      });
    },
  };

  const threedium = new Threedium();
  await threedium.init(options);
  await threedium.setDefaultMateirals();
  threedium.setCameraControl();

  // add the selectedMaterials keys to the store
  const selectedMaterials = {};
  threedium.parts
    .filter((part) => part.startsWith('[') && !part.includes('#'))
    .forEach((part) => (selectedMaterials[part] = null));

  const initialState = {
    selectedTop:
      threedium.parts.find((part) => part.startsWith('[top](01)')) || '',
    selectedBottom:
      threedium.parts.find((part) => part.startsWith('[bottom](01)')) || '',
    parts: threedium.parts,
    materials: threedium.materials,
  };

  const hasSkirt = threedium.parts.find((p) => {
    const subpartBottomRegex = /^\[subpart\]\[bottom\]/;
    const dependsFromTopRegex = /#\[top\]/;
    const isBottomSubpart = subpartBottomRegex.test(p);
    const dependsFromTop = dependsFromTopRegex.test(p);
    return isBottomSubpart && dependsFromTop;
  });

  if (isBridal) {
    const offWhiteMaterialRegex = /off white/i;
    const offWhiteTopMaterial = threedium._materials.find(
      (material) =>
        offWhiteMaterialRegex.test(material) && material.includes('[top](01)')
    );
    const offWhiteBottomMaterial = threedium._materials.find(
      (material) =>
        offWhiteMaterialRegex.test(material) &&
        material.includes('[bottom](01)')
    );
    if (offWhiteTopMaterial && offWhiteBottomMaterial) {
      selectedMaterials[initialState.selectedTop] = offWhiteTopMaterial;
      selectedMaterials[initialState.selectedBottom] = offWhiteBottomMaterial;
    }
  }

  const store = new Store(initialState);
  const materialsStore = new Store(selectedMaterials);

  const topPartContainer = document.getElementById(topPartContainerId);
  const bottomPartContainer = document.getElementById(bottomPartContainerId);
  const topMaterialContainer = document.getElementById(topMaterialContainerId);
  const bottomMaterialContainer = document.getElementById(
    bottomMaterialContainerId
  );

  const clearButtons = () => {
    topPartContainer.innerHTML = '';
    bottomPartContainer.innerHTML = '';
    topMaterialContainer.innerHTML = '';
    bottomMaterialContainer.innerHTML = '';
  };

  const handlePartInput = ({ target: { id } }) => {
    const partType = id.slice(id.indexOf('[') + 1, id.indexOf(']'));
    const capitalizedPartType = partType.replace(/^\w/, (c) => c.toUpperCase());
    store.setState({ [`selected${capitalizedPartType}`]: id });
  };

  const genericCreatePartsButtons = (parts, container, selected,) => {
    parts.forEach((name) => {
      const partImage = document.createElement('img');
      const button = document.createElement('button');

      button.id = name;
      button.addEventListener('click', handlePartInput);

      const partRealName =
        partNamesReference[skuReference[sku].solution3DID][name];
      partImage.src = partImages[partRealName];
      partImage.className = partImageOnPartClassName;
      partImage.id = name;

      button.appendChild(partImage);
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
    const topParts = parts.filter((part) => part.startsWith('[top]'));
    const bottomParts = parts.filter((part) => part.startsWith('[bottom]'));
    if(partsToShow === 'both' || partsToShow === 'top') {
      genericCreatePartsButtons(topParts, topPartContainer, selectedTop);
    }
    if(partsToShow === 'both' || partsToShow === 'bottom') {
      genericCreatePartsButtons(bottomParts, bottomPartContainer, selectedBottom);
    }
  };

  const getSubParts = (selectedPart) => {
    const {
      state: { parts },
    } = store;
    const partType = selectedPart.slice(0, selectedPart.indexOf(']') + 1);
    const partNumber = selectedPart.slice(
      selectedPart.indexOf('('),
      selectedPart.indexOf(')') + 1
    );

    subPartsIndex = selectedPart
      .slice(selectedPart.indexOf('{') + 1, selectedPart.indexOf('}'))
      .split('-');

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
    const reference = material
      .slice(material.indexOf('|') + 1, material.indexOf('{'))
      .trim();
    const possibleButtons = threedium.materials.filter((mat) => {
      const matReference = mat.slice(mat.indexOf('|') + 1).trim();
      return matReference.startsWith(reference);
    });
    possibleButtons.forEach((possibleButton) => {
      const button = document.getElementById(possibleButton);
      if (button) button.disabled = disabled;
    });
  };

  const createMaterialsButtons = (part, container, hasImage = true) => {
    const {
      state: { materials },
    } = store;
    const partContainer = document.createElement('div');
    const materialSubContainer = document.createElement('div');
    const partImage = document.createElement('img');

    materialSubContainer.className = materialSubContainerClassName;
    const partRealName =
      partNamesReference[skuReference[sku].solution3DID][part];

    partImage.src = partImagesForMaterials[partRealName];
    partImage.className = partImageOnMaterialClassName;
    if(hasImage) {
      partContainer.appendChild(partImage);
    }

    partContainer.id = part;
    partContainer.className = partMaterialContainerClassName;

    const filteredMaterials = materials.filter((material) => {
      const subMaterialPlus = material.includes('[subpart]') ? 4 : 0;
      const materialReference = material.slice(
        material.indexOf('['),
        material.indexOf(')') + 1 + subMaterialPlus
      );
      const isMaterial = materialReference.startsWith(
        part.slice(0, part.indexOf(')') + 1 + subMaterialPlus)
      );
      if (material.match(/{/g)) {
        const isSubMaterial = material.match(/{/g).length > 2;
        return isMaterial && !isSubMaterial;
      }

      return isMaterial;
    });

    filteredMaterials.forEach((material) => {
      const isSubPart = material.includes('[subpart]');
      const firstIndex = material.indexOf('[');
      const lastIndex = isSubPart
        ? material.indexOf('}') + 1
        : material.indexOf(')') + 1;
      const partReference = material.slice(firstIndex, lastIndex);
      const part = threedium.parts.find((p) => p.startsWith(partReference));
      const isSelected = materialsStore.state[part] === material;

      const button = document.createElement('button');

      const materialKey = material
        .slice(0, material.indexOf('|'))
        .trim()
        .toLowerCase();
      const image = document.createElement('img');
      image.src = materialImages[materialKey];
      if (!materialImages[materialKey]) console.log(material);
      image.id = material;
      button.appendChild(image);

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
      };

      materialSubContainer.appendChild(button);
    });
    partContainer.appendChild(materialSubContainer);
    container.appendChild(partContainer);
  };

  const createMaterialContainers = () => {
    const {
      state: { selectedTop, selectedBottom },
    } = store;

    const hasImage = !(partsToShow === 'bottom' && hasSkirt)
    const skirtHashtagIndex = hasSkirt ? hasSkirt.indexOf('#') : 0
    const skirtRef = hasSkirt ? hasSkirt.slice(skirtHashtagIndex + 1, hasSkirt.indexOf(')', skirtHashtagIndex) + 1) : '';

    if (selectedTop && (partsToShow === 'both' || partsToShow === 'top' || hasSkirt)) {
      const topSubParts = getSubParts(selectedTop);

      if(partsToShow === 'bottom' && hasSkirt) {
        const top = threedium.parts.find((p) => p.startsWith(skirtRef));
        createMaterialsButtons(top, topMaterialContainer, hasImage)
      } else {

        if (!selectedTop.includes('#')) {
          createMaterialsButtons(selectedTop, topMaterialContainer);
        }
        
        topSubParts.forEach((subPart) => {
          if (!subPart.includes('#')) {
            createMaterialsButtons(subPart, topMaterialContainer);
          }
        });
        
      }

    }

    if (selectedBottom && (partsToShow === 'both' || partsToShow === 'bottom')) {
      const bottomSubParts = getSubParts(selectedBottom);

      if (!selectedBottom.includes('#')) {
        createMaterialsButtons(selectedBottom, bottomMaterialContainer);
      }

      bottomSubParts.forEach((subPart) => {
        if (!subPart.includes('#')) {
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
    await threedium.hideAllParts();
    
    if (selectedTop && (partsToShow === 'both' || partsToShow === 'top')) await selectPart(selectedTop);

    if (selectedBottom &&  (partsToShow === 'both' || partsToShow === 'bottom')) await selectPart(selectedBottom);
  };

  store.setStateCallback(async () => {
    clearButtons();
    createPartsButtons();
    createMaterialContainers();
    await selectParts();
  });

  materialsStore.setStateCallback(() => {
    const { applyMaterials } = threedium;
    const keys = Object.keys(materialsStore.state);
    keys.forEach(async (key) => {
      const material = materialsStore.state[key];
      if (material) {
        toggleDisabledMaterialButtons(material, true);
        await applyMaterials(material);
        toggleDisabledMaterialButtons(material, false);
      }
    });
    clearButtons();
    createPartsButtons();
    createMaterialContainers();
  });

  let mannequinDisplayed = true;

  const mannequinBtn = document.getElementById(mannequinBtnId);
  mannequinBtn.addEventListener('click', () => {
    const { showMannequin, hideMannequin } = threedium;
    mannequinDisplayed ? hideMannequin() : showMannequin();
    mannequinDisplayed = !mannequinDisplayed;
  });

  const saveButton = document.getElementById(saveButtonId);

  saveButton.addEventListener('click', async () => {
    const {
      state: { selectedTop, selectedBottom },
    } = store;

    const selectedTopReference =
      selectedTop.indexOf('{') > 0
        ? selectedTop.slice(0, selectedTop.indexOf('{'))
        : selectedTop;

    const selectedBottomReference =
      selectedBottom.indexOf('{') > 0
        ? selectedBottom.slice(0, selectedBottom.indexOf('{'))
        : selectedBottom;

    const selectedPartsWithIndependentMaterials = threedium.parts.filter(
      (part) => {
        const isPart = part === selectedTop || part === selectedBottom;
        const isSubNode =
          part.startsWith(`[subpart]${selectedTopReference}`) ||
          part.startsWith(`[subpart]${selectedBottomReference}`);
        const hasIndependentColor = !part.includes('#');
        selectedBottom.slice(
          selectedBottom.indexOf('{') + 1,
          selectedBottom.indexOf('}')
        );
        let isBottomSubPart = false;
        let isTopSubPart = false;

        if (selectedBottom.indexOf('{') > 0) {
          part.startsWith(
            `[bottom](${selectedBottom.slice(
              selectedBottom.indexOf('{') + 1,
              selectedBottom.indexOf('}')
            )})`
          );
        }

        if (selectedTop.indexOf('{') > 0) {
          isTopSubPart = part.startsWith(
            `[top](${selectedTop.slice(
              selectedTop.indexOf('{') + 1,
              selectedTop.indexOf('}')
            )})`
          );
        }

        return (
          (isPart || isBottomSubPart || isTopSubPart || isSubNode) &&
          hasIndependentColor
        );
      }
    ).filter((part) => {
      const topRegex = /^\[top\]/;
      const subpartTopRegex = /^\[subpart\]\[top\]/;
      const bottomRegex = /^\[bottom\]/;
      const subpartBottomRegex = /^\[subpart\]\[bottom\]/;
      if(partsToShow === 'both') return true;
      if(partsToShow === 'top') return (topRegex.test(part) || subpartTopRegex.test(part))
      if(partsToShow === 'bottom') return (bottomRegex.test(part) || subpartBottomRegex.test(part))
    });

    const allColorsSelected = selectedPartsWithIndependentMaterials.every(
      (part) => materialsStore.state[part] !== null
    );

    if (!allColorsSelected) {
      const notSelectedMaterialParts =
        selectedPartsWithIndependentMaterials.filter(
          (part) => materialsStore.state[part] === null
        );
      const realNames = notSelectedMaterialParts.map(
        (part) => partNamesReference[skuReference[sku].solution3DID][part]
      );
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
            material:
              material.slice(0, material.indexOf('|')).trim().toLowerCase() ||
              '',
          };
        } catch (error) {
          return part;
        }
      })

    const selectedPartsWithDependentMaterials = threedium.parts
      .filter((part) => {
        const hasTag = part.includes('#') && part.includes('$');
        if (!hasTag) return false;

        const dependentFromReference = part.slice(
          part.indexOf('#') + 1,
          part.indexOf('$')
        );

        const isPart = selectedTop === part || selectedBottom === part;

        const isDependent =
          selectedTop.startsWith(dependentFromReference) ||
          selectedBottom.startsWith(dependentFromReference);

        const isSubPart =
          part.startsWith(
            `[subpart]${selectedTop.slice(
              selectedTop.indexOf('['),
              selectedTop.indexOf(')') + 1
            )}`
          ) ||
          part.startsWith(
            `[subpart]${selectedBottom.slice(
              selectedBottom.indexOf('['),
              selectedBottom.indexOf(')') + 1
            )}`
          );

        const topSubPartNumber = selectedTop.slice(
          selectedTop.indexOf('{') + 1,
          selectedTop.indexOf('}')
        );
        const bottomSubPartNumber = selectedBottom.slice(
          selectedBottom.indexOf('{') + 1,
          selectedBottom.indexOf('}')
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
      }).filter((part) => {
        const topRegex = /^\[top\]/;
        const subpartTopRegex = /^\[subpart\]\[top\]/;
        const bottomRegex = /^\[bottom\]/;
        const subpartBottomRegex = /^\[subpart\]\[bottom\]/;
        if(partsToShow === 'both') return true;
        if(partsToShow === 'top') return (topRegex.test(part) || subpartTopRegex.test(part))
        if(partsToShow === 'bottom') return (bottomRegex.test(part) || subpartBottomRegex.test(part))
      })
      .map((part) => {
        const reference = part.slice(part.indexOf('#') + 1, part.indexOf('$'));
        const dependentFromPart = threedium.parts.find((p) =>
          p.startsWith(reference)
        );
        const material = materialsStore.state[dependentFromPart];

        return {
          part: partNamesReference[skuReference[sku].solution3DID][part],
          material: material
            .slice(0, material.indexOf('|'))
            .trim()
            .toLowerCase(),
        };
      });

    const partsToSave = [
      ...mappedSelectedPartsWithIndependentMaterials,
      ...selectedPartsWithDependentMaterials,
    ];
    console.log(partsToSave);
    await new Promise((resolve, reject) => {
      Unlimited3D.setCameraPosition(
        { position: threedium.default_position },
        (e) => {
          if (e) return reject();
          resolve();
        }
      );
    });
    threedium.showMannequin();
    await new Promise((r) => setTimeout(r, 1000));

    Unlimited3D.getSnapshot(
      { ...snapshotSize, result: snapshotType },
      (e, imageUrl) => {
        if (e) return console.log(e);

        onSave(sku, partsToSave, imageUrl);
      }
    );
  });

  await store._stateCallback();
  await materialsStore._stateCallback();

  const topButton = document.getElementById('top-btn');
  const bothButton = document.getElementById('both-btn');
  const bottomButton = document.getElementById('bottom-btn');
  topButton.addEventListener('click', () => {
    partsToShow = 'top';
    store._stateCallback();
  })
  bottomButton.addEventListener('click', () => {
    partsToShow = 'bottom';
    store._stateCallback();
  })
  bothButton.addEventListener('click', () => {
    partsToShow = 'both';
    store._stateCallback();
  })

  const arButton = document.getElementById('ar-button');
  if (checkAr() == 'android') {
    arButton.setAttribute('rel', 'ar');
    arButton.setAttribute(
      'href',
      'intent://arvr.google.com/scene-viewer/1.0?file=.glb#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;S.browser_fallback_url=%23;end;'
    );

    arButton.addEventListener('click', arMobile);
  } else if (checkAr() == 'ios' || checkAr() == 'ipad') {
    arButton.setAttribute('rel', 'ar');
    arButton.setAttribute('href', '.usdz');

    arButton.addEventListener('click', arMobile);
  } else {
    arButton.addEventListener('click', function () {
      if (document.querySelector('.QRcode').style.display == 'flex')
        document.querySelector('.QRcode').style.display = 'none';
      else document.querySelector('.QRcode').style.display = 'flex';
    });
    document
      .getElementById('closeQRcode')
      .addEventListener('click', function () {
        document.querySelector('.QRcode').style.display = 'none';
        // analitika ovde
      });

    arButton.addEventListener('click', arMobile);
  }

  function arMobile() {
    // gtag('event', 'Interact', {
    //     'event_category': 'Click',
    //     'event_label': "ime",
    //     'value': 'AR Icon Click',
    // });
  }
};
