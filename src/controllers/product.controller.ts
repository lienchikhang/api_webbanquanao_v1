import { Request, Response, text } from "express";
import Prisma from "../classes/Prisma";
import ResponseCreator from "../classes/ResponseCreator";
import { Error, Logger } from "../classes/Logger";
import Data from "../classes/Data";
import { NumberChecker, ObjectChecker, TextChecker } from "../classes/Checker";
import { IDefaultWhere, IFile, IProduct, IProducts } from "../interfaces/product.interface";
import FileConcreteReader from "../classes/FileReader";
import path from 'path';

const model = Prisma.getInstance().create();
const textChecker = new TextChecker();
const numberChecker = new NumberChecker();
const objectChecker = new ObjectChecker();

//::role::client && admin
const getProducts = async (req: Request, res: Response) => {
    try {
        let { pageSize = 5, lastRecord = 0, size, color, type, cate } = req.query;

        //check lastRecord is number
        if (!numberChecker.isNumber(lastRecord)) return ResponseCreator.create(400, 'Invalid next record', lastRecord).send(res);

        //check size is a string and doesnt have special char
        if (textChecker.hasSpace(size as string) || textChecker.hasSpecialChar(size as string)) return ResponseCreator.create(400, 'Invalid size', size).send(res);

        //check color
        if (textChecker.hasSpace(color as string) || textChecker.hasSpecialChar(color as string)) return ResponseCreator.create(400, 'Invalid color', color).send(res);

        //check type
        if (textChecker.hasSpace(type as string) || textChecker.hasSpecialChar(type as string)) return ResponseCreator.create(400, 'Invalid type', type).send(res);

        //check cate
        if (textChecker.hasSpace(cate as string) || textChecker.hasSpecialChar(cate as string)) return ResponseCreator.create(400, 'Invalid cate', cate).send(res);

        lastRecord = parseInt(lastRecord as string);
        pageSize = parseInt(pageSize as string);

        //:::SEQUELIZE

        // //base mapping
        // const includes = [{
        //     model: model.Prices,
        //     attributes: ['price_num'],
        //     as: 'price'
        // }, {
        //     model: model.Images,
        //     attributes: ['img_url'],
        //     as: 'Images'
        // }] as Array<IIncludeCondition>;

        // //if has size condition => add to base mapping
        // if (size) {
        //     includes.push({
        //         model: model.Sizes,
        //         attributes: ['size_key'],
        //         as: 'size_id_Sizes',
        //         where: {
        //             size_key: size.toString().toUpperCase()
        //         }
        //     })
        // }

        // //if has color condition => add to base mapping
        // if (color) {
        //     includes.push({
        //         model: model.Colors,
        //         attributes: ['color_name'],
        //         as: 'color_id_Colors',
        //         where: {
        //             color_name: color.toString().toUpperCase()
        //         }
        //     })
        // }

        // products = await model.Products.findAll({
        //     attributes: ['product_id', 'product_name', 'product_desc'],
        //     include: includes,
        //     where: {
        //         [Op.and]: [
        //             { is_deleted: 0 },
        //             {
        //                 product_id: {
        //                     [Op.gt]: lastRecord
        //                 }
        //             },
        //         ]
        //     },
        //     limit: pageSize,
        // });


        //::: PRISMA
        let defaultWhere: IDefaultWhere = {
            is_deleted: false,
            product_id: {
                gt: lastRecord,
            }
        }

        if (size) {
            defaultWhere = {
                ...defaultWhere,
                Product_Size: {
                    some: {
                        Sizes: {
                            is: {
                                size_key: {
                                    equals: size.toString().toUpperCase()
                                }
                            }
                        }
                    }
                }
            }
        }

        if (color) {
            defaultWhere = {
                ...defaultWhere,
                Product_Color: {
                    some: {
                        Colors: {
                            is: {
                                color_name: {
                                    equals: color.toString().toUpperCase()
                                }
                            }
                        }
                    }
                }
            }
        }

        if (type) {
            defaultWhere = {
                ...defaultWhere,
                Types: {
                    is: {
                        type_name: {
                            equals: type,
                        }
                    }
                }
            }
        }

        if (cate) {
            defaultWhere = {
                ...defaultWhere,
                Categories: {
                    is: {
                        cate_name: {
                            equals: cate,
                        }
                    }
                }
            }
        }

        let products = await model.products.findMany({
            select: {
                product_id: true,
                product_name: true,
                product_desc: true,
                Prices: {
                    select: {
                        price_num: true,
                    }
                },
                Images: {
                    select: {
                        img_url: true
                    },
                    take: 2,
                },
            },
            where: defaultWhere,
            take: pageSize,
        });

        //convert Product 
        let finalProducts = Data.convertProducts(products);

        return ResponseCreator.create(200, 'Successfully!', { productList: finalProducts, lastRecord: finalProducts[finalProducts.length - 1]?.id }).send(res);

    } catch (error) {
        console.log('err:: ', error);
        const logger = new Logger(new Error(new Date().getTime().toString(), __filename));
        logger.write();
        return ResponseCreator.create(500).send(res);
    }
}

//::role::client && admin
const getProductById = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;

        if (!productId) return ResponseCreator.create(400, 'Invalid productId!', productId).send(res);

        if (!numberChecker.isNumber(productId) || textChecker.hasSpace(productId) || textChecker.hasSpecialChar(productId)) return ResponseCreator.create(400, 'Invalid productId!', productId).send(res);

        let product = await model.products.findUnique({
            where: {
                product_id: parseInt(productId),
            },
            select: {
                product_id: true,
                product_name: true,
                product_desc: true,
                Types: {
                    select: {
                        type_name: true,
                    }
                },
                Categories: {
                    select: {
                        cate_name: true,
                    }
                },
                Prices: {
                    select: {
                        price_num: true,
                    }
                },
                Images: {
                    select: {
                        img_url: true,
                    }
                },
                Product_Size: {
                    select: {
                        size_id: true,
                        Sizes: {
                            select: {
                                size_key: true,
                            }
                        }
                    }
                },
                Product_Color: {
                    select: {
                        color_id: true,
                        Colors: {
                            select: {
                                color_name: true,
                                color_hex: true,
                            }
                        }
                    }
                }
            },
        });

        if (!product) return ResponseCreator.create(404, 'Product not found', productId).send(res);

        let finalProduct = Data.convertProduct(product);

        return ResponseCreator.create(200, 'Successfully!', finalProduct).send(res);
    } catch (error) {
        console.log('err:: ', error)
        const logger = new Logger(new Error(new Date().getTime().toString(), __filename));
        logger.write();
        return ResponseCreator.create(500).send(res);
    }
}

//::role::admin
const createProduct = async (req: Request, res: Response) => {
    try {
        const { productName, productDesc, typeId, cateId, priceId } = req.body;

        //checking syntax productName
        if (!productName || textChecker.hasSpace(productName) || textChecker.hasSpecialChar(productName)) return ResponseCreator.create(400, 'Invalid productName!', productName).send(res);

        //checking syntax productDesc
        if (!productDesc || !textChecker.hasSpecialChar(productDesc)) return ResponseCreator.create(400, 'Invalid productDesc!', productDesc).send(res);

        //checking syntax typeId
        if (!typeId || !numberChecker.isNumber(typeId) || textChecker.hasSpace(typeId) || textChecker.hasSpecialChar(typeId)) return ResponseCreator.create(400, 'Invalid typeId!', typeId).send(res);

        //checking syntax cateId
        if (!cateId || !numberChecker.isNumber(cateId) || textChecker.hasSpace(cateId) || textChecker.hasSpecialChar(cateId)) return ResponseCreator.create(400, 'Invalid cateId!', cateId).send(res);

        //checking syntax priceId
        if (!priceId || !numberChecker.isNumber(priceId) || textChecker.hasSpace(priceId) || textChecker.hasSpecialChar(priceId)) return ResponseCreator.create(400, 'Invalid priceId!', priceId).send(res);

        //check exist product name
        const doesNameExist = productName && await model.products.findFirst({
            where: {
                product_name: productName,
            }
        })
        if (doesNameExist) return ResponseCreator.create(400, 'Product has already existed!', productName).send(res);

        //check typeId exists
        const isTypeExist = await model.types.findUnique({
            where: {
                type_id: parseInt(typeId)
            }
        });
        if (!isTypeExist) return ResponseCreator.create(404, 'Type not found!', typeId).send(res);

        //check cateId exists
        const isCateExist = await model.categories.findUnique({
            where: {
                cate_id: parseInt(cateId)
            }
        });
        if (!isCateExist) return ResponseCreator.create(404, 'Cate not found!', cateId).send(res);

        //check priceId exists
        const isPriceExist = await model.prices.findUnique({
            where: {
                price_id: parseInt(priceId),
            }
        });
        if (!isPriceExist) return ResponseCreator.create(404, 'Price not found!', priceId).send(res);

        const newProduct = await model.products.create({
            data: {
                product_name: productName,
                product_desc: productDesc,
                price_id: priceId,
                cate_id: cateId,
                type_id: typeId,
            }
        })


        return ResponseCreator.create(201, 'Successfully!', newProduct).send(res);
    } catch (error) {
        console.log('error:: ', error);
        const logger = new Logger(new Error(new Date().getTime().toString(), __filename));
        logger.write();
        return ResponseCreator.create(500).send(res);
    }
}

//::role::admin
const updateProduct = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        const { productName, productDesc, typeId, cateId, priceId } = req.body;
        console.log('body:: ', req.body);

        //check productId
        if (!productId || !numberChecker.isNumber(productId) || textChecker.hasSpace(productId) || textChecker.hasSpecialChar(productId)) return ResponseCreator.create(400, 'Invalid productId!', productId).send(res);

        //check hasData
        if (objectChecker.isEmptyObject(req.body)) return ResponseCreator.create(200, 'There is nothing to update!', '').send(res);

        //checking is exist
        const isExist = await model.products.findUnique({
            where: {
                product_id: parseInt(productId),
            }
        })

        if (!isExist) return ResponseCreator.create(404, 'Product not found!', productId).send(res);

        //checking syntax productName
        if (productName && textChecker.hasSpace(productName) || textChecker.hasSpecialChar(productName)) return ResponseCreator.create(400, 'Invalid productName!', productName).send(res);

        //checking syntax productDesc
        if (productDesc && textChecker.hasSpace(productDesc) || textChecker.hasSpecialChar(productDesc)) return ResponseCreator.create(400, 'Invalid productDesc!', productDesc).send(res);

        //checking syntax typeId
        if (typeId && !numberChecker.isNumber(typeId) || textChecker.hasSpace(typeId) || textChecker.hasSpecialChar(typeId)) return ResponseCreator.create(400, 'Invalid typeId!', typeId).send(res);

        //checking syntax cateId
        if (cateId && !numberChecker.isNumber(cateId) || textChecker.hasSpace(cateId) || textChecker.hasSpecialChar(cateId)) return ResponseCreator.create(400, 'Invalid cateId!', cateId).send(res);

        //checking syntax priceId
        if (priceId && !numberChecker.isNumber(priceId) || textChecker.hasSpace(priceId) || textChecker.hasSpecialChar(priceId)) return ResponseCreator.create(400, 'Invalid priceId!', priceId).send(res);

        //check exist product name
        const doesNameExist = productName && await model.products.findFirst({
            where: {
                product_name: productName,
            }
        })

        if (doesNameExist) return ResponseCreator.create(400, 'Product name has already existed!', productName).send(res);

        //check typeId exists
        if (typeId) {
            const isTypeExist = await model.types.findUnique({
                where: {
                    type_id: parseInt(priceId),
                }
            });
            if (!isTypeExist) return ResponseCreator.create(404, 'Type not found!', typeId).send(res);
        }

        //check cateId exists
        if (cateId) {
            const isCateExist = await model.categories.findUnique({
                where: {
                    cate_id: parseInt(cateId),
                }
            });
            if (!isCateExist) return ResponseCreator.create(404, 'Cate not found!', cateId).send(res);
        }

        //check priceId exists
        if (priceId) {
            const isPriceExist = await model.prices.findUnique({
                where: {
                    price_id: parseInt(priceId),
                }
            });
            if (!isPriceExist) return ResponseCreator.create(404, 'Price not found!', priceId).send(res);
        }

        let updatedProduct = productName && await model.products.update({
            data: { product_name: productName },
            where: {
                product_id: parseInt(productId),
            }
        })

        updatedProduct = productDesc && await model.products.update({
            data: { product_desc: productDesc },
            where: {
                product_id: parseInt(productId),
            }
        })

        updatedProduct = typeId && await model.products.update({
            data: { type_id: typeId },
            where: {
                product_id: parseInt(productId),
            }
        })

        updatedProduct = cateId && await model.products.update({
            data: { cate_id: cateId },
            where: {
                product_id: parseInt(productId),
            }
        })

        updatedProduct = priceId && await model.products.update({
            data: { price_id: priceId },
            where: {
                product_id: parseInt(productId),
            }
        })

        if (!updatedProduct) return ResponseCreator.create(200, 'There is nothing to update!', '').send(res);

        return ResponseCreator.create(201, 'Update successfully!', updatedProduct).send(res);

    } catch (error) {
        console.log('error:: ', error);
        const logger = new Logger(new Error(new Date().getTime().toString(), __filename));
        logger.write();
        return ResponseCreator.create(500).send(res);
    }
}

//::role::admin
const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;

        //check null
        if (!productId) return ResponseCreator.create(400, 'Invalid productId!', productId).send(res);

        //check cate id
        if (!numberChecker.isNumber(productId) || textChecker.hasSpace(productId) || textChecker.hasSpecialChar(productId)) return ResponseCreator.create(400, 'Invalid productId!', productId).send(res);

        const isExist = await model.products.findUnique({
            where: {
                product_id: parseInt(productId)
            }
        });

        //check exist
        if (!isExist) return ResponseCreator.create(404, 'Product not found!', productId).send(res);

        //delete
        const deletedProduct = await model.products.update({
            data: { is_deleted: true },
            where: {
                product_id: parseInt(productId)
            }
        })

        return ResponseCreator.create(200, 'Delete successfully!', deletedProduct).send(res);
    } catch (error) {
        console.log('error:: ', error);
        const logger = new Logger(new Error(new Date().getTime().toString(), __filename));
        logger.write();
        return ResponseCreator.create(500).send(res);
    }
}

//::role::admin
//:: do không thể gửi cùng lúc formdata và body nên phải tách ra 1 route riêng
const undoDeleteProduct = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;

        //check null
        if (!productId) return ResponseCreator.create(400, 'Invalid productId!', productId).send(res);

        //check cate id
        if (!numberChecker.isNumber(productId) || textChecker.hasSpace(productId) || textChecker.hasSpecialChar(productId)) return ResponseCreator.create(400, 'Invalid productId!', productId).send(res);

        const isExist = await model.products.findUnique({
            where: {
                product_id: parseInt(productId),
            }
        })

        //check exist
        if (!isExist) return ResponseCreator.create(404, 'Product not found!', productId).send(res);

        //delete
        const deletedCate = await model.products.update({
            data: { is_deleted: false },
            where: {
                product_id: parseInt(productId),
            }
        })

        return ResponseCreator.create(200, 'Undo successfully!', deletedCate).send(res);
    } catch (error) {
        console.log('error:: ', error);
        const logger = new Logger(new Error(new Date().getTime().toString(), __filename));
        logger.write();
        return ResponseCreator.create(500).send(res);
    }
}

//::role::admin
const uploadImageProduct = async (req: Request, res: Response) => {
    try {
        const files = req.files;
        const { productId } = req.params;

        //check files
        if (!files || !files.length) return ResponseCreator.create(400, 'Invalid product images', files).send(res);

        //check productId
        if (!productId || !numberChecker.isNumber(productId) || textChecker.hasSpace(productId) || textChecker.hasSpecialChar(productId)) return ResponseCreator.create(400, 'Invalid product id', productId).send(res);

        const isExist = await model.products.findUnique({
            where: {
                product_id: parseInt(productId),
            }
        })

        if (!isExist) ResponseCreator.create(404, 'Product not found', productId).send(res);

        //write  and compress images
        const idDirPath = path.join(process.cwd(), 'public', 'assets', 'images', 'inDir');
        const isDone = await FileConcreteReader.write(idDirPath);
        if (isDone) {
            const uploadedFiles = await FileConcreteReader.read();
            if (uploadedFiles) {
                const imagesData = uploadedFiles.map(img_url => ({
                    product_id: parseInt(productId),
                    img_url: img_url,
                }));
                const uploadedImgs = [];
                for (const img of imagesData) {
                    const uploaded = await model.images.create({
                        data: {
                            product_id: img.product_id,
                            img_url: img.img_url,
                        },
                    })

                    uploadedImgs.push(uploaded);
                    FileConcreteReader.delete();
                }

                return ResponseCreator.create(201, 'Create successfully!', uploadedImgs).send(res);
            }
            // const images = await model.images.createMany({ data: imagesData, skipDuplicates: true })
        }

    } catch (error) {
        console.log('error:: ', error);
        const logger = new Logger(new Error(new Date().getTime().toString(), __filename));
        logger.write();
        return ResponseCreator.create(500).send(res);
    }

}

export {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    undoDeleteProduct,
    uploadImageProduct
}
