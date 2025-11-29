import React, { useState, useEffect, useMemo } from 'react';
import recipeData from './recipe_database.json';

const BrooklynFoodFight = () => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [quickPunches, setQuickPunches] = useState([]);
  const [championRecipe, setChampionRecipe] = useState(null);

  const taglines = [
    "Recipes Ready to Rumble",
    "Where Flavor Throws the First Punch",
    "Your Kitchen. Your Ring.",
    "No Recipe Left Standing",
    "Knockout Dishes Only",
  ];

  const placeholders = [
    "Search for 'chocolate'...",
    "Try 'Japanese'...",
    "Looking for 'eggs'...",
    "Craving 'pasta'...",
    "How about 'chicken'...",
  ];

  // Common cooking ingredients for Quick Punches
  const commonIngredients = [
    'Chicken', 'Beef', 'Pork', 'Salmon', 'Shrimp', 'Tofu',
    'Lamb', 'Clams', 'Eggs', 'Ginger', 'Lemon',
    'Pasta', 'Rice', 'Noodles', 'Pizza', 'Pancakes', 'Potato',
    'Tomato', 'Mushroom', 'Spinach', 'Broccoli', 'Carrot',
    'Cauliflower', 'Zucchini', 'Bok Choy', 'Squash',
    'Cheese', 'Miso', 'Chocolate', 'Strawberries'
  ];

  // Custom chapter order
  const chapterOrder = [
    'Breakfasty',
    'Vegetables',
    'Salad',
    'Pasta',
    'Pizza',
    'Rice-Pulses',
    'Soup',
    'Seafood',
    'Poultry',
    'Meat',
    'Dessert-Baking',
    'Condiments',
    'Cocktails/Spirits'
  ];

  // Group recipes by category (chapter)
  const recipesByChapter = useMemo(() => {
    const grouped = {};
    recipeData.forEach(recipe => {
      const chapter = recipe.category || 'Uncategorized';
      if (!grouped[chapter]) {
        grouped[chapter] = [];
      }
      grouped[chapter].push(recipe);
    });
    
    // Sort chapters by custom order
    const sorted = {};
    chapterOrder.forEach(chapter => {
      if (grouped[chapter]) {
        sorted[chapter] = grouped[chapter];
      }
    });
    
    // Add any chapters not in the custom order at the end (alphabetically)
    Object.keys(grouped).sort().forEach(chapter => {
      if (!sorted[chapter]) {
        sorted[chapter] = grouped[chapter];
      }
    });
    
    return sorted;
  }, []);

  // Get all recipes as flat array
  const allRecipes = useMemo(() => {
    return Object.values(recipesByChapter).flat();
  }, [recipesByChapter]);

  // Pick a random champion recipe on load
  useEffect(() => {
    if (allRecipes.length > 0) {
      const randomIndex = Math.floor(Math.random() * allRecipes.length);
      setChampionRecipe(allRecipes[randomIndex]);
    }
  }, [allRecipes]);

  // Pick random 4 ingredients from common list
  useEffect(() => {
    const shuffled = [...commonIngredients].sort(() => Math.random() - 0.5);
    setQuickPunches(shuffled.slice(0, 4));
  }, []);

  // Rotate taglines
  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex((i) => (i + 1) % taglines.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Rotate placeholders
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % placeholders.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Search across name, cuisine, category, and content
  const searchRecipes = (term) => {
    if (!term) return recipesByChapter;
    
    const lowerTerm = term.toLowerCase();
    
    // Need to maintain custom order when filtering
    const filtered = {};
    chapterOrder.forEach(chapter => {
      if (recipesByChapter[chapter]) {
        const matchingRecipes = recipesByChapter[chapter].filter(r => {
          const name = (r.name || r.title || '').toLowerCase();
          const cuisine = (r.cuisine_style || r.cuisine || '').toLowerCase();
          const category = (r.category || '').toLowerCase();
          const content = (r.content_preview || '').toLowerCase();
          
          return name.includes(lowerTerm) ||
            cuisine.includes(lowerTerm) ||
            category.includes(lowerTerm) ||
            content.includes(lowerTerm);
        });
        if (matchingRecipes.length > 0) {
          filtered[chapter] = matchingRecipes;
        }
      }
    });
    
    // Check for any chapters not in custom order
    Object.keys(recipesByChapter).forEach(chapter => {
      if (!chapterOrder.includes(chapter) && recipesByChapter[chapter]) {
        const matchingRecipes = recipesByChapter[chapter].filter(r => {
          const name = (r.name || r.title || '').toLowerCase();
          const cuisine = (r.cuisine_style || r.cuisine || '').toLowerCase();
          const category = (r.category || '').toLowerCase();
          const content = (r.content_preview || '').toLowerCase();
          
          return name.includes(lowerTerm) ||
            cuisine.includes(lowerTerm) ||
            category.includes(lowerTerm) ||
            content.includes(lowerTerm);
        });
        if (matchingRecipes.length > 0) {
          filtered[chapter] = matchingRecipes;
        }
      }
    });
    
    return filtered;
  };

  const filteredChapters = searchRecipes(searchTerm);
  const totalRecipes = allRecipes.length;
  const filteredCount = Object.values(filteredChapters).flat().length;

  const handleQuickPunch = (term) => {
    setSearchTerm(term);
  };

  // Build Google Drive link from file_id and file_type
  const getRecipeLink = (recipe) => {
    const fileId = recipe.file_id;
    if (!fileId) return null;
    
    const fileType = recipe.file_type || '';
    
    if (fileType === 'Google Doc') {
      return `https://docs.google.com/document/d/${fileId}/edit`;
    } else {
      // PDFs and other files
      return `https://drive.google.com/file/d/${fileId}/view`;
    }
  };

  const openRecipe = (recipe) => {
    const link = getRecipeLink(recipe);
    if (link) {
      window.open(link, '_blank');
    }
    setSelectedRecipe(null);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 bg-white z-10 border-b-2 border-gray-900">
        <div className="max-w-3xl mx-auto px-6 py-6">
          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-4xl font-black tracking-tight text-red-600">
              BROOKLYN FOOD FIGHT
            </h1>
            <p className="text-sm text-gray-400 mt-2 uppercase tracking-widest h-5 transition-opacity">
              {totalRecipes} {taglines[taglineIndex]}
            </p>
          </div>
          
          {/* Search */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">
              🥊
            </div>
            <input 
              type="text" 
              placeholder={placeholders[placeholderIndex]}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-4 py-4 text-lg bg-gray-50 border-2 border-gray-200 focus:border-gray-900 focus:bg-white outline-none transition-all"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 text-xl font-bold"
              >
                ×
              </button>
            )}
          </div>

          {/* Quick Punches + Champion Row */}
          <div className="mt-4 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Quick punches:</span>
              {quickPunches.map((punch) => (
                <button
                  key={punch}
                  onClick={() => handleQuickPunch(punch)}
                  className={`px-3 py-1 text-xs font-bold uppercase tracking-wide border-2 transition-all ${
                    searchTerm.toLowerCase() === punch.toLowerCase()
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'border-gray-200 text-gray-500 hover:border-gray-900 hover:text-gray-900'
                  }`}
                >
                  {punch}
                </button>
              ))}
            </div>
            
            {/* Inline Champion */}
            {championRecipe && (
              <div 
                className="flex items-center gap-3 border-l-2 border-red-600 pl-4 cursor-pointer hover:bg-red-50 -mr-2 pr-2 py-1 transition-colors"
                onClick={() => setSelectedRecipe(championRecipe)}
              >
                <span className="text-lg">🏆</span>
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-red-600">Champion: </span>
                  <span className="font-bold text-gray-900">{championRecipe.name || championRecipe.title}</span>
                </div>
                <span className="px-2 py-1 text-xs font-bold uppercase tracking-wide bg-red-600 text-white">
                  →
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Search Results Indicator */}
      {searchTerm && (
        <div className="bg-gray-50 border-b-2 border-gray-200">
          <div className="max-w-3xl mx-auto px-6 py-3">
            <p className="text-sm">
              <span className="font-bold">{filteredCount}</span>
              <span className="text-gray-500"> {filteredCount === 1 ? 'recipe' : 'recipes'} throwing punches with </span>
              <span className="font-bold">"{searchTerm}"</span>
            </p>
          </div>
        </div>
      )}

      {/* Chapters */}
      <main className="max-w-3xl mx-auto px-6 py-8">
        {Object.entries(filteredChapters).map(([chapter, recipes], chapterIndex) => (
          <section key={chapter} className="mb-12">
            {/* Chapter Header */}
            <div className="flex items-baseline gap-4 mb-4 border-b-2 border-gray-900 pb-2">
              <span className="text-sm font-mono text-gray-400">
                {String(chapterIndex + 1).padStart(2, '0')}
              </span>
              <h2 className="text-2xl font-black uppercase tracking-tight text-gray-900">
                {chapter}
              </h2>
              <span className="text-xs text-gray-400 uppercase tracking-widest">
                {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'}
              </span>
            </div>

            {/* Recipe List */}
            <div className="space-y-0">
              {recipes.map((recipe, index) => {
                const recipeName = recipe.name || recipe.title || 'Untitled';
                
                return (
                  <div 
                    key={recipe.id || recipe.file_id || index}
                    onClick={() => setSelectedRecipe(recipe)}
                    className="group flex items-center gap-4 py-3 px-4 -mx-4 cursor-pointer hover:bg-gray-900 hover:text-white transition-colors"
                  >
                    <span className="text-xs font-mono text-gray-300 group-hover:text-gray-500 w-6">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1 font-medium">
                      {recipeName}
                    </span>
                    <span className="text-xs uppercase tracking-widest text-gray-400 group-hover:text-gray-400">
                      {recipe.cuisine_style || recipe.cuisine || ''}
                    </span>
                    <span className="text-gray-300 group-hover:text-white transition-colors">
                      →
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        {Object.keys(filteredChapters).length === 0 && (
          <div className="text-center py-16">
            <p className="text-6xl mb-4">🥊</p>
            <p className="text-gray-900 font-bold text-xl mb-2">No knockout found</p>
            <p className="text-gray-400 uppercase tracking-widest text-sm">Try a different punch</p>
          </div>
        )}
      </main>

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedRecipe(null)}
        >
          <div 
            className="bg-white p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
              {selectedRecipe.cuisine_style || selectedRecipe.cuisine || selectedRecipe.category || ''}
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-4">
              {selectedRecipe.name || selectedRecipe.title}
            </h3>

            <div className="flex gap-3">
              <button 
                onClick={() => openRecipe(selectedRecipe)}
                className="flex-1 px-6 py-3 text-sm font-bold bg-gray-900 text-white hover:bg-gray-700 transition-colors uppercase tracking-wide"
              >
                View Full Recipe →
              </button>
              <button 
                onClick={() => setSelectedRecipe(null)}
                className="px-6 py-3 text-sm font-bold border-2 border-gray-200 text-gray-500 hover:border-gray-900 hover:text-gray-900 transition-colors uppercase tracking-wide"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t-2 border-gray-200 mt-16">
        <div className="max-w-3xl mx-auto px-6 py-8 text-center">
          <p className="text-xs uppercase tracking-widest text-gray-400">
            Brooklyn Food Fight © {new Date().getFullYear()} — Where Every Meal is a Main Event
          </p>
        </div>
      </footer>
    </div>
  );
};

export default BrooklynFoodFight;