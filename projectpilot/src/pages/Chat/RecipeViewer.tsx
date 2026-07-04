import { useEffect, useState } from "react";

type Ingredient = {
    name: string;
    quantity?: number;
    unit?: string;
};

type Recipe = {
    recipeName: string;
    ingredients?: Ingredient[];
    steps?: string[] | string;
    description?: string;
    id?: string | number;
};

function RecipeViewer({ recipe }: { recipe: string }) {
    const [recipes, setRecipes] = useState<Recipe[]>([]);

    useEffect(() => {
        // Simulate API response
        const responseString = recipe;

        try {
            const parsed: Recipe[] = JSON.parse(responseString);
            setRecipes(parsed);
        } catch (err) {
            console.error("Invalid JSON:", err);
        }
    }, []);

    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            <h2 className="text-lg font-bold mb-4">Recipes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recipes.length > 0 ? (
                    recipes.map((recipe, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-lg shadow p-4 border border-gray-300"
                        >
                            <h3 className="text-md font-semibold mb-2 text-indigo-700">
                                {recipe.recipeName}
                            </h3>
                            {recipe.ingredients && (
                                <div className="mb-2">
                                    <span className="font-semibold">Ingredients:</span>
                                    <ul className="list-disc list-inside text-sm text-gray-700">
                                        {recipe.ingredients.map((ing, i) => (
                                            <li key={i}>
                                                {ing.name}
                                                {ing.quantity ? ` (${ing.quantity} ${ing.unit || ""})` : ""}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {recipe.steps && (
                                <p className="text-sm text-gray-600">
                                    <span className="font-semibold">Steps:</span>{" "}
                                    {Array.isArray(recipe.steps)
                                        ? recipe.steps.join(" → ")
                                        : recipe.steps}
                                </p>
                            )}
                            {recipe.description && (
                                <p className="text-sm text-gray-600 mt-2">{recipe.description}</p>
                            )}
                            {recipe.id && (
                                <p className="text-xs text-gray-400 mt-2">ID: {recipe.id}</p>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="italic text-gray-500">No recipes found.</p>
                )}
            </div>
        </div>
    );
}

export default RecipeViewer;