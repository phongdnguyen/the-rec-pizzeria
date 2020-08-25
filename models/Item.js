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
    photo: { type: Types.CloudinaryImages, autoCleanup: true, whenExists: 'retry', retryAttempts: 3 },
    onMenu: { type: Types.Boolean, default: false, label: 'Show on Menu' },
    order: { type: Types.Number, format: '0', note: 'Use this to control the order the items show up on the menu.' },
    description: { type: Types.Textarea, initial: false },
    category: { type: Types.Relationship, ref: 'ItemCategory', many: false },
    ingredients: { type: Types.Relationship, ref: 'ItemIngredient', many: true },
    price: { type: Types.TextArray, required: true, initial: true, format: '$0,0.00' },
    // testPhoto: { type: Types.File, storage: storage },
});

Item.defaultColumns = 'name|35%, category|12%, price|20%, order|7%, onMenu|12%, updatedAt';
Item.defaultSort = ['category', 'order'];

Item.schema.pre('save', function (next) {
    this.order = Math.floor(this.order);
    next();
});

Item.register();

