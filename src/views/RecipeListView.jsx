import { RecipeCard } from '@/components/RecipeCard.jsx'
import { Link } from '@tanstack/react-router'
import { UiIcon } from '@lib/components/UiIcon.jsx'
import { QuickActions } from '@/components/QuickActions.jsx'
import { QuickActionButton } from '@/components/QuickActionButton.jsx'
import { useEffect, useState } from 'react'
import { db } from '@/services/firebase'
import { collection, getDocs } from 'firebase/firestore'

export function RecipeListView() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                setLoading(true);
                const recipesCollectionRef = collection(db, "recipes");
                const querySnapshot = await getDocs(recipesCollectionRef);
                const recipesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setRecipes(recipesData);
                setError(null);
            } catch (err) {
                console.error("Error fetching recipes:", err);
                setError("Failed to load recipes.");
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, []);

    if (loading) return <div className="container mx-auto p-4 text-center">Loading recipes...</div>;
    if (error) return <div className="container mx-auto p-4 text-center text-error">{error}</div>;

    return <>
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {recipes.length === 0 && !loading && <p>No recipes found. Add your first recipe!</p>}
                {recipes.map(recipe => (
                    <div key={recipe.id}>
                        <Link to={`/recipe/${recipe.id}`}>
                            <RecipeCard 
                                title={recipe.name} 
                                description={recipe.description} 
                            />
                        </Link>
                    </div>
                ))}
            </div>
        </div>
        <QuickActions>
            <Link to="/recipe/new">
                <QuickActionButton>
                    <UiIcon icon="add" size="2xl" />
                </QuickActionButton>
            </Link>
        </QuickActions>
    </>
}