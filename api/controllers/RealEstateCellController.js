/**
 * RealEstateCellController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 * @type {{ [name: string]: import('express').RequestHandler }}
 */

module.exports = {
    home: async function (req, res) {
        var models = await RealEstateCell.find({
            where: { highlighted: true },
            sort: 'updatedAt DESC',
            limit: 4,
        });

        // console.log(req.session.role);

        return res.view('RealEstate/home', { estateCell: models });
    },

    search: async function (req, res) {
        if (req.method == "GET") {
            const qPage = Math.max(req.query.page - 1, 0) || 0;
            const numOfItemsPerPage = 2;

            if (req.query.searchBody != undefined) {
                var model = req.query.searchBody

                // console.log("area_min: "+parseInt(model.area_min) + " area_max: "+parseInt(model.area_max));
                // console.log("rent_min: "+parseInt(model.rent_min)+ " rent_max: "+ parseInt(model.rent_max));

                // console.log(model);

                var selection = []
                if (model.estate != "Select estate here" && model.estate != undefined) {
                    selection.push({ estate: { contains: model.estate } });
                }
                if (model.bedrooms != "" && model.bedrooms != undefined) {
                    selection.push({ bedrooms: parseInt(model.bedrooms) });
                }
                if (model.area_min != undefined && model.area_max != undefined) {
                    if (model.area_min != "" && model.area_max != "" && parseInt(model.area_max) > parseInt(model.area_min)) {
                        selection.push({ grossArea: { ">=": parseInt(model.area_min), "<=": parseInt(model.area_max) } });
                    }
                }
                if (model.rent_min != undefined && model.rent_max != undefined) {
                    if (model.rent_min != "" && model.rent_max != "" && parseInt(model.rent_max) > parseInt(model.rent_min)) {
                        selection.push({ rent: { ">=": parseInt(model.rent_min), "<=": parseInt(model.rent_max) } });
                    }
                }

                // console.log(selection);

                var items_count = await RealEstateCell.count({
                    where: {
                        and: selection
                    },
                });

                var items = await RealEstateCell.find({
                    where: {
                        and: selection
                        // [
                        //     { estate: { contains: model.estate } },
                        //     { bedrooms: parseInt(model.bedrooms) },
                        //     { grossArea: { ">=": parseInt(model.area_min), "<=": parseInt(model.area_max) } },
                        //     { rent: { ">=": parseInt(model.rent_min), "<=": parseInt(model.rent_max) } },
                        // ]
                    },
                    limit: numOfItemsPerPage,
                    skip: numOfItemsPerPage * qPage
                });

                var searchText = req.originalUrl.split('?')[1];

                var regexp = new RegExp(/page=(\d+)&/);
                var newtext = "&" + searchText.replace(regexp, "");

                var numOfPage = Math.ceil(await items_count / numOfItemsPerPage);

                // console.log("items: " + items_count);
                // console.log(searchText);
                // console.log(newtext);

            } else {
                // console.log("no query");
                var items = await RealEstateCell.find({
                    limit: numOfItemsPerPage,
                    skip: numOfItemsPerPage * qPage
                });
                var newtext = "";

                var numOfPage = Math.ceil(await RealEstateCell.count() / numOfItemsPerPage);

            }

            return res.view('RealEstate/search', { models: items, count: numOfPage, searchText: newtext });
        }
        return res.badRequest("Wrong Method.");
    },

    create: async function (req, res) {
        if (req.method == "GET") {
            return res.view('RealEstate/create');
        }
        // console.log(req.body);
        if (!req.body)
            return res.badRequest("Form-data not received.");

        var model = req.body;
        if (!model.highlighted) {
            model.highlighted = false;
        } else {
            model.highlighted = true;
        }
        // console.log(model);

        await RealEstateCell.create(model);

        return res.ok("Successfully created!");
    },

    admin: async function (req, res) {
        var items = await RealEstateCell.find();
        return res.view('RealEstate/admin', { models: items });
    },

    update: async function (req, res) {
        if (req.method == "GET") {
            var item = await RealEstateCell.findOne(req.query.id);
            return res.view('RealEstate/update', { model: item });

        } else {
            if (!req.body) {
                return res.badRequest("Form-data not received.");
            }

            // console.log(req.body);
            var model = req.body;
            if (!model.highlighted) {
                model.highlighted = false;
            } else {
                model.highlighted = true;
            }

            var models = await RealEstateCell.update(req.query.id).set({
                title: model.title,
                imageURL: model.imageURL,
                estate: model.estate,
                bedrooms: model.bedrooms,
                grossArea: model.grossArea,
                expectedTenants: model.tenants,
                rent: model.rent,
                highlighted: model.highlighted,

            }).fetch();

            if (models.length == 0) return res.notFound();

            return res.ok("Record updated");
        }
    },

    delete: async function (req, res) {
        if (req.method == "GET") return res.forbidden();

        var models = await RealEstateCell.destroy(req.query.id).fetch();

        if (models.length == 0) return res.notFound();

        return res.ok("Restate Cell Deleted.");
    },

    detail: async function (req, res) {
        var item = await RealEstateCell.findOne(req.query.id).populate("rented");
        item.available_Tenants = item.expectedTenants - item.rented.length;
        // console.log(item);
        res.view('RealEstate/detail', { model: item });
    },

    search_items: async function (req, res) {
        if (req.method == "POST") {
            var model = req.body
            console.log(model);

            var selection = []
            if (model.estate != undefined) {
                selection.push({ estate: { contains: model.estate } });
            }
            if (model.bedrooms != "" && model.bedrooms != undefined) {
                selection.push({ bedrooms: parseInt(model.bedrooms) });
            }
            // console.log(selection);

            var items = await RealEstateCell.find({
                where: {
                    and: selection
                },
            });

            res.json(items);

        } else {
            res.json(RealEstateCell.json());
        }
    },

    rentStatus: async function (req, res) {
        if (req.method == "GET") {
            // console.log("rentStatus query: "+req.query);

            userId = parseInt(req.query.userId);
            if(userId==undefined || isNaN(userId)){ 
                userId = req.session.userid 
            };
            // console.log("rentStatus userId: "+userId);
            if (!await User.findOne(userId)) {
                return res.status(401).send("user not found");
            }

            estateId = parseInt(req.query.estateId);
            // console.log("rentStatus estateId: "+estateId);
            if (!await RealEstateCell.findOne(estateId)) {
                return res.status(401).send("estate not found");
            }

            const thatUser = await User.findOne(userId).populate("rent", { id: estateId });

            if (thatUser.rent.length) {
                return res.send("Rented");
            } else {
                return res.send("unRented");
            }
        }
        return res.forbidden();
    },

    add_rent: async function (req, res) {
        if (req.method == "GET") return res.forbidden();

        console.log(req.body);

        userId = parseInt(req.body.userId);
        if(userId==undefined || isNaN(userId)){ 
            userId = req.session.userid 
        };
        console.log("add_rent userId: "+userId);
        if (!await User.findOne(userId)) {
            return res.status(401).send("user not found");
        }

        estateId = parseInt(req.body.estateId)
        console.log("add_rent estateId: "+estateId);
        if (!await RealEstateCell.findOne(estateId)) {
            return res.status(401).send("estate not found");
        }

        const thatUser = await User.findOne(userId).populate("rent", { id: estateId });

        if (thatUser.rent.length) {
            return res.send("Allready Rented");
        }

        var thatEstate = await RealEstateCell.findOne(estateId).populate("rented");
        available_Tenants = thatEstate.expectedTenants - thatEstate.rented.length;
        if (available_Tenants <= 0) {
            return res.send("Full");
        }

        await User.addToCollection(userId, "rent").members(estateId);
        return res.send('Operation completed.');
    },

    delete_rent: async function (req, res) {
        if (req.method == "GET") return res.forbidden();

        // console.log(req.body);

        // userId = parseInt(req.body.userId);
        userId = parseInt(req.params.userId);
        if(userId==undefined || isNaN(userId)){ 
            userId = req.session.userid 
        };
        if (!await User.findOne(userId)) {
            return res.status(401).send("user not found");
        }

        // estateId = parseInt(req.body.estateId)
        estateId = parseInt(req.params.estateId)
        if(estateId==undefined || isNaN(estateId)){
            estateId = parseInt(req.body.estateId);
        }
        if (!await RealEstateCell.findOne(estateId)) {
            return res.status(401).send("estate not found");
        }

        const thatUser = await User.findOne(userId).populate("rent", { id: estateId });

        if (!thatUser.rent.length) {
            return res.send("Nothing to delete.");
        }

        await User.removeFromCollection(userId, "rent").members(estateId);

        return res.ok('Operation completed.');
    },

    clientState: async function (req, res) {
        if (req.method == "GET") {
            // console.log(req.query);

            userId = parseInt(req.query.userId);
            if(userId==undefined || isNaN(userId)){ 
                userId = req.session.userid 
            };
            // console.log("clientState: "+userId);
            if (userId != undefined) {
                if (!await User.findOne(userId)) {
                    return res.status(401).send("user not found");
                }

                const thatUser = await User.findOne(userId).populate("rent");

                // console.log(thatUser);

                if (req.wantsJSON) {
                    return res.json(thatUser);    // for ajax request
                } else {
                    return res.view('RealEstate/myRental', { models: thatUser });           // for normal request
                }
            }
        }
        return res.forbidden();
    },

    estateState: async function (req, res) {
        if (req.method == "GET") {
            // console.log(req.query);

            estateId = parseInt(req.query.estateId)
            if (!await RealEstateCell.findOne(estateId)) {
                return res.status(401).send("estate not found");
            }

            const thatEstate = await RealEstateCell.findOne(estateId).populate("rented");

            // console.log(thatEstate.rented);

            if (req.wantsJSON) {
                return res.json(thatEstate);    // for ajax request
            } else {
                return res.view('RealEstate/occupant', { model: thatEstate });           // for normal request
            }
        }
        return res.forbidden();
    },
};

