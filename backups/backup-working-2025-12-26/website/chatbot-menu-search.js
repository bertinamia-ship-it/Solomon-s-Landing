/**
 * Smart Menu Search System for Solomon's Landing
 * Features:
 * - Accent normalization (búsqueda → busqueda)
 * - Typo tolerance
 * - Natural language understanding
 * - Allergen detection
 * - Nutritional information
 * - Ingredient search
 */

class MenuSearchSystem {
    constructor() {
        this.menuCache = null;
        this.lastFetch = null;
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    }

    /**
     * Normalize text for search (remove accents, lowercase, trim)
     */
    normalizeText(text) {
        if (!text) return '';
        
        return text
            .toLowerCase()
            .normalize('NFD') // Decompose characters
            .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
            .replace(/ñ/g, 'n')
            .replace(/[^a-z0-9\s]/g, ' ') // Remove special chars
            .replace(/\s+/g, ' ') // Normalize spaces
            .trim();
    }

    /**
     * Calculate similarity between two strings (Levenshtein distance)
     */
    calculateSimilarity(str1, str2) {
        const s1 = this.normalizeText(str1);
        const s2 = this.normalizeText(str2);
        
        const longer = s1.length > s2.length ? s1 : s2;
        const shorter = s1.length > s2.length ? s2 : s1;
        
        if (longer.length === 0) return 1.0;
        
        const editDistance = this.levenshteinDistance(longer, shorter);
        return (longer.length - editDistance) / longer.length;
    }

    /**
     * Levenshtein distance algorithm
     */
    levenshteinDistance(str1, str2) {
        const matrix = [];
        
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1, // substitution
                        matrix[i][j - 1] + 1,     // insertion
                        matrix[i - 1][j] + 1      // deletion
                    );
                }
            }
        }
        
        return matrix[str2.length][str1.length];
    }

    /**
     * Fetch menu from API with caching
     */
    async getMenu() {
        const now = Date.now();
        
        // Return cache if valid
        if (this.menuCache && this.lastFetch && (now - this.lastFetch < this.cacheTimeout)) {
            return this.menuCache;
        }
        
        try {
            // Check if API is available
            if (typeof API !== 'undefined' && API.menu) {
                const response = await API.menu.getAll();
                this.menuCache = response.items || response;
                this.lastFetch = now;
            } else {
                // Fallback to fetch if API not available
                const response = await fetch('http://localhost:3000/api/menu');
                const data = await response.json();
                this.menuCache = data.items || data;
                this.lastFetch = now;
            }
            
            return this.menuCache;
        } catch (error) {
            console.error('Error fetching menu:', error);
            return this.menuCache || []; // Return cache or empty array
        }
    }

    /**
     * Search menu items by query
     */
    async search(query, options = {}) {
        const {
            language = 'en',
            minScore = 0.4,
            maxResults = 10,
            includeAllergens = false,
            includeNutrition = false
        } = options;
        
        const menu = await this.getMenu();
        const normalizedQuery = this.normalizeText(query);
        const queryWords = normalizedQuery.split(' ').filter(w => w.length > 2);
        
        const results = menu.map(item => {
            const score = this.scoreItem(item, normalizedQuery, queryWords, language);
            return { item, score };
        })
        .filter(result => result.score > minScore)
        .sort((a, b) => b.score - a.score)
        .slice(0, maxResults);
        
        return results.map(r => this.formatResult(r.item, language, {
            includeAllergens,
            includeNutrition
        }));
    }

    /**
     * Score an item against query
     */
    scoreItem(item, normalizedQuery, queryWords, language) {
        let score = 0;
        
        const nameKey = language === 'es' ? 'name_es' : 'name_en';
        const descKey = language === 'es' ? 'description_es' : 'description_en';
        const categoryKey = language === 'es' ? 'category_es' : 'category_en';
        
        const normalizedName = this.normalizeText(item[nameKey]);
        const normalizedDesc = this.normalizeText(item[descKey] || '');
        const normalizedCat = this.normalizeText(item[categoryKey] || '');
        
        // Exact match in name (highest score)
        if (normalizedName.includes(normalizedQuery)) {
            score += 100;
        }
        
        // Partial match in name
        queryWords.forEach(word => {
            if (normalizedName.includes(word)) {
                score += 50;
            }
        });
        
        // Similarity score for name
        const nameSimilarity = this.calculateSimilarity(normalizedQuery, normalizedName);
        score += nameSimilarity * 40;
        
        // Match in description
        queryWords.forEach(word => {
            if (normalizedDesc.includes(word)) {
                score += 20;
            }
        });
        
        // Match in category
        queryWords.forEach(word => {
            if (normalizedCat.includes(word)) {
                score += 15;
            }
        });
        
        // Boost for featured items
        if (item.featured) {
            score *= 1.1;
        }
        
        return score;
    }

    /**
     * Format result for display
     */
    formatResult(item, language = 'en', options = {}) {
        const nameKey = language === 'es' ? 'name_es' : 'name_en';
        const descKey = language === 'es' ? 'description_es' : 'description_en';
        const categoryKey = language === 'es' ? 'category_es' : 'category_en';
        
        const result = {
            id: item.id,
            name: item[nameKey],
            description: item[descKey],
            category: item[categoryKey],
            price: item.price,
            prepTime: item.prep_time,
            featured: item.featured,
            available: item.available
        };
        
        if (options.includeNutrition && item.calories) {
            result.calories = item.calories;
        }
        
        if (options.includeAllergens && item.allergens) {
            result.allergens = this.parseAllergens(item.allergens, language);
        }
        
        return result;
    }

    /**
     * Parse allergens string into readable array
     */
    parseAllergens(allergensStr, language = 'en') {
        if (!allergensStr) return [];
        
        const allergenMap = {
            en: {
                dairy: 'Dairy',
                eggs: 'Eggs',
                fish: 'Fish',
                shellfish: 'Shellfish',
                nuts: 'Tree Nuts',
                peanuts: 'Peanuts',
                wheat: 'Wheat',
                gluten: 'Gluten',
                soy: 'Soy',
                seeds: 'Seeds'
            },
            es: {
                dairy: 'Lácteos',
                eggs: 'Huevos',
                fish: 'Pescado',
                shellfish: 'Mariscos',
                nuts: 'Nueces',
                peanuts: 'Cacahuates',
                wheat: 'Trigo',
                gluten: 'Gluten',
                soy: 'Soya',
                seeds: 'Semillas'
            }
        };
        
        return allergensStr.split(',')
            .map(a => a.trim())
            .map(a => allergenMap[language][a] || a)
            .filter(Boolean);
    }

    /**
     * Search by allergen (find items WITHOUT this allergen)
     */
    async searchByAllergen(allergen, language = 'en') {
        const menu = await this.getMenu();
        const normalizedAllergen = this.normalizeText(allergen);
        
        return menu.filter(item => {
            if (!item.allergens) return true; // No allergens listed = safe
            const itemAllergens = this.normalizeText(item.allergens);
            return !itemAllergens.includes(normalizedAllergen);
        }).map(item => this.formatResult(item, language, { includeAllergens: true }));
    }

    /**
     * Search by category
     */
    async searchByCategory(category, language = 'en') {
        const menu = await this.getMenu();
        const normalizedCategory = this.normalizeText(category);
        
        return menu.filter(item => {
            const categoryKey = language === 'es' ? 'category_es' : 'category_en';
            const itemCategory = this.normalizeText(item[categoryKey]);
            return itemCategory.includes(normalizedCategory);
        }).map(item => this.formatResult(item, language));
    }

    /**
     * Get featured items
     */
    async getFeatured(language = 'en') {
        const menu = await this.getMenu();
        return menu.filter(item => item.featured)
            .map(item => this.formatResult(item, language, {
                includeNutrition: true,
                includeAllergens: true
            }));
    }

    /**
     * Search by price range
     */
    async searchByPrice(minPrice, maxPrice, language = 'en') {
        const menu = await this.getMenu();
        return menu.filter(item => {
            const price = parseFloat(item.price);
            return price >= minPrice && price <= maxPrice;
        }).map(item => this.formatResult(item, language));
    }

    /**
     * Natural language query understanding
     */
    async naturalLanguageSearch(query, language = 'en') {
        const normalized = this.normalizeText(query);
        
        // Detect allergen queries
        const allergenKeywords = {
            en: ['allergy', 'allergic', 'without', 'no', 'free'],
            es: ['alergia', 'alergico', 'sin', 'libre']
        };
        
        const isAllergenQuery = allergenKeywords[language].some(kw => 
            normalized.includes(kw)
        );
        
        if (isAllergenQuery) {
            // Extract allergen type
            const allergens = ['dairy', 'lacteos', 'eggs', 'huevos', 'nuts', 'nueces', 
                             'gluten', 'shellfish', 'mariscos', 'fish', 'pescado'];
            const foundAllergen = allergens.find(a => normalized.includes(this.normalizeText(a)));
            
            if (foundAllergen) {
                return {
                    type: 'allergen',
                    results: await this.searchByAllergen(foundAllergen, language)
                };
            }
        }
        
        // Detect price queries
        const priceMatch = normalized.match(/under|menos|below|(?:less than)|(?:menor que)\s*(\d+)/);
        if (priceMatch) {
            const maxPrice = parseInt(priceMatch[1]);
            return {
                type: 'price',
                results: await this.searchByPrice(0, maxPrice, language)
            };
        }
        
        // Detect category queries
        const categories = ['breakfast', 'desayuno', 'lunch', 'comida', 'dinner', 'cena', 
                          'sushi', 'drinks', 'bebidas', 'cocktails', 'cocteles'];
        const foundCategory = categories.find(c => normalized.includes(c));
        
        if (foundCategory) {
            return {
                type: 'category',
                results: await this.searchByCategory(foundCategory, language)
            };
        }
        
        // Detect "featured" or "popular" queries
        if (normalized.includes('popular') || normalized.includes('featured') || 
            normalized.includes('recommend') || normalized.includes('best') ||
            normalized.includes('favorito') || normalized.includes('recomienda') ||
            normalized.includes('mejor')) {
            return {
                type: 'featured',
                results: await this.getFeatured(language)
            };
        }
        
        // Default to text search
        return {
            type: 'search',
            results: await this.search(query, { 
                language, 
                includeAllergens: true,
                includeNutrition: true
            })
        };
    }

    /**
     * Format results as chatbot message
     */
    formatChatbotResponse(searchResult, language = 'en') {
        const { type, results } = searchResult;
        
        if (!results || results.length === 0) {
            return language === 'en' 
                ? "😔 Sorry, I couldn't find any dishes matching your search. Try asking about our menu categories, specific ingredients, or say 'show me featured items'."
                : "😔 Lo siento, no pude encontrar platillos que coincidan con tu búsqueda. Intenta preguntar sobre categorías del menú, ingredientes específicos, o di 'muéstrame platillos destacados'.";
        }
        
        let response = '';
        
        // Header based on type
        const headers = {
            en: {
                allergen: '🥗 Here are dishes safe for your allergy:',
                price: '💰 Here are dishes in your price range:',
                category: '📂 Here are dishes in this category:',
                featured: '⭐ Here are our featured dishes:',
                search: '🔍 Here\'s what I found:'
            },
            es: {
                allergen: '🥗 Aquí están platillos seguros para tu alergia:',
                price: '💰 Aquí están platillos en tu rango de precio:',
                category: '📂 Aquí están platillos en esta categoría:',
                featured: '⭐ Aquí están nuestros platillos destacados:',
                search: '🔍 Esto es lo que encontré:'
            }
        };
        
        response += headers[language][type] + '\n\n';
        
        // Format each result
        results.slice(0, 5).forEach((item, index) => {
            response += `${index + 1}. **${item.name}** ${item.featured ? '⭐' : ''}\n`;
            response += `   ${item.description.substring(0, 150)}${item.description.length > 150 ? '...' : ''}\n`;
            response += `   💵 $${item.price} MXN`;
            
            if (item.calories) {
                response += ` | 🔥 ${item.calories} cal`;
            }
            
            if (item.prepTime) {
                response += ` | ⏱️ ${item.prepTime} min`;
            }
            
            response += '\n';
            
            if (item.allergens && item.allergens.length > 0) {
                response += `   ⚠️ ${language === 'en' ? 'Contains' : 'Contiene'}: ${item.allergens.join(', ')}\n`;
            }
            
            response += '\n';
        });
        
        if (results.length > 5) {
            response += language === 'en'
                ? `\n_...and ${results.length - 5} more dishes. Ask me to see more!_`
                : `\n_...y ${results.length - 5} platillos más. ¡Pídeme ver más!_`;
        }
        
        return response;
    }

    /**
     * Get personalized recommendations based on user preferences
     */
    async getSmartRecommendations(userPreferences = {}) {
        const menu = await this.getMenu();
        const {
            avoidAllergens = [],
            maxCalories = null,
            maxPrice = null,
            preferredCategories = [],
            dietaryPreference = null // 'vegetarian', 'vegan', 'low-carb', 'high-protein'
        } = userPreferences;

        let filtered = [...menu];

        // Filter by allergens
        if (avoidAllergens.length > 0) {
            filtered = filtered.filter(item => {
                if (!item.allergens) return true;
                const itemAllergens = item.allergens.split(',').map(a => a.trim().toLowerCase());
                return !avoidAllergens.some(avoid => 
                    itemAllergens.includes(avoid.toLowerCase())
                );
            });
        }

        // Filter by calories
        if (maxCalories) {
            filtered = filtered.filter(item => 
                !item.calories || item.calories <= maxCalories
            );
        }

        // Filter by price
        if (maxPrice) {
            filtered = filtered.filter(item => item.price <= maxPrice);
        }

        // Filter by dietary preferences
        if (dietaryPreference) {
            filtered = filtered.filter(item => {
                const desc = this.normalizeText(item.description_en + ' ' + item.description_es);
                switch (dietaryPreference) {
                    case 'vegetarian':
                        return !desc.includes('meat') && !desc.includes('chicken') && 
                               !desc.includes('pork') && !desc.includes('beef') &&
                               !desc.includes('carne') && !desc.includes('pollo');
                    case 'vegan':
                        return !desc.includes('dairy') && !desc.includes('eggs') &&
                               !desc.includes('lacteos') && !desc.includes('huevo') &&
                               (!item.allergens || !item.allergens.includes('dairy'));
                    case 'low-carb':
                        return item.calories && item.calories < 500;
                    case 'high-protein':
                        return desc.includes('protein') || desc.includes('chicken') || 
                               desc.includes('beef') || desc.includes('proteina');
                    default:
                        return true;
                }
            });
        }

        // Boost preferred categories
        if (preferredCategories.length > 0) {
            filtered = filtered.map(item => ({
                ...item,
                score: preferredCategories.includes(item.category_en) ? 2 : 1
            }));
        }

        // Sort by featured, then score, then popularity
        filtered.sort((a, b) => {
            if (b.featured !== a.featured) return b.featured - a.featured;
            if (b.score !== a.score) return b.score - a.score;
            return 0;
        });

        return filtered.slice(0, 10);
    }

    /**
     * Generate AI-like recommendations with reasoning
     */
    async getRecommendationWithReason(userQuery, language = 'es') {
        const query = this.normalizeText(userQuery);
        let preferences = {};
        let reasons = [];

        // Detect preferences from query
        if (query.includes('sin lacteos') || query.includes('dairy free')) {
            preferences.avoidAllergens = ['dairy'];
            reasons.push(language === 'es' ? 'sin lácteos' : 'dairy-free');
        }

        if (query.includes('vegetariano') || query.includes('vegetarian')) {
            preferences.dietaryPreference = 'vegetarian';
            reasons.push(language === 'es' ? 'vegetariano' : 'vegetarian');
        }

        if (query.includes('saludable') || query.includes('healthy') || query.includes('light')) {
            preferences.maxCalories = 500;
            reasons.push(language === 'es' ? 'saludable' : 'healthy');
        }

        if (query.includes('economico') || query.includes('barato') || query.includes('cheap')) {
            preferences.maxPrice = 200;
            reasons.push(language === 'es' ? 'económico' : 'budget-friendly');
        }

        const recommendations = await this.getSmartRecommendations(preferences);

        let response = language === 'es' 
            ? `🤖 Recomendaciones personalizadas ${reasons.length > 0 ? '(' + reasons.join(', ') + ')' : ''}:\n\n`
            : `🤖 Personalized recommendations ${reasons.length > 0 ? '(' + reasons.join(', ') + ')' : ''}:\n\n`;

        recommendations.slice(0, 5).forEach((item, index) => {
            response += `${index + 1}. **${item.name}** ${item.featured ? '⭐' : ''}\n`;
            response += `   ${item.description.substring(0, 120)}...\n`;
            response += `   💵 $${item.price} MXN`;
            
            if (item.calories) {
                response += ` | 🔥 ${item.calories} cal`;
            }
            
            response += '\n\n';
        });

        return response;
    }
}

// Export for use in chatbot
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MenuSearchSystem;
}

// Make available globally
if (typeof window !== 'undefined') {
    window.MenuSearchSystem = MenuSearchSystem;
}
