import moment from 'moment';

export const IngredientAdapter = (apiResponse) => {
    const Ingredient = {
        id: apiResponse.id,
        name: apiResponse.name, 
        address: apiResponse.address, 
        phone: apiResponse.phone,
    }
    return Ingredient;
}

export const IngredientCreateAdapter = (entity) => {
    const newEntity = {
        name: entity.name,
        address: entity.address,
        phone: entity.phone
    };
    return newEntity;
}
export const IngredientUpdateAdapter = (entity) => {
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