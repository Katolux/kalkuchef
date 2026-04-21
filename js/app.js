import { calculateRecipeResults } from "./calculator.js";
import {
  getDomElements,
  createIngredientRow,
  updateVatVisibility,
  updateFactorHint,
  getIngredientCosts,
  getSettings,
  renderResults,
  resetForm
} from "./ui.js";

const dom = getDomElements();

function updateApp() {
  updateVatVisibility(dom.vatEnabledInput, dom.vatGroup);
  updateFactorHint(dom.foodCostPercentInput, dom.factorHint);

  const ingredientCosts = getIngredientCosts(dom.ingredientTableBody);
  const settings = getSettings(dom);

  const results = calculateRecipeResults({
    ingredientCosts,
    portions: settings.portions,
    foodCostPercent: settings.foodCostPercent,
    factor: settings.factor,
    roundingStep: settings.roundingStep,
    vatEnabled: settings.vatEnabled,
    vatPercent: settings.vatPercent
  });

  renderResults(
    dom,
    results,
    settings.factor,
    settings.vatEnabled,
    settings.foodCostPercent
  );
}

function initApp() {
  dom.addIngredientBtn.addEventListener("click", () => {
    createIngredientRow(dom.ingredientTableBody, updateApp);
    updateApp();
  });

  dom.resetRecipeBtn.addEventListener("click", () => {
    resetForm(dom, updateApp);
  });

  [
    dom.recipeNameInput,
    dom.portionsInput,
    dom.foodCostPercentInput,
    dom.factorInput,
    dom.roundingRuleInput,
    dom.vatEnabledInput,
    dom.vatPercentInput
  ].forEach((input) => {
    input.addEventListener("input", updateApp);
    input.addEventListener("change", updateApp);
  });

  createIngredientRow(dom.ingredientTableBody, updateApp);
  createIngredientRow(dom.ingredientTableBody, updateApp);

  updateApp();
}

initApp();