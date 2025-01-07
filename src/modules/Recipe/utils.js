
export const calculateCostIngredient = (
  ingredientId,
  unitSelected,
  quantity,
  Ingredient = [],
  units = []
) => {
  let cost;
  const ingredient = Ingredient.filter((i) => i.id == ingredientId)[0];
  const unit = units.filter((u) => u.code == unitSelected)[0];
  const needConversion = ingredient.unitId !== unitSelected;
  if (!needConversion) {
    cost = (quantity * ingredient.price) / ingredient.quantity;
    
  } else {
    const conversion = unit.conversions.find(c => c.code === ingredient.unitId);
    if(conversion){
        const { factor } = conversion;
        const pricePerUnit = ingredient.price / ingredient.quantity;
        cost = (quantity * pricePerUnit) * factor;
    }else{
        throw new Error('La conversión no es posible')
    }
  }
  
  return cost
};
export const calculateIndirectExpenses = (totalCost, spendMargin = 0.15) => {
  return totalCost * spendMargin;
};
export const personnelSpending = (
  preparationTime,
  timeUnit = "hr",
  WorkHourlyRate
) => {
  return (
    preparationTime *
    (timeUnit == "min"
      ? WorkHourlyRate / 60
      : WorkHourlyRate)
  );
};
export const calculateCostOfPreparation = (
  totalIngredientsCost,
  indirectSpends,
  personalSpend
) => {
  return totalIngredientsCost + indirectSpends + personalSpend;
};
export const calculateProfitMargin = (
  preparationCost,
  profitMargin = 0.7
) => {
  return preparationCost * profitMargin;
};

export const calculatePrice = (TotalCost,preparationTime,WorkHourlyRate,portions) => {
  // TODO: add spendMargin from config data
  let indirectSpends= calculateIndirectExpenses(TotalCost);
  let personalSpend= personnelSpending(preparationTime,'hr',WorkHourlyRate);
  let preparationCost= calculateCostOfPreparation(TotalCost,indirectSpends,personalSpend);
  // TODO: add profitMargin from config data
  let profitMargin= calculateProfitMargin(preparationCost);
  let recommendedSalesPrice= preparationCost + profitMargin;
  let recommendedSalesPricePerPortion= recommendedSalesPrice / portions;

  return { 
    indirectSpends,
    personalSpend ,
    preparationCost,
    profitMargin,
    recommendedSalesPrice,
    recommendedSalesPricePerPortion
  }

}
