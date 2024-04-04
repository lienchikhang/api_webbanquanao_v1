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
}

export default Data;