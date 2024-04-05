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
    Types?: {
        type_name: string,
    },
    Categories?: {
        cate_name: string,
    },
    Prices?: {
        price_num: number
    },
    Images?: {
        img_url: string
    }[],
    Product_Size?: {
        size_id: number,
        Sizes: {
            size_key: string,
        }
    }[],
    Product_Color?: {
        color_id: number,
        Colors: {
            color_name: string,
            color_hex: string,
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