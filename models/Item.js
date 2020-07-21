let keystone = require('keystone');
let Types = keystone.Field.Types;

/**
 * Item Model
 * ==========
 */

let Item = new keystone.List('Item', {
    autokey: { path: 'slug', from: 'name', unique: true },
    track: true
});

// let storage = new keystone.Storage({
//     adapter: keystone.Storage.Adapters.FS,
//     schema: {
//         url: true,
//         originalname: true,
//     },
//     fs: {
//         path: 'public/images/item',
//         publicPath: '/images/item/'
//     }
// });

Item.add({
    name: { type: Types.Text, default: '', label: 'Item', initial: true, index: true, unique: true },
    onMenu: { type: Types.Boolean, default: false, label: 'Show on Menu' },
    photo: { type: Types.CloudinaryImages, autoCleanup: true, whenExists: 'retry', retryAttempts: 3 },
    description: { type: Types.Textarea, initial: false, height: 250 },
    // testPhoto: { type: Types.File, storage: storage },
    category: { type: Types.Relationship, ref: 'ItemCategory', many: false },
    ingredients: { type: Types.Relationship, ref: 'ItemIngredient', many: true },
    price: { type: Types.TextArray, required: true, initial: true, format: '$0,0.00' }
});

Item.defaultColumns = 'name|20%, category|25%, price|35%, onMenu|20%,';
Item.defaultSort = ['category', 'name'];

Item.register();

