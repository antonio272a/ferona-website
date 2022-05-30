class Threedium {
  constructor() {
    let parts;
    Unlimited3D.getAvailableParts(function (e, result) {
      if(e) {
        console.log(e)
        return
      }
      parts = result;
    });
    //
    let materials;
    Unlimited3D.getAvailableMaterials((e, result) => {
      if (e) {
        console.log(e);
        return;
      }
      materials = result;
    });
    //
    this._materials = materials;
    this._parts = parts;
  }

  getPartsMaterials = (part, blockedMaterials = []) => {
    const filteredMaterials = this._materials.filter((material) => {
      const partName = part.slice(0, part.indexOf(")") + 1);
      return material.name.startsWith(partName) && !blockedMaterials.includes(material.name);
    });

    return filteredMaterials;
  }

  get parts() {
    return this._parts;
  }

  get materials() {
    return this._materials;
  }

}