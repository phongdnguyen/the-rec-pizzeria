'use strict';

let keystone = require('keystone');
let Types = keystone.Field.Types;

/**
 * Store Model
 * ==========
 */

let Store = new keystone.List('Store', {
    autokey: { path: 'slug', from: 'name', unique: true },
    track: true
});

Store.add({
    name: { type: Types.Text },
    address: { type: Types.Location, defaults: { country: 'USA' } },
    phone: { type: Types.Number },
    open: { type: Types.Html, wysiwyg: true},
});

Store.defaultColumns = 'name|20%, address, updatedAt';

Store.register();