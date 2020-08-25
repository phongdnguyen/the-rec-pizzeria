let keystone = require('keystone');
let Types = keystone.Field.Types;

/**
 * ItemIngredient Model
 * ==================
 */

let ItemIngredient = new keystone.List('ItemIngredient', {
	autokey: { from: 'name', path: 'key', unique: true },
	track: true
});

ItemIngredient.add({
	name: { type: String, required: true, unique: true, index: true, label: 'Ingredient' },
	description: { type: Types.Textarea, max: 250 }
});

ItemIngredient.relationship({ ref: 'Item', path: 'items', refPath: 'ingredients' });
ItemIngredient.defaultColumns = 'name|35%, description, updatedAt';

ItemIngredient.register();