import { ICartDetail } from "../interfaces/cart.interface";
import { ICate } from "../interfaces/cate.interface";
import { IColor } from "../interfaces/color.interface";
import { IPrice } from "../interfaces/price.interface";
import { IProduct, IProducts } from "../interfaces/product.interface";
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

    static convertProduct = (product: IProduct) => {
        return {
            product_id: product.product_id,
            product_name: product.product_name,
            product_desc: product.product_desc,
            type: product.Types ? product.Types.type_name : null,
            cate: product.Categories ? product.Categories.cate_name : null,
            price: product.Prices ? product.Prices.price_num : null,
            images: product.Images ? product.Images.map(image => image.img_url) : [],
            sizes: product.Product_Size ? product.Product_Size.map(size => ({
                size_id: size.size_id,
                size_key: size.Sizes ? size.Sizes.size_key : null
            })) : [],
            colors: product.Product_Color ? product.Product_Color.map(color => ({
                color_id: color.color_id,
                color_hex: color.Colors ? color.Colors.color_hex : null,
                color_name: color.Colors ? color.Colors.color_name : null
            })) : []
        };
    }

    static convertProducts = (products: IProducts[]) => {
        return products.map((product) => (
            {
                id: product.product_id,
                name: product.product_name,
                desc: product.product_desc,
                price: product.Prices ? product.Prices.price_num : null,
                images: product.Images ? product.Images.map((image) => image.img_url) : [],
            }
        ))
    }

    static convertCartDetail = (cartDetail: ICartDetail) => {
        return {
            cartId: cartDetail.cart_id,
            productId: cartDetail.product_id,
            amount: cartDetail.amount,
            price: cartDetail.price
        }
    }
}

export default Data;