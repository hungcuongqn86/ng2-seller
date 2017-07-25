export class Ds {
    static _getMainOpt(type, face, arrBaseTypes, campaign) {
        let res = {status: false, minX: 0, minY: 0, maxX: 0, maxY: 0};
        const typeGroup = Ds.getBaseGroup(arrBaseTypes, type);
        for (let index = 0; index < campaign.products.length; index++) {
            const typeGroupIndex = Ds.getBaseGroup(arrBaseTypes, campaign.products[index].base.type.id);
            const check = campaign.products[index].designs.findIndex(x => ((x.main === true) && (typeGroupIndex === typeGroup)));
            if (check >= 0) {
                res = Ds.getOpt(face, campaign.products[index]);
                res.status = true;
                return res;
            }
        }
        return res;
    }

    static getOpt(face, product) {
        const leftkey = face + '_left', topkey = face + '_top', widthkey = face + '_width',
            heightkey = face + '_height';
        const res = {status: false, minX: 0, minY: 0, maxX: 0, maxY: 0};
        res.minX = Number(product.base.printable[leftkey]);
        res.minY = Number(product.base.printable[topkey]);
        res.maxX = Number(product.base.printable[leftkey]) +
            Number(product.base.printable[widthkey]);
        res.maxY = Number(product.base.printable[topkey]) +
            Number(product.base.printable[heightkey]);
        res.status = true;
        return res;
    }

    static getBaseGroup(arrBaseTypes, baseType): string {
        for (let index = 0; index < arrBaseTypes.length; index++) {
            const check = arrBaseTypes[index].base_types.findIndex(x => x.id === baseType);
            if (check >= 0) {
                return arrBaseTypes[index].id;
            }
        }
        return '';
    }

    static getFace(campaign): any {
        const check = campaign.products.findIndex(x => x.default === true);
        if (check >= 0) {
            if (campaign.products[check].back_view) {
                return 'back';
            }
        }
        return 'front';
    }

    constructor() {
    }
}
