import moment from 'moment';

export const supplierAdapter = (apiResponse) => {
    const supplier = {
        id: apiResponse.id,
        name: apiResponse.name, 
        address: apiResponse.address, 
        phone: apiResponse.phone,
    }
    return supplier;
}

export const supplierCreateAdapter = (entity) => {
    const newEntity = {
        name: entity.name,
        address: entity.address,
        phone: entity.phone
    };
    return newEntity;
}
export const supplierUpdateAdapter = (entity) => {
    const newEntity = {
        id:entity.id,
        user_id: entity.userId,
        name: entity.name,
        address: entity.address,
        phone: entity.phone,
        updated_at: moment(moment.now()).utc(true).format()
    };
    return newEntity;
}