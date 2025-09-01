import { useState, useEffect, useMemo } from 'react'
import { Search, Filter, ChefHat, Clock, Globe2, Tag, Sparkles, X, Menu, ExternalLink } from 'lucide-react'
import recipeData from './recipe_database.json'

// Boxing glove emoji for fun
const GLOVE = "🥊"

function App() {
  const [recipes, setRecipes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedMethod, setSelectedMethod] = useState('all')
  const [selectedCuisine, setSelectedCuisine] = useState('all')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [featuredRecipe, setFeaturedRecipe] = useState(null)

  useEffect(() => {
    // Load recipes
    setRecipes(recipeData)
    
    // Set random featured recipe
    if (recipeData.length > 0) {
      const randomIndex = Math.floor(Math.random() * recipeData.length)
      setFeaturedRecipe(recipeData[randomIndex])
    }
  }, [])

  // Get unique categories, methods, and cuisines
  const categories = useMemo(() => {
    const cats = [...new Set(recipes.map(r => r.category))].filter(Boolean)
    return ['all', ...cats.sort()]
  }, [recipes])

  const methods = useMemo(() => {
    const meths = [...new Set(recipes.map(r => r.cooking_method))]
      .filter(m => m && m !== 'Unknown')
    return ['all', ...meths.sort()]
  }, [recipes])

  const cuisines = useMemo(() => {
    const cuis = [...new Set(recipes.map(r => r.cuisine_style))]
      .filter(c => c && c !== 'Unknown')
    return ['all', ...cuis.sort()]
  }, [recipes])

  // Filter recipes
  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      const matchesSearch = searchTerm === '' || 
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.ingredients?.some(ing => ing.toLowerCase().includes(searchTerm.toLowerCase())) ||
        recipe.content_preview?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory
      const matchesMethod = selectedMethod === 'all' || recipe.cooking_method === selectedMethod
      const matchesCuisine = selectedCuisine === 'all' || recipe.cuisine_style === selectedCuisine
      
      return matchesSearch && matchesCategory && matchesMethod && matchesCuisine
    })
  }, [recipes, searchTerm, selectedCategory, selectedMethod, selectedCuisine])

  // Get recipe counts by category
  const categoryCounts = useMemo(() => {
    const counts = {}
    recipes.forEach(recipe => {
      counts[recipe.category] = (counts[recipe.category] || 0) + 1
    })
    return counts
  }, [recipes])

  const openRecipeInDrive = (fileId) => {
    window.open(`https://drive.google.com/file/d/${fileId}/view`, '_blank')
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('all')
    setSelectedMethod('all')
    setSelectedCuisine('all')
  }

  const hasActiveFilters = searchTerm || selectedCategory !== 'all' || 
    selectedMethod !== 'all' || selectedCuisine !== 'all'

  return (
    <div className="min-h-screen bg-warm-white">
      {/* Header */}
      <header className="bg-iron-black text-white sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-2">
              <span className="text-3xl">{GLOVE}</span>
              <div>
                <h1 className="text-2xl md:text-3xl font-display tracking-wider">
                  BROOKLYN FOOD FIGHT
                </h1>
                <p className="text-xs text-fight-red uppercase tracking-widest">
                  Where Recipes Battle for Glory
                </p>
              </div>
              <span className="text-3xl transform scale-x-[-1]">{GLOVE}</span>
            </div>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden text-white hover:text-fight-red transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with Featured Recipe */}
      {featuredRecipe && !hasActiveFilters && (
        <section className="bg-gradient-to-r from-fight-red to-red-700 text-white py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl md:text-3xl font-display flex items-center gap-2">
                <Sparkles className="text-yellow-300" />
                Today's Champion Recipe
              </h2>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-6 hover:bg-white/20 transition-all cursor-pointer"
                 onClick={() => openRecipeInDrive(featuredRecipe.file_id)}>
              <h3 className="text-xl md:text-2xl font-bold mb-2">{featuredRecipe.name}</h3>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Tag size={16} /> {featuredRecipe.category}
                </span>
                {featuredRecipe.cooking_method !== 'Unknown' && (
                  <span className="flex items-center gap-1">
                    <ChefHat size={16} /> {featuredRecipe.cooking_method}
                  </span>
                )}
                {featuredRecipe.cuisine_style !== 'Unknown' && (
                  <span className="flex items-center gap-1">
                    <Globe2 size={16} /> {featuredRecipe.cuisine_style}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Search and Filters */}
      <section className="bg-white border-b sticky top-[76px] md:top-[84px] z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search recipes, ingredients, or techniques..."
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-fight-red focus:outline-none text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Buttons - Desktop */}
          <div className="hidden md:flex flex-wrap gap-3 items-center">
            <span className="flex items-center gap-1 text-gray-600 font-semibold">
              <Filter size={18} /> Filters:
            </span>
            
            <select 
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-fight-red focus:outline-none"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.slice(1).map(cat => (
                <option key={cat} value={cat}>
                  {cat} ({categoryCounts[cat] || 0})
                </option>
              ))}
            </select>

            <select 
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-fight-red focus:outline-none"
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
            >
              <option value="all">All Methods</option>
              {methods.slice(1).map(method => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>

            <select 
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-fight-red focus:outline-none"
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
            >
              <option value="all">All Cuisines</option>
              {cuisines.slice(1).map(cuisine => (
                <option key={cuisine} value={cuisine}>{cuisine}</option>
              ))}
            </select>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1"
              >
                <X size={16} /> Clear
              </button>
            )}

            <span className="ml-auto text-gray-600">
              {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''} found
            </span>
          </div>

          {/* Mobile Filters */}
          {mobileMenuOpen && (
            <div className="md:hidden space-y-3 mt-4 pb-2">
              <select 
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-fight-red focus:outline-none"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.slice(1).map(cat => (
                  <option key={cat} value={cat}>
                    {cat} ({categoryCounts[cat] || 0})
                  </option>
                ))}
              </select>

              <select 
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-fight-red focus:outline-none"
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
              >
                <option value="all">All Methods</option>
                {methods.slice(1).map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>

              <select 
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-fight-red focus:outline-none"
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
              >
                <option value="all">All Cuisines</option>
                {cuisines.slice(1).map(cuisine => (
                  <option key={cuisine} value={cuisine}>{cuisine}</option>
                ))}
              </select>

              <div className="flex justify-between items-center">
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1"
                  >
                    <X size={16} /> Clear
                  </button>
                )}
                <span className="text-gray-600 text-sm">
                  {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Recipe Grid */}
      <main className="container mx-auto px-4 py-8">
        {filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRecipes.map((recipe) => (
              <RecipeCard 
                key={recipe.file_id} 
                recipe={recipe} 
                onClick={() => openRecipeInDrive(recipe.file_id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-2xl text-gray-600 mb-4">No recipes found in this fight!</p>
            <p className="text-gray-500">Try adjusting your search or filters</p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 px-6 py-2 bg-fight-red text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-iron-black text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg font-display mb-2">BROOKLYN FOOD FIGHT</p>
          <p className="text-sm text-gray-400">
            {recipes.length} recipes ready to battle · Made with {GLOVE} in Brooklyn
          </p>
        </div>
      </footer>
    </div>
  )
}

// Recipe Card Component
function RecipeCard({ recipe, onClick }) {
  return (
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 border-transparent hover:border-fight-red transform hover:-translate-y-1"
      onClick={onClick}
    >
      {/* Card Header - Category Badge */}
      <div className="bg-gradient-to-r from-fight-red to-red-600 text-white px-4 py-2 rounded-t-lg">
        <p className="text-xs uppercase tracking-wider font-semibold flex items-center justify-between">
          <span>{recipe.category}</span>
          <ExternalLink size={14} className="opacity-70 group-hover:opacity-100" />
        </p>
      </div>

      {/* Card Body */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-iron-black mb-3 line-clamp-2 group-hover:text-fight-red transition-colors">
          {recipe.name}
        </h3>

        {/* Recipe Meta */}
        <div className="space-y-2 text-sm text-gray-600">
          {recipe.cooking_method && recipe.cooking_method !== 'Unknown' && (
            <div className="flex items-center gap-2">
              <ChefHat size={16} className="text-fight-red" />
              <span>{recipe.cooking_method}</span>
            </div>
          )}
          
          {recipe.cuisine_style && recipe.cuisine_style !== 'Unknown' && (
            <div className="flex items-center gap-2">
              <Globe2 size={16} className="text-herb-green" />
              <span>{recipe.cuisine_style}</span>
            </div>
          )}

          {recipe.prep_time && recipe.prep_time !== 'Unknown' && (
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-blue-500" />
              <span className="text-xs">{recipe.prep_time}</span>
            </div>
          )}
        </div>

        {/* Ingredients Preview */}
        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs text-gray-500 mb-1 font-semibold">Key Ingredients:</p>
            <p className="text-xs text-gray-600 line-clamp-2">
              {recipe.ingredients.slice(0, 3).join(' • ')}
            </p>
          </div>
        )}

        {/* File Type Badge */}
        <div className="mt-3 flex justify-between items-center">
          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
            {recipe.file_type}
          </span>
          <span className="text-xs text-fight-red group-hover:underline flex items-center gap-1">
            View Recipe <span className="group-hover:translate-x-1 transition-transform">→</span>
          </span>
        </div>
      </div>
    </div>
  )
}

export default App