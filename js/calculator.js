export function normalizeNumberInput(value) {
  return String(value).replace(",", ".").trim();
}

export function parseNumber(value) {
  const normalized = normalizeNumberInput(value);
  const parsed = parseFloat(normalized);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function formatCHF(value) {
  if (value > 0 && value < 0.01) {
    return "< CHF 0.01";
  }

  return `CHF ${value.toFixed(2)}`;
}

export function roundToStep(value, step) {
  if (!step || step === 0) {
    return value;
  }

  return Math.round(value / step) * step;
}

export function getEquivalentFactor(foodCostPercent) {
  if (foodCostPercent <= 0) {
    return 0;
  }

  return 100 / foodCostPercent;
}

export function convertQuantityToBaseUnit(priceBasis, quantity, quantityUnit) {
  if (priceBasis === "kg") {
    if (quantityUnit === "g") {
      return quantity / 1000;
    }

    if (quantityUnit === "kg") {
      return quantity;
    }
  }

  if (priceBasis === "l") {
    if (quantityUnit === "ml") {
      return quantity / 1000;
    }

    if (quantityUnit === "dl") {
      return quantity / 10;
    }

    if (quantityUnit === "l") {
      return quantity;
    }
  }

  return 0;
}

export function calculateIngredientCost(priceBasis, unitPrice, quantityUsed, quantityUnit) {
  const normalizedQuantity = convertQuantityToBaseUnit(priceBasis, quantityUsed, quantityUnit);
  return normalizedQuantity * unitPrice;
}

export function calculateRecipeResults({
  ingredientCosts,
  portions,
  foodCostPercent,
  factor,
  roundingStep,
  vatEnabled,
  vatPercent
}) {
  const totalRecipeCost = ingredientCosts.reduce((sum, cost) => sum + cost, 0);
  const safePortions = Math.max(portions, 1);
  const costPerPortion = totalRecipeCost / safePortions;

  let sellingPriceFoodCost = 0;
  if (foodCostPercent > 0) {
    sellingPriceFoodCost = costPerPortion / (foodCostPercent / 100);
  }

  let sellingPriceFactor = 0;
  if (factor > 0) {
    sellingPriceFactor = costPerPortion * factor;
  }

  const roundedFoodCostPrice = roundToStep(sellingPriceFoodCost, roundingStep);
  const roundedFactorPrice = roundToStep(sellingPriceFactor, roundingStep);

  let grossFoodCostPrice = roundedFoodCostPrice;
  let grossFactorPrice = roundedFactorPrice;

  if (vatEnabled) {
    grossFoodCostPrice = roundedFoodCostPrice * (1 + vatPercent / 100);
    grossFactorPrice = roundedFactorPrice * (1 + vatPercent / 100);
  }

  return {
    totalRecipeCost,
    costPerPortion,
    roundedFoodCostPrice,
    roundedFactorPrice,
    grossFoodCostPrice,
    grossFactorPrice
  };
}