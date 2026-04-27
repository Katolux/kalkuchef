const STORAGE_KEY = "kalkuchefRecipes";

export function getSavedRecipes() {
  const savedData = localStorage.getItem(STORAGE_KEY);

  if (!savedData) {
    return [];
  }

  try {
    return JSON.parse(savedData);
  } catch {
    return [];
  }
}

export function saveRecipe(recipe) {
  const recipes = getSavedRecipes();

  const recipeWithId = {
    ...recipe,
    id: crypto.randomUUID(),
    savedAt: new Date().toISOString()
  };

  recipes.push(recipeWithId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));

  return recipeWithId;
}

export function deleteRecipe(recipeId) {
  const recipes = getSavedRecipes();
  const updatedRecipes = recipes.filter((recipe) => recipe.id !== recipeId);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecipes));
}

export function findRecipeById(recipeId) {
  const recipes = getSavedRecipes();
  return recipes.find((recipe) => recipe.id === recipeId) || null;
}