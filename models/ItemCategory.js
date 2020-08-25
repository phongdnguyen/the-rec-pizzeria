let keystone = require('keystone');
let Types = keystone.Field.Types;

/**
 * ItemCategory Model
 * ==================
 */

let ItemCategory = new keystone.List('ItemCategory', {
    autokey: { from: 'name', path: 'key', unique: true },
    track: true
});

ItemCategory.add({
    name: { type: String, required: true, unique: true, index: true, label: 'Category' },
    order: { type: Types.Number, format: '0', note: 'Use this to control the order the categories are listed.' },
    comment: { type: Types.Html, wysiwyg: true }
});

ItemCategory.relationship({ ref: 'Item', path: 'items', refPath: 'category' });
ItemCategory.defaultColumns = 'name|35%, order|7%, updatedAt';
ItemCategory.defaultSort = 'order';

ItemCategory.schema.pre('save', function (next) {
    this.order = Math.floor(this.order);
    next();
});

ItemCategory.register();
