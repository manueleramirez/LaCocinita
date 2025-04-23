import moment from 'moment';

export const ConfigAdapter = (apiResponse) => {
    const config = {
        id: apiResponse.id,
        workHourlyRate: apiResponse.workHourlyRate, 
        profitMargin: (apiResponse.profitMargin/100), 
        spendMargin:( apiResponse.spendMargin/100),
    }
    return config;
}

export const ConfigCreateAdapter = (entity) => {
    const newEntity = {
        workHourlyRate: entity.workHourlyRate, 
        profitMargin: entity.profitMargin, 
        spendMargin: entity.spendMargin,
    };
    return newEntity;
}
export const ConfigUpdateAdapter = (entity) => {
    const newEntity = {
        id:entity.id,
        user_id: entity.userId,
        workHourlyRate: entity.workHourlyRate, 
        profitMargin: entity.profitMargin, 
        spendMargin: entity.spendMargin,
        updated_at: moment(moment.now()).utc(true).format()
    };
    return newEntity;
}