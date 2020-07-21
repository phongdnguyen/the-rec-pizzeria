let keystone = require('keystone');

/**
 * ItemCategory Model
 * ==================
 */

let ItemCategory = new keystone.List('ItemCategory', {
    autokey: { from: 'name', path: 'key', unique: true },
    track: true
});

ItemCategory.add({
	name: { type: String, required: true, unique: true, index: true },
});

ItemCategory.relationship({ ref: 'Item', path: 'items', refPath: 'category' });

ItemCategory.register();
