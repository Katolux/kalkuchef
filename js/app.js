import { calculateRecipeResults } from "./calculator.js";
import {
  getDomElements,
  createIngredientRow,
  updateVatVisibility,
  updateFactorHint,
  getIngredientCosts,
  getSettings,
  renderResults,
  resetForm,
  collectRecipeData,
  renderSavedRecipes,
  loadRecipeIntoForm
} from "./ui.js";

import {
  getSavedRecipes,
  saveRecipe,
  deleteRecipe,
  findRecipeById
} from "./storage.js";

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

function refreshSavedRecipesList() {
  const recipes = getSavedRecipes();
  renderSavedRecipes(dom.savedRecipesSelect, recipes);
}

function initApp() {
  dom.addIngredientBtn.addEventListener("click", () => {
    createIngredientRow(dom.ingredientTableBody, updateApp);
    updateApp();
  });

  dom.saveRecipeBtn.addEventListener("click", () => {
  const recipe = collectRecipeData(dom);
  const savedRecipe = saveRecipe(recipe);

  refreshSavedRecipesList();
  dom.savedRecipesSelect.value = savedRecipe.id;
});

dom.loadRecipeBtn.addEventListener("click", () => {
  const recipeId = dom.savedRecipesSelect.value;
  const recipe = findRecipeById(recipeId);

  loadRecipeIntoForm(dom, recipe, updateApp);
});

dom.deleteRecipeBtn.addEventListener("click", () => {
  const recipeId = dom.savedRecipesSelect.value;

  if (!recipeId) return;

  deleteRecipe(recipeId);
  refreshSavedRecipesList();
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

  refreshSavedRecipesList();
  
  updateApp();
}

initApp();