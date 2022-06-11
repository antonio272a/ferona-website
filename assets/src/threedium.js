class Threedium {
  constructor() {
    this._parts = null;
    this._materials = null;
    this._original_parts = null;
  }

  async init(opt) {
    return new Promise(async (resolve, reject) => {

      await new Promise((res, rej) => {
        Unlimited3D.init(opt, {}, (error, status) => {
          loadingContent.style.display = "none";
          
          if (error || !status) {
            console.log(error);
            rej(error);
            return;
          }
          res();
        });
      });
      
      Unlimited3D.getAvailableParts((e, result) => {
        if (e) {
          console.log(e);
          reject(e)
          return;
        }
        const allowedParts = ['[top]', '[bottom]', '[subpart]'];
        
        const threatedResult = result.map(({ name }) => name.toLowerCase());

        const filteredParts = threatedResult.filter((name) => {
          const isPart = allowedParts.includes(
            name.slice(0, name.indexOf("]") + 1)
          );
          const isNode = allowedParts.includes(
            name.slice(name.indexOf(":") + 1, name.indexOf("]") + 1)
          );
          return (isPart || isNode);
        });
        
        const mappedParts = filteredParts.map((name) => { 
          const isPart = allowedParts.includes(
            name.slice(0, name.indexOf("]") + 1)
          );
          const isNode = allowedParts.includes(
            name.slice(name.indexOf(":") + 1, name.indexOf("]") + 1)
          );

          if(isPart) {
            return name.slice(0, name.indexOf(':'));
          }

          if(isNode) {
            return name.slice(name.indexOf(':') + 1)
          }
        });
        
          this._parts = mappedParts;
          this._original_parts = result.map(({name}) => name);
          
      });
    
      Unlimited3D.getAvailableMaterials((e, result) => {
        if (e) {
          console.log(e);
          reject(e)
          return;
        }
        const mappedMaterials = result.map((material) => material.name);
        this._materials = mappedMaterials;
      });
      resolve();
    });
  }

  selectPart = async (part) => {
    const partType = part.slice(0, part.indexOf(']') + 1);
    let subParts = [];
    
    if (part.indexOf('{') !== -1) {
      subParts = part
        .slice(part.indexOf("{") + 1, part.indexOf("}"))
        .split("-");
    }
    
    const partsToHide = this._original_parts.filter(
      (p) => {
        const nodePart = p.slice(p.indexOf(":") + 1).trim();
        const objectPart = p.trim();
        const actualObj = objectPart.startsWith("[") ? objectPart : nodePart;
        const isPart = actualObj.startsWith(partType)
        const isSubPart = actualObj.startsWith(`[subpart]${partType}`)
        return (isPart || isSubPart);
      }
    );

    await new Promise((resolve, reject) => {
      Unlimited3D.hideParts({
        parts: partsToHide,
      }, (e) => {
        if(e) {
          return reject();
        }
        resolve();
      });

    });

    const partsToShow = this._original_parts.filter((p) => {
      const partId = part.slice(0, part.indexOf(')') + 1);
      
      const nodePart = p.slice(p.indexOf(":") + 1).trim();
      const objectPart = p.trim();
      const actualObj = objectPart.startsWith("[") ? objectPart : nodePart;
      
      const isPart = actualObj.startsWith(part);
      
      const isSubPart = subParts.some(
        (subPart) => actualObj.startsWith(`${partType}(${subPart})`)
      );
      
      const isSubPartOfSubPart = subParts.some(
        (subPart) => actualObj.startsWith(`[subpart]${partType}(${subPart})`)
      );

      const isSubNode = actualObj.startsWith(`[subpart]${partId}`);
      
      return isPart || isSubPart || isSubNode || isSubPartOfSubPart;
    });

    await new Promise((resolve, reject) => {
      Unlimited3D.showParts({
        partObjects: [
          {
            parts: partsToShow
          },
        ],
      }, (e) => {
        if(e) {
          return reject()
        }
        return resolve();
      });
    });
  }

  applyMaterials = (material) => {
    const materialReferenceString = material
      .slice(material.indexOf("|") + 1, material.indexOf(")") + 1)
      .trim();
    
    const materialNumber = material.slice(
      material.indexOf("{") + 1,
      material.indexOf("}")
    ); 
    // console.log(materialNumber)
    const materialParts = this._original_parts.filter((part) => {
      const nodePart = part
        .slice(part.indexOf(":") + 1)
        .trim()
      const objectPart = part.trim();
      const actualObj = objectPart.startsWith("[") ? objectPart : nodePart;
      
      const isPart = actualObj.startsWith(materialReferenceString);
      const isDependent = actualObj.includes(`#${materialReferenceString}`);
      const isSubPart = actualObj.startsWith(`[subpart]${materialReferenceString}`)
      
      return isPart || isDependent || isSubPart;
    });

    const anotherMaterialParts = materialParts.map((part) => {
      const nodePart = part.slice(part.indexOf(":") + 1).trim();
      const objectPart = part.trim();
      const actualObj = objectPart.startsWith('[') ? objectPart : nodePart;
      return actualObj;
    }).filter((part) => {
      const otherMaterialRegex = /\/[0-9]{2}/;
      return otherMaterialRegex.test(part);
    });

    const filteredParts = materialParts.filter((p) => {
      const haveAnotherMaterial = anotherMaterialParts.includes(p);
      if(!haveAnotherMaterial) {
        return true;
      }

      const firstBar = p.indexOf('/');
      const secondBar = p.indexOf('/', firstBar + 1);
      const otherMaterials = p.slice(firstBar + 1, secondBar).split('-');

      const isTheMaterialSelected = otherMaterials.includes(materialNumber);
    
      return !isTheMaterialSelected;
    });
    
    const changeOtherMaterials = () => {
      anotherMaterialParts.forEach((p) => {
        const firstBar = p.indexOf("/");
        const secondBar = p.indexOf("/", firstBar + 1);
        const otherMaterials = p.slice(firstBar + 1, secondBar).split("-");
        const partReference = p.slice(p.indexOf('['), firstBar);
        
        if(otherMaterials.includes(materialNumber)) {
          const otherMaterial = this._materials.find((m) =>
            m.includes(`${partReference}{${materialNumber}}`)
          );
          Unlimited3D.changeMaterial({
            parts: [p],
            material: otherMaterial,
          });
        }
      });  
    } 

    Unlimited3D.changeMaterial(
      {
        parts: filteredParts,
        material,
      },
      (e, _r) => {
        if (e) {
          console.log(e);
          return 
        }
        changeOtherMaterials();
      }
    );
  }

  get parts() {
    return this._parts;
  }

  get materials() {
    return this._materials;
  }

}
