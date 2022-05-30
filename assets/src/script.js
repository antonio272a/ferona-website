
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
  Unlimited3D.init(options, {}, function (error, status) {
    loadingContent.style.display = "none";

    if (error || !status) {
      console.log(error);

      return;
    }
  });

  const threedium = new Threedium();
  const store = new Store({
    selectedTop: threedium.parts.find((part) =>
      part.name.startsWith("[top](01)")
    ),
    selectedBottom: threedium.parts.find((part) =>
      part.name.startsWith("[bottom](01)")
    ),
    materials: threedium,
    blockedMaterials: [],
  });

  
}

document.getElementById("change2").addEventListener("click", () => {});


document.getElementById("change1").addEventListener("click", async () => {
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

  Unlimited3D.getAvailableParts(function (error, result) {
    console.log(result);
  });

  // Unlimited3D.hideParts({
  //   parts: ['TA003 Yellow Fireworks Black and Black']
  // })

  // Unlimited3D.getAvailableMaterials((e, r) => {
  //   console.log(e, r);
  // });

  // Unlimited3D.getMaterial(
  //   {
  //     part: "TA003 Yellow Fireworks Black and Black:Node-3",
  //   },
  //   function (e, r) {
  //     console.log(e, r);
  //   }
  // );
  
  // Unlimited3D.applyMaterialToAllParts(
  //   { material: "TA Lime Royal" },
  //   (e) => {
  //     if (e) console.log(e);
  //   }
  // );
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