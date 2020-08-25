'use strict';

let keystone = require('keystone');
let async = require('async');

exports = module.exports = function (req, res) {

    let view = new keystone.View(req, res);
    let locals = res.locals;

    if (!req.params.category) {
        req.params.category = 'pizza';
    }

    // Set locals
    locals.section = 'menu';
    locals.filters = {
        category: req.params.category
    };
    locals.data = {
        items: [],
        categories: [],
        filter: req.url.split('/')[2] || 'pizza'
    };

    // Load all categories
    view.on('init', function (next) {
        keystone.list('ItemCategory').model
            .find()
            .sort('order')
            .lean(true)
            .exec(function (err, results) {
                if (err || !results.length) {
                    return next(err);
                }

                locals.data.categories = results;

                async.each(locals.data.categories, function (category, next) {
                    keystone.list('Item').model
                        .count()
                        .where('category')
                        .in([category.id])
                        .exec(function (err, count) {
                            category.itemCount = count;
                            next(err);
                        });
                }, function (err) {
                    next(err);
                });
            });
        //#region Different approaches
        // keystone.list('Item').model
        //     .find({ onMenu: true })
        //     .populate([
        //         {
        //             path: 'ingredients',
        //             select: 'name description'
        //         },
        //         {
        //             path: 'category',
        //             select: 'name'
        //         }
        //     ])
        //     .select('name price ingredients category photo order')
        //     .lean(true)
        //     .exec(function (err, results) {
        //         let groupedMenu = [];

        //         // Group by 
        //         results.forEach(item => {
        //             let categoryInList = groupedMenu.find((value) => {
        //                 if (value.category.name === item.category.name) {
        //                     return true;
        //                 }
        //                 return false;
        //             });

        //             if (!categoryInList) {
        //                 groupedMenu.push(
        //                     {
        //                         category: item.category,
        //                         items: [item]
        //                     });
        //             } else {
        //                 let index = groupedMenu.findIndex((value, index) => {
        //                     if (value.category.name === item.category.name) {
        //                         return true;
        //                     }
        //                     return false;
        //                 });
        //                 groupedMenu[index].items.push(item);
        //             }
        //         });

        //         locals.data.menu = groupedMenu;
        //         return next();
        //     });

        // keystone.list('Item').model
        //     .aggregate()
        //     .project({
        //         _id: 1,
        //         name: 1,
        //         price: 1,
        //         ingredients: 1,
        //         category: 1,
        //         photo: 1,
        //         order: 1
        //     })
        //     .group({
        //         _id: '$category',
        //         items: {
        //             $addToSet: {
        //                 _id: '$_id',
        //                 name: '$name',
        //                 price: '$price',
        //                 ingredients: '$ingredients',
        //                 photo: '$photo',
        //                 order: '$order'
        //             }
        //         }
        //     })
        //     .exec(function (err, results) {
        //         locals.data.menu = results;
        //         return next();
        //     });
        //#endregion
    });

    // Load the current category filter
    view.on('init', function (next) {
        if (req.params.category) {
            keystone.list('ItemCategory').model
                .findOne({
                    key: locals.filters.category
                })
                .lean(true)
                .exec(function (err, results) {
                    locals.data.category = results;
                    next(err);
                });
        } else {
            next();
        }
    });

    view.on('init', function (next) {
        let query = keystone.list('Item').paginate({
            page: req.query.page || 1,
            perPage: 50,
            maxPages: 10,
            filters: {
                onMenu: true
            }
        })
            .sort({
                category: 1,
                order: 1
            })
            .populate([
                {
                    path: 'ingredients',
                    select: 'name description'
                },
                {
                    path: 'category',
                    select: 'name'
                }
            ])
            .lean(true);

        if (locals.data.category) {
            query.where('category').in([locals.data.category]);
        }

        query.exec(function (err, results) {
            locals.data.items = results;
            next(err);
        });
    });

    // Render the view
    view.render('menu');
};