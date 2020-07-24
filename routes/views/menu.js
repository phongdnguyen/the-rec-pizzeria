'use strict';

let keystone = require('keystone');
let Menu = keystone.list('Item');

exports = module.exports = function (req, res) {
    let view = new keystone.View(req, res);
    let locals = res.locals;

    // Set locals
    locals.section = 'menu';

    // Load the menu
    view.query('items', keystone.list('Item').model.find());

    // Render the view
    view.render('menu');
};