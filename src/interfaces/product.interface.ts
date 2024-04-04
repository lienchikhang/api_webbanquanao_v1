export interface IDefaultWhere {
    is_deleted: boolean,
    product_id: {},
    Product_Size?: {},
    Product_Color?: {},
    Types?: {},
    Categories?: {},
}


export interface IProducts {
    product_id: number,
    product_name: string,
    product_desc: string,
    Prices?: {
        price_num: number
    },
    Images?: {
        img_url: string
    }[],
    Product_Size?: {
        Sizes?: {
            size_id: number,
            size_key: string,
        }
    }[],
    Product_Colors?: {
        color_id: number,
        color: {
            color_hex: string,
            color_name: string,
        }
    }[]
}

export interface IProduct {
    product_id: number,
    product_name: string,
    product_desc: string,
    type?: {
        type_name: string,
    },
    cate?: {
        cate_name: string,
    },
    price?: {
        price_num: number
    },
    Images?: {
        img_url: string
    }[],
    Product_Sizes?: {
        size_id: number,
        size: {
            size_key: string,
        }
    }[],
    Product_Colors?: {
        color_id: number,
        color: {
            color_hex: string,
            color_name: string,
        }
    }[]
}

export interface IFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
}