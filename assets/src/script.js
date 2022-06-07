
let flagInterract = true;

const baseOptions1 = {
  distID: "latest",
  solution3DName: "PA001 TA",
  projectName: "first-project",
  solution3DID: "42134",
  containerID: "container3d_replace",
};

const baseOptions2 = {
  distID: "latest",
  solution3DName: "Pants - Example",
  projectName: "first-project",
  solution3DID: "42152",
  containerID: "container3d_replace",
};

const options = {
  ...baseOptions1,

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



window.onload = async () => {
  const threedium = new Threedium();
  await threedium.init(options);

  const initialState = {
    selectedTop: threedium.parts.find((part) =>
      part.startsWith("[top](01)")
    ),
    selectedBottom: threedium.parts.find((part) =>
      part.startsWith("[bottom](01)")
    ),
    selectedTopMaterial: null,
    selectedBottomMaterial: null,
    parts: threedium.parts,
    materials: threedium.materials,
    blockedMaterials: [],
  };
  
  const store = new Store(initialState);
  
  const topPartContainer = document.getElementById('top-part-container');
  const bottomPartContainer = document.getElementById('bottom-part-container');
  const topMaterialContainer = document.getElementById('top-material-container');
  const bottomMaterialContainer = document.getElementById('bottom-material-container');

  const clearButtons = () => {
    topPartContainer.innerHTML = '';
    bottomPartContainer.innerHTML = '';
    topMaterialContainer.innerHTML = '';
    bottomMaterialContainer.innerHTML = '';
  }

  const handlePartInput = ({ id }) => {
    const partType = id.slice(0, id.indexOf(']') + 1);
    const capitalizedPartType = partType.replace(/^\w/, (c) => c.toUpperCase());
    store.setState({[ `selected${capitalizedPartType}`]: id })
    
  }

  const createPartsButtons = () => {
    const { state: { parts, selectedTop, selectedBottom } } = store;
    const topParts = parts.filter((part) => part.startsWith('[top]'));
    const bottomParts = parts.filter((part) => part.startsWith('[bottom]'));
    
    topParts.forEach(({ name }) => {
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.id = name;
      input.onchange = handlePartInput;
      if (name === selectedTop) {
        input.checked = true;
        input.disabled = true;
      }
      topPartContainer.appendChild(input);
    });
    
    bottomParts.forEach(({ name }) => {
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.id = name;
      input.onchange = handlePartInput;
      if (name === selectedBottom) {
        input.checked = true;
        input.disabled = true;
      }
      bottomPartContainer.appendChild(input);
    });
  
  }

  const createMaterialsButtons = () => {
    const { state: { materials, selectedTop, selectedBottom } } = store;
    
    const topMaterials = materials.filter(
      (material) => material.startsWith(selectedTop.slice(0, selectedTop.indexOf(')') + 1))
    );
    
    const bottomMaterials = materials.filter(
      (material) => material.startsWith(selectedBottom.slice(0, selectedBottom.indexOf(')') + 1))
    );
    
    
    
  }

  store.setStateCallback(() => {
    clearButtons();
    createPartsButtons();
  });

  document.getElementById("change2").addEventListener("click", () => {
    console.log(threedium.parts);
    console.log(threedium.materials);

  });

  // document.getElementById("change1").addEventListener("click", async () => {
  //   console.log(threedium);
  // });
}



document.getElementById("change1").addEventListener("click", async () => {
  // Unlimited3D.changeMaterialMap(
  //   { material: "Material01", texture: "Texture01", mapType: "diffuseMap" },
  //   () => {}
  // );
  
  // Unlimited3D.changeMaterial(
  //   {
  //     parts: ["TA003 Yellow Fireworks Black and Black:Node-3"],
  //     material: "TA Black Fireworks",
  //   },
  //   (e, r) => {
  //     console.log(e, r);
  //   }
  // );

  // Unlimited3D.getAvailableAnnotations(function (error, result) {
  //   console.log(result);
  // });

  // Unlimited3D.getAvailableMaterials(function (error, result) {
  //   console.log(result);
  // });

  // Unlimited3D.getAvailableTextures(function (error, result) {
  //   console.log(result);
  // });

  // Unlimited3D.getMaterial({ part: "Top 01 Example" }, function (e, r) {
  //   console.log(e, r);
  // });

  // Unlimited3D.getAvailableParts(function (error, result) {
  //   console.log(result);
  // });

  // Unlimited3D.hideParts({
  //   parts: ['TA003 Yellow Fireworks Black and Black']
  // })

  // Unlimited3D.getAvailableMaterials((e, r) => {
  //   console.log(e, 'materiais', r);
  // });

  // Unlimited3D.getMaterial(
  //   {
  //     part: "TA003 Yellow Fireworks Black and Black:Node-3",
  //   },
  //   function (e, r) {
  //     console.log(e, r);
  //   }
  // );
  
  // Unlimited3D.applyMaterialToAllParts({ material: "Yellow Fireworks" }, (e) => {
  //   if (e) console.log(e);
  // });
  // Unlimited3D.getAvailableTextures((e, r) => {
  //   console.log('texturas', e, r);
  // });
  // Unlimited3D.changeMaterialColor({
  //   material: "initialShadingGroup-1",
  //   color: "#ff0000",
  // });
});



// manequin initialShadingGroup-1
// top 01 initialShadingGroup-2
// top 02 initialShadingGroup-3
// top 03 initialShadingGroup-4

//[top]{top01}




// Unlimited3D.init(options);

//  do not change code below
// if (checkAr() == 'android') {
//     arButton.setAttribute("rel", "ar");
//     arButton.setAttribute(
//         "href",
//         "intent://arvr.google.com/scene-viewer/1.0?file=.glb#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;S.browser_fallback_url=%23;end;",
//     );
    
//     arButton.addEventListener("click", arMobile )

// } else if (checkAr() == "ios" || checkAr() == 'ipad') {
//     arButton.setAttribute("rel", "ar");
//     arButton.setAttribute(
//         "href",
//         ".usdz"
//     ); 

//     arButton.addEventListener("click", arMobile )
    
// }else{
//     arButton.addEventListener("click", function() {
        
//         if (document.querySelector('.QRcode').style.display == 'flex')
//             document.querySelector('.QRcode').style.display = 'none'
//         else
//             document.querySelector('.QRcode').style.display = 'flex'
//     });
//     document.getElementById("closeQRcode").addEventListener("click", function() {
//         document.querySelector('.QRcode').style.display = 'none'
//         // analitika ovde 
//     });

//     arButton.addEventListener("click", arMobile);
// };

function arMobile() {
    // gtag('event', 'Interact', {
    //     'event_category': 'Click',
    //     'event_label': "ime",
    //     'value': 'AR Icon Click',
    // });
};