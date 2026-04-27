import {
  parseNumber,
  formatCHF,
  calculateIngredientCost,
  getEquivalentFactor
} from "./calculator.js";

export function getDomElements() {
  return {
    ingredientTableBody: document.getElementById("ingredientTableBody"),
    addIngredientBtn: document.getElementById("addIngredientBtn"),
    resetRecipeBtn: document.getElementById("resetRecipeBtn"),

    savedRecipesSelect: document.getElementById("savedRecipesSelect"),
    saveRecipeBtn: document.getElementById("saveRecipeBtn"),
    loadRecipeBtn: document.getElementById("loadRecipeBtn"),
    deleteRecipeBtn: document.getElementById("deleteRecipeBtn"),

    recipeNameInput: document.getElementById("recipeName"),
    portionsInput: document.getElementById("portions"),
    foodCostPercentInput: document.getElementById("foodCostPercent"),
    factorInput: document.getElementById("factor"),
    roundingRuleInput: document.getElementById("roundingRule"),
    vatEnabledInput: document.getElementById("vatEnabled"),
    vatPercentInput: document.getElementById("vatPercent"),
    vatGroup: document.getElementById("vatGroup"),
    factorHint: document.getElementById("factorHint"),

    totalRecipeCostOutput: document.getElementById("totalRecipeCost"),
    costPerPortionOutput: document.getElementById("costPerPortion"),
    sellingPriceFoodCostOutput: document.getElementById("sellingPriceFoodCost"),
    sellingPriceFactorOutput: document.getElementById("sellingPriceFactor"),
    grossPriceFoodCostOutput: document.getElementById("grossPriceFoodCost"),
    grossPriceFactorOutput: document.getElementById("grossPriceFactor")

    
  };
}

function getQuantityUnitOptions(priceBasis) {
  if (priceBasis === "kg") {
    return [
      { value: "g", label: "g" },
      { value: "kg", label: "kg" }
    ];
  }

  return [
    { value: "ml", label: "ml" },
    { value: "dl", label: "dl" },
    { value: "l", label: "L" }
  ];
}

function renderQuantityUnitOptions(selectElement, priceBasis) {
  const options = getQuantityUnitOptions(priceBasis);

  selectElement.innerHTML = options
    .map((option) => `<option value="${option.value}">${option.label}</option>`)
    .join("");
}

function getDefaultQuantityUnit(priceBasis) {
  return priceBasis === "kg" ? "g" : "ml";
}

function updateQuantityPlaceholder(quantityInput, priceBasis, quantityUnit) {
  if (priceBasis === "kg") {
    quantityInput.placeholder = quantityUnit === "kg" ? "Quantity in kg" : "Quantity in g";
    return;
  }

  if (quantityUnit === "l") {
    quantityInput.placeholder = "Quantity in L";
  } else if (quantityUnit === "dl") {
    quantityInput.placeholder = "Quantity in dl";
  } else {
    quantityInput.placeholder = "Quantity in ml";
  }
}

export function createIngredientRow(tableBody, onChange) {
  const row = document.createElement("tr");

  row.innerHTML = `
    <td>
      <input type="text" class="ingredient-name" placeholder="Example: Cream" />
    </td>
    <td>
      <select class="price-basis">
        <option value="kg">CHF / kg</option>
        <option value="l">CHF / L</option>
      </select>
    </td>
    <td>
      <input type="number" class="unit-price" min="0" step="0.01" placeholder="0.00" />
    </td>
    <td>
      <input type="number" class="quantity-used" min="0" step="0.1" placeholder="Quantity in g" />
    </td>
    <td>
      <select class="quantity-unit"></select>
    </td>
    <td class="row-cost">CHF 0.00</td>
    <td>
      <button type="button" class="button delete">Remove</button>
    </td>
  `;

  const priceBasisInput = row.querySelector(".price-basis");
  const quantityUsedInput = row.querySelector(".quantity-used");
  const quantityUnitInput = row.querySelector(".quantity-unit");
  const deleteBtn = row.querySelector(".delete");

  renderQuantityUnitOptions(quantityUnitInput, priceBasisInput.value);
  quantityUnitInput.value = getDefaultQuantityUnit(priceBasisInput.value);
  updateQuantityPlaceholder(quantityUsedInput, priceBasisInput.value, quantityUnitInput.value);

  const inputs = row.querySelectorAll("input, select");
  inputs.forEach((input) => {
    input.addEventListener("input", onChange);
    input.addEventListener("change", onChange);
  });

  priceBasisInput.addEventListener("change", () => {
    renderQuantityUnitOptions(quantityUnitInput, priceBasisInput.value);
    quantityUnitInput.value = getDefaultQuantityUnit(priceBasisInput.value);
    updateQuantityPlaceholder(quantityUsedInput, priceBasisInput.value, quantityUnitInput.value);
    onChange();
  });

  quantityUnitInput.addEventListener("change", () => {
    updateQuantityPlaceholder(quantityUsedInput, priceBasisInput.value, quantityUnitInput.value);
    onChange();
  });

  deleteBtn.addEventListener("click", () => {
    row.remove();
    onChange();
  });

  tableBody.appendChild(row);
}

export function updateVatVisibility(vatEnabledInput, vatGroup) {
  if (vatEnabledInput.value === "on") {
    vatGroup.classList.remove("hidden");
  } else {
    vatGroup.classList.add("hidden");
  }
}

export function updateFactorHint(foodCostPercentInput, factorHintElement) {
  const foodCostPercent = parseNumber(foodCostPercentInput.value);

  if (foodCostPercent > 0) {
    const factor = getEquivalentFactor(foodCostPercent);
    factorHintElement.textContent = `Equivalent factor: ${factor.toFixed(2)}`;
  } else {
    factorHintElement.textContent = "Equivalent factor: —";
  }
}

export function getIngredientCosts(tableBody) {
  const rows = tableBody.querySelectorAll("tr");
  const ingredientCosts = [];

  rows.forEach((row) => {
    const priceBasis = row.querySelector(".price-basis").value;
    const unitPrice = parseNumber(row.querySelector(".unit-price").value);
    const quantityUsed = parseNumber(row.querySelector(".quantity-used").value);
    const quantityUnit = row.querySelector(".quantity-unit").value;

    const cost = calculateIngredientCost(priceBasis, unitPrice, quantityUsed, quantityUnit);
    row.querySelector(".row-cost").textContent = formatCHF(cost);

    ingredientCosts.push(cost);
  });

  return ingredientCosts;
}

export function getSettings(dom) {
  return {
    portions: Math.max(parseNumber(dom.portionsInput.value), 1),
    foodCostPercent: parseNumber(dom.foodCostPercentInput.value),
    factor: parseNumber(dom.factorInput.value),
    roundingStep: parseNumber(dom.roundingRuleInput.value),
    vatEnabled: dom.vatEnabledInput.value === "on",
    vatPercent: parseNumber(dom.vatPercentInput.value)
  };
}

export function renderResults(dom, results, factor, vatEnabled, foodCostPercent) {
  dom.totalRecipeCostOutput.textContent = formatCHF(results.totalRecipeCost);
  dom.costPerPortionOutput.textContent = formatCHF(results.costPerPortion);

  dom.sellingPriceFoodCostOutput.textContent =
    foodCostPercent > 0 ? formatCHF(results.roundedFoodCostPrice) : "—";

  dom.sellingPriceFactorOutput.textContent =
    factor > 0 ? formatCHF(results.roundedFactorPrice) : "—";

  dom.grossPriceFoodCostOutput.textContent =
    vatEnabled && foodCostPercent > 0 ? formatCHF(results.grossFoodCostPrice) : vatEnabled ? "—" : "VAT off";

  dom.grossPriceFactorOutput.textContent =
    vatEnabled && factor > 0 ? formatCHF(results.grossFactorPrice) : vatEnabled ? "—" : "VAT off";
}

export function resetForm(dom, onChange) {
  dom.recipeNameInput.value = "";
  dom.portionsInput.value = 1;
  dom.foodCostPercentInput.value = 30;
  dom.factorInput.value = "";
  dom.roundingRuleInput.value = "0";
  dom.vatEnabledInput.value = "on";
  dom.vatPercentInput.value = 8.1;

  dom.ingredientTableBody.innerHTML = "";
  createIngredientRow(dom.ingredientTableBody, onChange);
  createIngredientRow(dom.ingredientTableBody, onChange);

  onChange();
}

export function collectRecipeData(dom) {
  const rows = dom.ingredientTableBody.querySelectorAll("tr");

  const ingredients = Array.from(rows).map((row) => {
    return {
      name: row.querySelector(".ingredient-name").value,
      priceBasis: row.querySelector(".price-basis").value,
      unitPrice: row.querySelector(".unit-price").value,
      quantityUsed: row.querySelector(".quantity-used").value,
      quantityUnit: row.querySelector(".quantity-unit").value
    };
  });

  return {
    recipeName: dom.recipeNameInput.value.trim() || "Untitled recipe",
    portions: dom.portionsInput.value,
    foodCostPercent: dom.foodCostPercentInput.value,
    factor: dom.factorInput.value,
    roundingRule: dom.roundingRuleInput.value,
    vatEnabled: dom.vatEnabledInput.value,
    vatPercent: dom.vatPercentInput.value,
    ingredients
  };
}

export function renderSavedRecipes(selectElement, recipes) {
  selectElement.innerHTML = "";

  if (recipes.length === 0) {
    selectElement.innerHTML = `<option value="">No saved recipes</option>`;
    return;
  }

  selectElement.innerHTML = `<option value="">Select a recipe</option>`;

  recipes.forEach((recipe) => {
    const option = document.createElement("option");
    option.value = recipe.id;
    option.textContent = recipe.recipeName;
    selectElement.appendChild(option);
  });
}

export function loadRecipeIntoForm(dom, recipe, onChange) {
  if (!recipe) return;

  dom.recipeNameInput.value = recipe.recipeName || "";
  dom.portionsInput.value = recipe.portions || 1;
  dom.foodCostPercentInput.value = recipe.foodCostPercent || 30;
  dom.factorInput.value = recipe.factor || "";
  dom.roundingRuleInput.value = recipe.roundingRule || "0";
  dom.vatEnabledInput.value = recipe.vatEnabled || "on";
  dom.vatPercentInput.value = recipe.vatPercent || 8.1;

  dom.ingredientTableBody.innerHTML = "";

  recipe.ingredients.forEach((ingredient) => {
    createIngredientRow(dom.ingredientTableBody, onChange);

    const row = dom.ingredientTableBody.lastElementChild;

    row.querySelector(".ingredient-name").value = ingredient.name || "";
    row.querySelector(".price-basis").value = ingredient.priceBasis || "kg";

    const quantityUnitSelect = row.querySelector(".quantity-unit");
    const quantityInput = row.querySelector(".quantity-used");

    const priceBasisInput = row.querySelector(".price-basis");

    // Trigger price basis change so valid quantity units are rebuilt
    priceBasisInput.dispatchEvent(new Event("change"));

    row.querySelector(".unit-price").value = ingredient.unitPrice || "";
    quantityInput.value = ingredient.quantityUsed || "";
    quantityUnitSelect.value = ingredient.quantityUnit || "g";
  });

  onChange();
}