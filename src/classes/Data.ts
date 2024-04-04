import { ICate } from "../interfaces/cate.interface";
import { IColor } from "../interfaces/color.interface";
import { IPrice } from "../interfaces/price.interface";
import { ISize } from "../interfaces/size.interface";
import { IType } from "../interfaces/type.interface";

class Data {
    static convertTypes(types: IType[]) {
        return types.map(type => (
            {
                typeId: type.type_id,
                typeName: type.type_name,
            }
        ))
    }

    static convertType(type: IType) {
        return {
            typeId: type.type_id,
            typeName: type.type_name,
        }
    }

    static convertSizes(sizes: ISize[]) {
        return sizes.map(size => (
            {
                sizeId: size.size_id,
                sizeKey: size.size_key,
            }
        ))
    }

    static convertSize(size: ISize) {
        return {
            sizeId: size.size_id,
            sizeKey: size.size_key,
        }
    }

    static convertCates(cates: ICate[]) {
        return cates.map(cate => (
            {
                cateId: cate.cate_id,
                cateName: cate.cate_name,
            }
        ))
    }

    static convertCate(cate: ICate) {
        return {
            cateId: cate.cate_id,
            cateName: cate.cate_name,
        }
    }

    static convertColors(colors: IColor[]) {
        return colors.map(color => (
            {
                colorId: color.color_id,
                colorName: color.color_name,
                colorHex: color.color_hex,
            }
        ))
    }

    static convertColor(color: IColor) {
        return {
            colorId: color.color_id,
            colorName: color.color_name,
            colorHex: color.color_hex,
        }
    }

    static convertPrices(colors: IPrice[]) {
        return colors.map(color => (
            {
                priceId: color.price_id,
                colorNum: color.price_num,
            }
        ))
    }

    static convertPrice(color: IPrice) {
        return {
            priceId: color.price_id,
            colorNum: color.price_num,
        }
    }
}

export default Data;