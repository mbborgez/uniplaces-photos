function loadData(home) {
    if(!home) { return;}
    var initialSection = new Section(home, "Overview", [
        new TextEntry("Photographer", propertie('photographer_id'), home),
        new TextEntry("Provider", propertie("accommodation_provider.name"), home),
        new OptionsEntry("Rent as", ["whole", "room"], propertie("rent_as"), home),
    ]);

    var typologySection = new Section(home, "Typology", [
        new OptionsEntry("Type", ["house", "apartment", "studio"], propertie('typology.type_code'), home),
        new OptionsEntry("Accomodation type", ["residence", "hotel", "hostel", "private"], propertie("typology.accommodation_type_code"), home),
        new NumberEntry("Number of bedrooms", propertie("typology.number_of_bedrooms"), home),
        new NumberEntry("Number of bathrooms", propertie("typology.number_of_bathrooms"), home),
        new NumberEntry("Number of wc", propertie("typology.number_of_wc"), home),
        new NumberEntry("Area", propertie("typology.area"), home)
    ]);

    var rules = new Section(home, "Rules", [
            new NullableBooleanEntry("Pets alowed", "rules.pets_allowed", home),
            new NullableBooleanEntry("females_only", "rules.females_only", home),
            new NullableBooleanEntry("international_only", "rules.international_only", home),
            new NullableBooleanEntry("students_only", "rules.students_only", home),
            new NullableBooleanEntry("males_only", "rules.males_only", home),
            new NullableBooleanEntry("overnight_guests_allowed", "rules.overnight_guests_allowed", home),
            new NullableBooleanEntry("smoking_allowed", "rules.smoking_allowed", home),
            new NullableBooleanEntry("postgraduates_only", "rules.postgraduates_only", home)
        ]);
    var address = new Section(home, "Address",  [
        new TextEntry("city_code", propertie('address.city_code'), home),
        new TextEntry("street", propertie('address.photographer_id'), home),
        new NumberEntry("number", propertie('address.number'), home),
        new TextEntry("extra", propertie('address.extra'), home),
        new TextEntry("postal_code", propertie('address.postal_code'), home)
    ]); 

    var property_features = new Section(home, "Property_Features", [
            new NullableBooleanEntry("accessibility", "property_features.accessibility", home),
            new NullableBooleanEntry("wi_fi", "property_features.females_only", home),
            new NullableBooleanEntry("resident_landlord", "property_features.international_only", home),
            new NullableBooleanEntry("students_only", "property_features.students_only", home),
            new NullableBooleanEntry("cable_tv", "property_features.cable_tv", home),
            new NullableBooleanEntry("central_heating", "property_features.central_heating", home),
            new NullableBooleanEntry("air_conditioning", "property_features.air_conditioning", home),
            new NullableBooleanEntry("towels", "property_features.towels", home),
            new NullableBooleanEntry("bed_linen", "property_features.bed_linen", home)
        ]);
    var services = new Section(home, "Services",  [
        new OptionsEntry("cleaning periodicity", ["none","monthly","fortnight","weekly","biweekly","triweekly","daily"], 'services.cleaning.periodicity', home),
        new OptionsEntry("cleaning type", ["common","full"], 'services.cleaning.type', home)
    ]);

    var bills = new Section(home, "bills",  [
        new BooleanEntry("bills maximum capped", 'bills.maximum.capped', home),
        new CurrencyEntry("bills currency_code", 'bills.maximum.max.currency_code', home),
        new BooleanEntry("bills water included", 'bills.water.included', home),
        new BooleanEntry("bills electricity included", 'bills.electricity.included', home),
        new BooleanEntry("bills gas present", 'bills.gas.present', home),
        new BooleanEntry("bills gas included", 'bills.gas.included', home),
        new BooleanEntry("bills internet included", 'bills.internet.included', home),
    ]);

    var conditions = new Section(home, "conditions", [
        new OptionsEntry("conditions cancellation_policy", ["flexible","moderate","strict","super_strict"], propertie('conditions.cancellation_policy'), home),
        new NumberEntry("conditions minimum_nights", propertie('conditions.minimum_nights'), home)
    ]);
    return [
        initialSection,
        typologySection,
        rules,
        address,
        property_features,
        services,
        bills,
        conditions
    ];
}
