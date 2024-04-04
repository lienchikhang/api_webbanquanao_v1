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
}

export default Data;