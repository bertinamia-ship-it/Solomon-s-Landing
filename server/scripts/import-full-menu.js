#!/usr/bin/env node

/**
 * Script to import full menu (72 items) to database
 * Run: node scripts/import-full-menu.js
 */

const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../database/solomons.db');
const db = new Database(dbPath);

// Full menu data - 72 items
const menuItems = [
  // ========== BREAKFAST ==========
  // A FRESH START
  { category: 'A Fresh Start', name_en: 'Seasonal Fruit', name_es: 'Fruta de Temporada', description_en: 'Fresh seasonal fruit medley including papaya, pineapple, watermelon, and cantaloupe. Served with creamy Greek yogurt, house-made granola with honey and almonds. Garnished with fresh mint. Perfectly refreshing way to start your day.', description_es: 'Mezcla de frutas frescas de temporada incluyendo papaya, piña, sandía y melón. Servido con yogurt griego cremoso, granola casera con miel y almendras. Decorado con menta fresca. Manera perfecta y refrescante de comenzar tu día.', price: 210, cost: 60, prep_time: 5, calories: 320, allergens: 'dairy,nuts,gluten' },
  { category: 'A Fresh Start', name_en: 'Açaí Bowl', name_es: 'Bowl de Açaí', description_en: 'Antioxidant-rich açaí berry smoothie bowl blended with banana and almond milk. Topped with fresh mango chunks, strawberries, blueberries, sliced banana, crunchy pecans, toasted coconut flakes, chia seeds, and a drizzle of honey. Superfood power bowl packed with vitamins and omega-3s.', description_es: 'Bowl de smoothie de bayas de açaí rico en antioxidantes mezclado con plátano y leche de almendra. Cubierto con trozos de mango fresco, fresas, arándanos, plátano rebanado, nueces crujientes, hojuelas de coco tostado, semillas de chía y un toque de miel. Bowl super nutritivo lleno de vitaminas y omega-3.', price: 315, cost: 90, prep_time: 8, calories: 450, allergens: 'nuts', featured: 1 },
  { category: 'A Fresh Start', name_en: 'Avocado Toast', name_es: 'Tostada de Aguacate', description_en: 'Artisan multi-grain seeded bread toasted golden, spread with tangy light goat cheese. Topped with perfectly ripe avocado slices dressed with fresh lemon juice and sea salt, two perfectly poached organic eggs with runny yolks, toasted pepitas (pumpkin seeds), black sesame seeds, and microgreens. A nutritious and Instagram-worthy breakfast favorite.', description_es: 'Pan artesanal integral con semillas tostado dorado, untado con queso de cabra ligero. Cubierto con rebanadas de aguacate perfectamente maduro aliñado con jugo de limón fresco y sal de mar, dos huevos orgánicos pochados a la perfección con yema líquida, pepitas tostadas, ajonjolí negro y microgreens. Desayuno nutritivo favorito digno de Instagram.', price: 265, cost: 75, prep_time: 12, calories: 520, allergens: 'dairy,eggs,gluten,seeds' },
  
  // SOMETHING SWEET
  { category: 'Something Sweet', name_en: 'Pancakes', name_es: 'Hot Cakes', description_en: 'Stack of three fluffy buttermilk pancakes made from scratch, griddled to golden perfection. Served with clarified butter, authentic Canadian Grade A maple syrup, fresh seasonal berries (strawberries, blueberries, blackberries), and cloud-like homemade whipped cream with vanilla extract. Classic American breakfast comfort.', description_es: 'Torre de tres hot cakes esponjosos de suero de leche hechos desde cero, cocidos a la perfección dorada. Servidos con mantequilla clarificada, auténtico jarabe de maple canadiense Grado A, frutos rojos frescos de temporada (fresas, arándanos, moras), y crema batida casera suave como nube con extracto de vainilla. Clásico reconfortante desayuno americano.', price: 210, cost: 50, prep_time: 10, calories: 680, allergens: 'dairy,eggs,gluten' },
  { category: 'Something Sweet', name_en: 'Banana Pecan Pancakes', name_es: 'Hot Cakes de Plátano y Nuez', description_en: 'Buttermilk pancakes studded with toasted pecans and fresh banana slices cooked into the batter. Drizzled with clarified butter, topped with more caramelized banana slices, crunchy candied pecans, and pillowy homemade whipped cream. A nutty, tropical twist on a breakfast classic.', description_es: 'Hot cakes de suero de leche repletos de nueces tostadas y rebanadas de plátano fresco cocidos en la masa. Rociados con mantequilla clarificada, cubiertos con más rebanadas de plátano caramelizado, nueces confitadas crujientes y crema batida casera esponjosa. Un giro tropical y crujiente al clásico desayuno.', price: 220, cost: 55, prep_time: 12, calories: 820, allergens: 'dairy,eggs,gluten,nuts' },
  { category: 'Something Sweet', name_en: 'French Toast', name_es: 'Pan Francés', description_en: 'Thick-cut artisan brioche bread soaked in rich custard mixture of eggs, cream, vanilla, and cinnamon. Griddled until golden crispy outside and custardy inside. Dusted with powdered sugar, served with authentic Canadian maple syrup, fresh mixed berries, and homemade vanilla whipped cream.', description_es: 'Pan brioche artesanal de corte grueso empapado en mezcla rica de natilla con huevos, crema, vainilla y canela. Cocido hasta dorar crujiente por fuera y cremoso por dentro. Espolvoreado con azúcar glass, servido con auténtico jarabe de maple canadiense, frutos rojos mixtos frescos y crema batida de vainilla casera.', price: 210, cost: 50, prep_time: 10, calories: 720, allergens: 'dairy,eggs,gluten' },
  { category: 'Something Sweet', name_en: 'French Toast Stuffed', name_es: 'Pan Francés Relleno', description_en: 'AS SEEN ON FOOD NETWORK\'S DINERS, DRIVE-INS AND DIVES! Thick brioche slices stuffed with sweetened cream cheese filling, fresh strawberry compote, and banana slices. Battered in vanilla-cinnamon custard and grilled golden. Topped with more fresh strawberries, banana, berry compote, powdered sugar, and whipped cream. Our signature dish that Guy Fieri raved about!', description_es: '¡PRESENTADO EN DINERS, DRIVE-INS AND DIVES DE FOOD NETWORK! Rebanadas gruesas de brioche rellenas de queso crema endulzado, compota de fresa fresca y rebanadas de plátano. Rebozadas en natilla de vainilla y canela y asadas hasta dorar. Cubiertas con más fresas frescas, plátano, compota de frutos rojos, azúcar glass y crema batida. ¡Nuestro platillo estrella que Guy Fieri adoró!', price: 265, cost: 70, prep_time: 15, calories: 890, allergens: 'dairy,eggs,gluten', featured: 1 },
  { category: 'Something Sweet', name_en: 'Belgian Waffle', name_es: 'Waffle Belga', description_en: 'Authentic Belgian waffle made with yeast batter for extra lightness, cooked in a deep-grid waffle iron until perfectly crispy on the outside and fluffy inside. Deep pockets hold authentic Canadian maple syrup. Served with homemade vanilla whipped cream and fresh butter. Simple perfection.', description_es: 'Auténtico waffle belga hecho con masa de levadura para extra ligereza, cocido en plancha de waffle profunda hasta quedar perfectamente crujiente por fuera y esponjoso por dentro. Bolsillos profundos contienen jarabe de maple canadiense auténtico. Servido con crema batida de vainilla casera y mantequilla fresca. Perfección simple.', price: 210, cost: 50, prep_time: 10, calories: 650, allergens: 'dairy,eggs,gluten' },
  { category: 'Something Sweet', name_en: 'Solomons Waffle', name_es: 'Waffle Solomons', description_en: 'Crispy Belgian waffle topped with premium vanilla bean ice cream, fresh mixed berries (strawberries, blueberries, raspberries), and decadent warm hazelnut chocolate sauce (think Nutella but better). The perfect combination of warm, cold, crunchy, and creamy. A dessert-for-breakfast indulgence.', description_es: 'Waffle belga crujiente cubierto con helado premium de vainilla en rama, frutos rojos mixtos frescos (fresas, arándanos, frambuesas), y decadente salsa de chocolate avellana caliente (piensa Nutella pero mejor). La combinación perfecta de caliente, frío, crujiente y cremoso. Un capricho de postre para desayuno.', price: 265, cost: 70, prep_time: 12, calories: 920, allergens: 'dairy,eggs,gluten,nuts' },
  
  // CHEF'S SPECIALTIES
  { category: 'Chefs Specialties', name_en: 'Chilaquiles', name_es: 'Chilaquiles', description_en: 'Traditional Mexican breakfast featuring crispy fried corn tortilla chips simmered in your choice of tangy salsa verde (green tomatillo sauce) or rich salsa roja (red chile sauce) until slightly softened. Topped with crumbled queso fresco, Mexican crema, diced white onion, fresh cilantro, and two sunny-side-up eggs. Served with creamy refried beans and sliced avocado. Authentic flavors of Mexico.', description_es: 'Desayuno tradicional mexicano con totopos de maíz fritos crujientes bañados en tu elección de salsa verde (salsa de tomate verde) ácida o salsa roja (salsa de chile rojo) rica hasta suavizarse ligeramente. Cubiertos con queso fresco desmoronado, crema mexicana, cebolla blanca en cubos, cilantro fresco y dos huevos estrellados. Servido con frijoles refritos cremosos y aguacate rebanado. Sabores auténticos de México.', price: 230, cost: 55, prep_time: 12, calories: 580, allergens: 'dairy,eggs,gluten' },
  { category: 'Chefs Specialties', name_en: 'Barbacoa Burrito', name_es: 'Burrito de Barbacoa', description_en: 'Large flour tortilla generously filled with tender slow-braised beef barbacoa (marinated in chipotle, cumin, and Mexican spices for 8 hours), creamy pinto beans, melted Monterrey Jack cheese, fluffy scrambled eggs, fresh pico de gallo, and a touch of salsa verde. Grilled until golden and crispy outside. Served with side of guacamole, Mexican crema, and house-made salsa. Hearty breakfast that keeps you full for hours!', description_es: 'Tortilla de harina grande generosamente rellena con barbacoa de res tierna cocida lentamente (marinada en chipotle, comino y especias mexicanas por 8 horas), frijoles pintos cremosos, queso Monterrey Jack derretido, huevos revueltos esponjosos, pico de gallo fresco y un toque de salsa verde. Asado hasta dorar y quedar crujiente por fuera. Servido con guacamole, crema mexicana y salsa casera. ¡Desayuno abundante que te mantiene lleno por horas!', price: 290, cost: 85, prep_time: 15, calories: 920, allergens: 'dairy,eggs,gluten', featured: 1 },
  { category: 'Chefs Specialties', name_en: 'Barbacoa Sope', name_es: 'Sope de Barbacoa', description_en: 'Thick handmade corn masa sope (like a mini pizza with raised edges) griddled until crispy on bottom, spread with creamy refried beans, piled high with succulent slow-braised barbacoa beef, topped with two perfectly cooked eggs any style, tangy pickled red onions, crumbled queso fresco, fresh avocado slices, cilantro, and drizzle of Mexican crema. A rustic, authentic Mexican breakfast favorite.', description_es: 'Sope grueso de masa de maíz hecha a mano (como una mini pizza con bordes levantados) cocido hasta quedar crujiente en la base, untado con frijoles refritos cremosos, apilado alto con suculenta barbacoa de res cocida lentamente, cubierto con dos huevos perfectamente cocidos al gusto, cebolla roja encurtida ácida, queso fresco desmoronado, rebanadas de aguacate fresco, cilantro y toque de crema mexicana. Desayuno mexicano rústico y auténtico favorito.', price: 290, cost: 80, prep_time: 15, calories: 780, allergens: 'dairy,eggs,gluten' },
  
  // EGG DISHES
  { category: 'Egg Dishes', name_en: 'Eggs to Your Liking', name_es: 'Huevos al Gusto', description_en: 'Served with crispy hash browns made with avocado oil and refried beans', description_es: 'Servidos con papas hash browns crujientes hechas con aceite de aguacate y frijoles refritos', price: 190, cost: 45, prep_time: 8 },
  { category: 'Egg Dishes', name_en: 'Mediterranean Omelette', name_es: 'Omelette Mediterráneo', description_en: 'With onion, kalamata olives, cherry tomato, basil and goat cheese', description_es: 'Con cebolla, aceitunas kalamata, tomate cherry, albahaca y queso de cabra', price: 270, cost: 75, prep_time: 12 },
  { category: 'Egg Dishes', name_en: 'Green Fisherman', name_es: 'Pescador Verde', description_en: 'With spinach, mushroom, onion, Monterrey cheese, green sauce and avocado', description_es: 'Con espinaca, champiñones, cebolla, queso Monterrey, salsa verde y aguacate', price: 265, cost: 70, prep_time: 12 },
  { category: 'Egg Dishes', name_en: 'Italian Omelette', name_es: 'Omelette Italiano', description_en: 'Egg crepe stuffed with Monterrey cheese and Italian sausage in marinara sauce', description_es: 'Crepa de huevo rellena de queso Monterrey y salchicha italiana en salsa marinara', price: 270, cost: 75, prep_time: 12 },
  { category: 'Egg Dishes', name_en: 'The Baja Omelette', name_es: 'Omelette Baja', description_en: 'With bacon, chorizo, cheddar, mushrooms, onion, sour cream and avocado', description_es: 'Con tocino, chorizo, cheddar, champiñones, cebolla, crema ácida y aguacate', price: 300, cost: 90, prep_time: 15 },
  { category: 'Egg Dishes', name_en: 'Rancheros', name_es: 'Rancheros', description_en: 'Sunny side up eggs over pinto beans on lightly fried corn tortilla', description_es: 'Huevos estrellados sobre frijoles pintos en tortilla de maíz ligeramente frita', price: 245, cost: 60, prep_time: 10 },
  { category: 'Egg Dishes', name_en: 'Breakfast Fajitas', name_es: 'Fajitas de Desayuno', description_en: 'Two sunny-side-up eggs with flank steak, peppers, onion, tomato and avocado', description_es: 'Dos huevos estrellados con arrachera, pimientos, cebolla, tomate y aguacate', price: 310, cost: 95, prep_time: 15 },
  { category: 'Egg Dishes', name_en: 'Eggs Benedict', name_es: 'Huevos Benedictinos', description_en: 'Poached eggs and Canadian bacon on homemade English muffin with hollandaise sauce', description_es: 'Huevos pochados y tocino canadiense en muffin inglés casero con salsa holandesa', price: 300, cost: 85, prep_time: 15 },
  { category: 'Egg Dishes', name_en: 'Breakfast Sandwich', name_es: 'Sandwich de Desayuno', description_en: 'Homemade artisanal basil bread with chipotle dressing, arugula, sun-dried tomato', description_es: 'Pan artesanal de albahaca casero con aderezo de chipotle, arúgula, tomate seco', price: 310, cost: 90, prep_time: 12 },
  { category: 'Egg Dishes', name_en: 'Breakfast Burrito', name_es: 'Burrito de Desayuno', description_en: 'Eggs, bacon, jack cheese and potatoes with pico de gallo and guacamole', description_es: 'Huevos, tocino, queso jack y papas con pico de gallo y guacamole', price: 245, cost: 65, prep_time: 12 },
  
  // ========== LUNCH / COMIDA ==========
  // STARTERS
  { category: 'Starters', name_en: 'Guacamole', name_es: 'Guacamole', description_en: 'Served with pico de gallo and baked corn tortilla chips', description_es: 'Servido con pico de gallo y totopos horneados', price: 255, cost: 60, prep_time: 8 },
  { category: 'Starters', name_en: 'Seafood Guacamole', name_es: 'Guacamole de Mariscos', description_en: 'Guacamole with cooked shrimp, seared tuna and Magdalena Bay scallops', description_es: 'Guacamole con camarón cocido, atún sellado y callos de hacha de Bahía Magdalena', price: 385, cost: 140, prep_time: 15, featured: 1 },
  { category: 'Starters', name_en: 'Calamari', name_es: 'Calamares', description_en: 'Calamari steak strips sautéed crispy in panko with cocktail and marinara sauce', description_es: 'Tiras de filete de calamar salteadas crujientes en panko con salsa coctel y marinara', price: 255, cost: 80, prep_time: 12 },
  { category: 'Starters', name_en: 'Solomons Ceviche', name_es: 'Ceviche Solomons', description_en: 'Salmon, tuna and white fish in Mexican-Asian fusion sauce with mango, cucumber', description_es: 'Salmón, atún y pescado blanco en salsa fusión mexicana-asiática con mango, pepino', price: 335, cost: 120, prep_time: 15, featured: 1 },
  { category: 'Starters', name_en: 'Shrimp Cocktail', name_es: 'Cóctel de Camarón', description_en: 'Cooked shrimp with cocktail sauce, tomato, onion, cucumber and avocado', description_es: 'Camarón cocido con salsa coctel, tomate, cebolla, pepino y aguacate', price: 325, cost: 110, prep_time: 10 },
  { category: 'Starters', name_en: 'Tortilla Soup', name_es: 'Sopa de Tortilla', description_en: 'Traditional homemade tomato base with local cheese, avocado and sour cream', description_es: 'Base tradicional de tomate casera con queso local, aguacate y crema ácida', price: 190, cost: 45, prep_time: 8 },
  { category: 'Starters', name_en: 'Crab Cakes', name_es: 'Pastelitos de Cangrejo', description_en: 'Crab cakes in mango chipotle sauce with organic mixed salad', description_es: 'Pastelitos de cangrejo en salsa de mango chipotle con ensalada mixta orgánica', price: 365, cost: 140, prep_time: 15 },
  
  // SALADS
  { category: 'Salads', name_en: 'Caesar Salad', name_es: 'Ensalada César', description_en: 'Traditional homemade Caesar dressing with romaine lettuce and garlic bread', description_es: 'Aderezo César tradicional casero con lechuga romana y pan de ajo', price: 220, cost: 50, prep_time: 8 },
  { category: 'Salads', name_en: 'House Salad', name_es: 'Ensalada de la Casa', description_en: 'Mixed organic lettuce, avocado, grapes, orange, pistachios, gorgonzola', description_es: 'Lechuga orgánica mixta, aguacate, uvas, naranja, pistaches, gorgonzola', price: 250, cost: 65, prep_time: 8 },
  
  // BURGERS & PANINIS
  { category: 'Burgers', name_en: 'Classic Burger', name_es: 'Hamburguesa Clásica', description_en: '8 oz beef patty, cheddar, tomato, onion, lettuce, pickles', description_es: 'Hamburguesa de 8 oz, cheddar, tomate, cebolla, lechuga, pepinillos', price: 290, cost: 85, prep_time: 15 },
  { category: 'Burgers', name_en: 'Western Burger', name_es: 'Hamburguesa Western', description_en: '8 oz beef patty, cheddar, bacon, smoked BBQ sauce, breaded shallot rings', description_es: 'Hamburguesa de 8 oz, cheddar, tocino, salsa BBQ ahumada, aros de chalota', price: 315, cost: 95, prep_time: 15 },
  { category: 'Burgers', name_en: 'Tuna Burger', name_es: 'Hamburguesa de Atún', description_en: 'Fresh grilled tuna Cajun style with arugula, avocado, tomato, swiss cheese', description_es: 'Atún fresco a la parrilla estilo cajún con arúgula, aguacate, tomate, queso suizo', price: 400, cost: 145, prep_time: 15 },
  
  // MEXICAN SPECIALTIES
  { category: 'Mexican', name_en: 'Fish Tacos (3)', name_es: 'Tacos de Pescado (3)', description_en: 'Lightly crispy breaded fish on flour tortilla with coleslaw and chipotle dressing', description_es: 'Pescado empanizado ligeramente crujiente en tortilla de harina con col y aderezo chipotle', price: 255, cost: 75, prep_time: 12 },
  { category: 'Mexican', name_en: 'Shrimp Tacos (3)', name_es: 'Tacos de Camarón (3)', description_en: 'Lightly crispy breaded shrimp on flour tortilla with coleslaw and chipotle dressing', description_es: 'Camarón empanizado ligeramente crujiente en tortilla de harina con col', price: 265, cost: 80, prep_time: 12 },
  { category: 'Mexican', name_en: 'Signature Grilled Tacos (3)', name_es: 'Tacos a la Parrilla Firma (3)', description_en: 'Arrachera steak, Monterrey jack cheese and caramelized onion on handmade tortilla', description_es: 'Arrachera, queso Monterrey jack y cebolla caramelizada en tortilla hecha a mano', price: 365, cost: 120, prep_time: 15, featured: 1 },
  { category: 'Mexican', name_en: 'Chicken Fajitas', name_es: 'Fajitas de Pollo', description_en: 'Served in hot rock molcajete with cactus, panela cheese, peppers and onions', description_es: 'Servidas en molcajete de piedra caliente con nopal, queso panela, pimientos y cebolla', price: 335, cost: 95, prep_time: 18 },
  { category: 'Mexican', name_en: 'Shrimp Fajitas', name_es: 'Fajitas de Camarón', description_en: 'Served in hot rock molcajete with cactus, panela cheese, peppers and onions', description_es: 'Servidas en molcajete de piedra caliente con nopal, queso panela, pimientos y cebolla', price: 390, cost: 125, prep_time: 18 },
  { category: 'Mexican', name_en: 'Steak Fajitas', name_es: 'Fajitas de Arrachera', description_en: 'Served in hot rock molcajete with cactus, panela cheese, peppers and onions', description_es: 'Servidas en molcajete de piedra caliente con nopal, queso panela, pimientos y cebolla', price: 405, cost: 135, prep_time: 18 },
  
  // ========== DINNER / CENA ==========
  // STEAKS & RIBS
  { category: 'Steaks', name_en: 'Ribeye 16oz', name_es: 'Ribeye 16oz', description_en: 'Prime ribeye with local seasonal vegetables, toasted almonds, balsamic reduction', description_es: 'Ribeye premium con vegetales locales de temporada, almendras tostadas, reducción balsámica', price: 890, cost: 285, prep_time: 25, featured: 1 },
  { category: 'Steaks', name_en: 'New York 12oz', name_es: 'New York 12oz', description_en: 'Prime New York strip with local seasonal vegetables, toasted almonds', description_es: 'Corte New York premium con vegetales locales de temporada, almendras tostadas', price: 795, cost: 255, prep_time: 25 },
  { category: 'Steaks', name_en: 'Filet Mignon 8oz', name_es: 'Filete Mignon 8oz', description_en: 'Prime tenderloin with local seasonal vegetables and balsamic reduction', description_es: 'Lomo premium con vegetales locales de temporada y reducción balsámica', price: 750, cost: 240, prep_time: 25 },
  { category: 'Steaks', name_en: 'BBQ Pork Ribs', name_es: 'Costillas de Cerdo BBQ', description_en: 'Slow-cooked pork ribs with homemade BBQ sauce, sweet potato fries and coleslaw', description_es: 'Costillas de cerdo cocidas lentamente con salsa BBQ casera, papas de camote y col', price: 575, cost: 165, prep_time: 20 },
  { category: 'Steaks', name_en: 'Surf & Turf', name_es: 'Mar y Tierra', description_en: '8oz filet mignon and lobster tail with seasonal vegetables and balsamic reduction', description_es: 'Filete mignon de 8oz y cola de langosta con vegetales de temporada y reducción balsámica', price: 990, cost: 350, prep_time: 30, featured: 1 },
  
  // SEAFOOD
  { category: 'Seafood', name_en: 'Catch of the Day', name_es: 'Pesca del Día', description_en: 'Fresh catch with seasonal vegetables, toasted almonds and balsamic reduction', description_es: 'Pesca fresca con vegetales de temporada, almendras tostadas y reducción balsámica', price: 570, cost: 185, prep_time: 20 },
  { category: 'Seafood', name_en: 'Grilled Lobster Tail', name_es: 'Cola de Langosta a la Parrilla', description_en: 'Fresh lobster tail with herb butter and seasonal vegetables', description_es: 'Cola de langosta fresca con mantequilla de hierbas y vegetales de temporada', price: 695, cost: 245, prep_time: 22, featured: 1 },
  { category: 'Seafood', name_en: 'Coconut Shrimp', name_es: 'Camarones al Coco', description_en: 'Over apple compote with mango sauce and seasonal vegetables', description_es: 'Sobre compota de manzana con salsa de mango y vegetales de temporada', price: 575, cost: 175, prep_time: 18 },
  { category: 'Seafood', name_en: 'Seared Scallops', name_es: 'Callos de Hacha Sellados', description_en: 'Magdalena Bay scallops over risotto with seasonal vegetables', description_es: 'Callos de hacha de Bahía Magdalena sobre risotto con vegetales de temporada', price: 625, cost: 210, prep_time: 20 },
  
  // ========== BAR ==========
  // MARGARITAS
  { category: 'Margaritas', name_en: 'House Margarita', name_es: 'Margarita de la Casa', description_en: 'Tequila, triple sec, fresh lime juice, agave', description_es: 'Tequila, triple sec, jugo de limón fresco, agave', price: 140, cost: 30, prep_time: 3 },
  { category: 'Margaritas', name_en: 'Cadillac Margarita', name_es: 'Margarita Cadillac', description_en: 'Premium tequila, Cointreau, fresh lime juice, Grand Marnier float', description_es: 'Tequila premium, Cointreau, jugo de limón fresco, flotador de Grand Marnier', price: 240, cost: 60, prep_time: 4, featured: 1 },
  { category: 'Margaritas', name_en: 'Mango Margarita', name_es: 'Margarita de Mango', description_en: 'Tequila, fresh mango, triple sec, lime juice, agave', description_es: 'Tequila, mango fresco, triple sec, jugo de limón, agave', price: 165, cost: 38, prep_time: 4 },
  { category: 'Margaritas', name_en: 'Jalapeño Margarita', name_es: 'Margarita de Jalapeño', description_en: 'Tequila, fresh jalapeño, cucumber, lime juice, agave', description_es: 'Tequila, jalapeño fresco, pepino, jugo de limón, agave', price: 165, cost: 35, prep_time: 4 },
  
  // COCKTAILS
  { category: 'Cocktails', name_en: 'Mojito', name_es: 'Mojito', description_en: 'White rum, fresh mint, lime, sugar, soda water', description_es: 'Ron blanco, menta fresca, limón, azúcar, agua mineral', price: 145, cost: 32, prep_time: 4 },
  { category: 'Cocktails', name_en: 'Piña Colada', name_es: 'Piña Colada', description_en: 'Rum, coconut cream, fresh pineapple juice', description_es: 'Ron, crema de coco, jugo de piña fresco', price: 155, cost: 35, prep_time: 4 },
  { category: 'Cocktails', name_en: 'Paloma', name_es: 'Paloma', description_en: 'Tequila, fresh grapefruit juice, lime, grapefruit soda', description_es: 'Tequila, jugo de toronja fresco, limón, refresco de toronja', price: 145, cost: 30, prep_time: 3 },
  { category: 'Cocktails', name_en: 'Moscow Mule', name_es: 'Moscow Mule', description_en: 'Vodka, ginger beer, lime juice', description_es: 'Vodka, cerveza de jengibre, jugo de limón', price: 150, cost: 33, prep_time: 3 },
  
  // BEER
  { category: 'Beer', name_en: 'Draft Beer', name_es: 'Cerveza de Barril', description_en: 'Ask server for current selection', description_es: 'Pregunta al mesero por la selección actual', price: 85, cost: 20, prep_time: 1 },
  { category: 'Beer', name_en: 'Craft Beer Bottle', name_es: 'Cerveza Artesanal Botella', description_en: 'Local and international craft beers', description_es: 'Cervezas artesanales locales e internacionales', price: 105, cost: 28, prep_time: 1 },
  { category: 'Beer', name_en: 'Domestic Beer', name_es: 'Cerveza Nacional', description_en: 'Corona, Pacífico, Modelo, Tecate', description_es: 'Corona, Pacífico, Modelo, Tecate', price: 65, cost: 18, prep_time: 1 },
  
  // WINE
  { category: 'Wine', name_en: 'House Wine Glass', name_es: 'Vino de la Casa Copa', description_en: 'Red, White, or Rosé by the glass', description_es: 'Tinto, Blanco o Rosado por copa', price: 125, cost: 35, prep_time: 2 },
  { category: 'Wine', name_en: 'Premium Wine Glass', name_es: 'Vino Premium Copa', description_en: 'Ask server for wine list', description_es: 'Pregunta al mesero por la lista de vinos', price: 250, cost: 75, prep_time: 2 },
  
  // ========== SUSHI ==========
  // CLASSIC ROLLS
  { category: 'Classic Rolls', name_en: 'California Roll', name_es: 'Rollo California', description_en: 'Crab, avocado, cucumber, sesame seeds', description_es: 'Cangrejo, aguacate, pepino, ajonjolí', price: 185, cost: 50, prep_time: 10 },
  { category: 'Classic Rolls', name_en: 'Spicy Tuna Roll', name_es: 'Rollo de Atún Picante', description_en: 'Fresh tuna, spicy mayo, cucumber, scallions', description_es: 'Atún fresco, mayonesa picante, pepino, cebollín', price: 245, cost: 75, prep_time: 10 },
  { category: 'Classic Rolls', name_en: 'Philadelphia Roll', name_es: 'Rollo Filadelfia', description_en: 'Smoked salmon, cream cheese, avocado, cucumber', description_es: 'Salmón ahumado, queso crema, aguacate, pepino', price: 225, cost: 70, prep_time: 10 },
  { category: 'Classic Rolls', name_en: 'Salmon Avocado Roll', name_es: 'Rollo de Salmón y Aguacate', description_en: 'Fresh salmon, avocado, cucumber', description_es: 'Salmón fresco, aguacate, pepino', price: 235, cost: 72, prep_time: 10 },
  
  // SPECIALTY ROLLS
  { category: 'Specialty Rolls', name_en: 'Rainbow Roll', name_es: 'Rollo Arcoíris', description_en: 'California roll topped with tuna, salmon, yellowtail, shrimp, avocado', description_es: 'Rollo California cubierto con atún, salmón, jurel, camarón, aguacate', price: 325, cost: 110, prep_time: 15, featured: 1 },
  { category: 'Specialty Rolls', name_en: 'Dragon Roll', name_es: 'Rollo Dragón', description_en: 'Shrimp tempura, eel, avocado, unagi sauce, crispy flakes', description_es: 'Camarón tempura, anguila, aguacate, salsa unagi, hojuelas crujientes', price: 365, cost: 125, prep_time: 15 },
  { category: 'Specialty Rolls', name_en: 'Volcano Roll', name_es: 'Rollo Volcán', description_en: 'Spicy tuna, cream cheese, deep fried, topped with spicy mayo and eel sauce', description_es: 'Atún picante, queso crema, frito, cubierto con mayonesa picante y salsa de anguila', price: 295, cost: 95, prep_time: 12 },
  { category: 'Specialty Rolls', name_en: 'Solomons Special Roll', name_es: 'Rollo Especial Solomons', description_en: 'Shrimp tempura, crab, avocado, topped with seared tuna, spicy mayo, eel sauce', description_es: 'Camarón tempura, cangrejo, aguacate, cubierto con atún sellado, mayonesa picante', price: 385, cost: 135, prep_time: 15, featured: 1 },
  
  // SASHIMI & NIGIRI
  { category: 'Sashimi & Nigiri', name_en: 'Tuna Sashimi (5 pcs)', name_es: 'Sashimi de Atún (5 pzas)', description_en: 'Fresh sliced tuna', description_es: 'Atún fresco rebanado', price: 265, cost: 95, prep_time: 5 },
  { category: 'Sashimi & Nigiri', name_en: 'Salmon Sashimi (5 pcs)', name_es: 'Sashimi de Salmón (5 pzas)', description_en: 'Fresh sliced salmon', description_es: 'Salmón fresco rebanado', price: 255, cost: 90, prep_time: 5 },
  { category: 'Sashimi & Nigiri', name_en: 'Mixed Sashimi Platter', name_es: 'Plato Mixto de Sashimi', description_en: 'Chefs selection of fresh fish: tuna, salmon, yellowtail with wasabi and ginger', description_es: 'Selección del chef de pescado fresco: atún, salmón, jurel con wasabi y jengibre', price: 425, cost: 155, prep_time: 10 },
  { category: 'Sashimi & Nigiri', name_en: 'Nigiri Combo (8 pcs)', name_es: 'Combo Nigiri (8 pzas)', description_en: 'Chefs selection of nigiri sushi', description_es: 'Selección del chef de sushi nigiri', price: 345, cost: 120, prep_time: 8 }
];

console.log(`🍽️  Starting menu import...`);
console.log(`📊 Total items to import: ${menuItems.length}`);

const insert = db.prepare(`
  INSERT INTO menu_items (
    category_en, category_es, name_en, name_es, description_en, description_es,
    price, cost, prep_time, calories, allergens, available, featured
  ) VALUES (
    @category, @category, @name_en, @name_es, @description_en, @description_es,
    @price, @cost, @prep_time, @calories, @allergens, 1, @featured
  )
`);

let imported = 0;
let errors = 0;

for (const item of menuItems) {
  try {
    insert.run({
      category: item.category,
      name_en: item.name_en,
      name_es: item.name_es,
      description_en: item.description_en,
      description_es: item.description_es,
      price: item.price,
      cost: item.cost,
      prep_time: item.prep_time || 10,
      calories: item.calories || null,
      allergens: item.allergens || null,
      featured: item.featured || 0
    });
    imported++;
    process.stdout.write(`\r✅ Imported: ${imported}/${menuItems.length}`);
  } catch (error) {
    errors++;
    console.error(`\n❌ Error importing ${item.name_en}:`, error.message);
  }
}

console.log(`\n\n✨ Import complete!`);
console.log(`✅ Successfully imported: ${imported} items`);
console.log(`❌ Errors: ${errors}`);

// Show summary
const count = db.prepare('SELECT COUNT(*) as total FROM menu_items').get();
const categories = db.prepare('SELECT DISTINCT category_en FROM menu_items ORDER BY category_en').all();

console.log(`\n📊 Database Summary:`);
console.log(`   Total items in database: ${count.total}`);
console.log(`   Categories: ${categories.length}`);
categories.forEach(cat => console.log(`      - ${cat.category_en}`));

db.close();
console.log(`\n✅ Done!`);
