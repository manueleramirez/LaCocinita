ALTER TABLE recipes_ingredients ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE menu_recipes ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE order_items ALTER COLUMN id SET DEFAULT gen_random_uuid();
