
window.onload = async () => {

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
  threedium.setCameraControl();


  
  const getAvailableMaterialsForPart = (part) => {
    const { materials } = threedium;

    const partRealName =
      partNamesReference[skuReference[sku].solution3DID][part];
    console.log(partRealName);
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
  }

  document.getElementById('test-btn').addEventListener('click', () => {
    getAvailableMaterialsForPart('[bottom](01)');
  });

}