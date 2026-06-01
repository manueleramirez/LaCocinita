export interface PricingInput {
  ingredients: Array<{
    ingredientId: string;
    quantity: number;
    unitId: string;
    ingredientPrice: number;
  }>;
  preparationTime: number;
  portionsPerRecipe: number;
  config: {
    workHourlyRate: number;
    profitMargin: number;
    spendMargin: number;
  };
}

export interface PricingResult {
  ingredientsCost: number;
  indirectSpends: number;
  personalSpends: number;
  prepareCost: number;
  revenueMargin: number;
  recommendedSalesPrice: number;
  recommendedSalesPricePerPortion: number;
  ingredientBreakdown: Array<{
    ingredientId: string;
    cost: number;
  }>;
}

export function calculatePricing(input: PricingInput): PricingResult {
  const ingredientBreakdown = input.ingredients.map((ing) => {
    const cost = ing.ingredientPrice * ing.quantity;
    return { ingredientId: ing.ingredientId, cost };
  });

  const ingredientsCost = ingredientBreakdown.reduce((sum, i) => sum + i.cost, 0);
  const indirectSpends = ingredientsCost * (input.config.spendMargin / 100);
  const hoursWorked = input.preparationTime / 60;
  const personalSpends = hoursWorked * input.config.workHourlyRate;
  const prepareCost = ingredientsCost + indirectSpends + personalSpends;
  const revenueMargin = input.config.profitMargin;
  const recommendedSalesPrice = prepareCost * (1 + revenueMargin / 100);
  const recommendedSalesPricePerPortion = recommendedSalesPrice / input.portionsPerRecipe;

  return {
    ingredientsCost,
    indirectSpends,
    personalSpends,
    prepareCost,
    revenueMargin,
    recommendedSalesPrice,
    recommendedSalesPricePerPortion,
    ingredientBreakdown,
  };
}
