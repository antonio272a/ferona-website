class Threedium {
  constructor() {
    this._parts = null;
    this._materials = null;
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

  selectPart(part) {
    const partType = part.slice(0, part.indexOf(']') + 1);
    let subParts = [];
    
    if (part.indexOf('{') !== -1) {
      subParts = part
        .slice(part.indexOf("{") + 1, part.indexOf("}"))
        .split("-");
    }
    
    Unlimited3D.hideParts({ 
      parts: this._parts.filter(
        (p) => {
          const isPart = p.startsWith(partType);
          const isSubPart = p.startsWith(`[subpart]${partType}`);
          return (isPart || isSubPart);
        }) 
    });

    Unlimited3D.showParts({ 
      parts: this._parts.filter((p) => {
        const partId = part.slice(0, part.indexOf(')') + 1);
        const isPart = p === part;
        const isSubPart = subParts.some((subPart) => p.startsWith(`${partType}(${subPart})`));
        const isSubNode = p.startsWith(`[subpart]${partId}`);
        return (isPart || isSubPart || isSubNode);
      })
    });
  }

  applyMaterials(material) {
    const MaterialParts = this._parts.filter((part) => {
      const materialReferenceString = material.slice(0, material.indexOf(')') + 1);
      
      const isPart = part.startsWith(materialReferenceString);
      const isDependent = part.includes(`#${materialReferenceString}`);
      const isSubPart = part.startsWith(`[subpart]${materialReferenceString}`);
      
      return (isPart || isDependent || isSubPart);
    });
    Unlimited3D.changeMaterial(
      {
        parts: MaterialParts,
        material,
      },
      (e, _r) => {
        if(e) {
          console.log(e);
        }
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
