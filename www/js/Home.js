function Home() {
{
    date_of_session: new Date(),
    photographer_id: "c7dd0a6f-fad9-4f37-abbc-1b4b9dc50f60",
    accommodation_provider: {
        name: "Joaquim Oliveira"
    },
    rent_as: "whole/room",
    typology: {
        type_code: "house/apartment/studio",
        accommodation_type_code: "residence/hotel/hostel/private",
        number_of_bedrooms: 3,
        number_of_bathrooms: 1,
        number_of_wc: 1,
        area: 100
    },
    rules: {
        pets_allowed: "yes/no/unknown",
        females_only: "yes/no/unknown",
        international_only: "yes/no/unknown",
        students_only: "yes/no/unknown",
        males_only: "yes/no/unknown",
        overnight_guests_allowed: "yes/no/unknown",
        smoking_allowed: "yes/no/unknown",
        postgraduates_only: "yes/no/unknown"
    },
    address: {
        city_code: "GB-london/PT-lisbon",
        street: "...",
        number: "923",
        extra: "8Âº esq",
        postal_code: "4450-016"
    },
    property_features: {
        accessibility: "yes/no/unknown",
        wi_fi: "yes/no/unknown",
        resident_landlord: "yes/no/unknown",
        cable_tv: "yes/no/unknown",
        central_heating: "yes/no/unknown",
        air_conditioning: "yes/no/unknown",
        outdoor_area: "yes/no/unknown",
        towels: "yes/no/unknown",
        bed_linen: "yes/no/unknown"
    },
    services: {
        cleaning: {
            periodicity: "none/monthly/fortnight/weekly/biweekly/triweekly/daily",
            type: "full/common"
        }
    },
    bills: {
        maximum: {
            capped: true,
            max: {
                amount: 12000,
                currency_code: "EUR"
            }
        },
        water: {
            included: false
        },
        electricity: {
            included: true
        },
        gas: {
            present: true,
            included: true
        },
        internet: {
            included: true
        }
    },
    conditions: {
        cancellation_policy: "flexible/moderate/strict/super-strict",
        minimum_nights: 90
    },
    rent: {
        base_price: {
            amount: 50000,
            currency_code: "EUR"
        },
        extra_after: 2,
        extra_per_person: {
            amount: 3000,
            currency_code: "EUR"
        },
        maximum_guests: 8
    },
    units: {
        kitchen: {
            area: 20,
            features: {
                chairs: "yes/no",
                window: "yes/no",
                balcony: "yes/no",
                fridge: "yes/no",
                freezer: "yes/no",
                stove: "yes/no",
                oven: "yes/no",
                microwave: "yes/no",
                washing_machine: "yes/no",
                dryer: "yes/no",
                dishwasher: "yes/no",
                dishes_cutlery: "yes/no",
                pots_pans: "yes/no",
                table: "yes/no"
            }
        },
        living_room: {
            area: 20,
            features: {
                desk: "yes/no",
                chairs: "yes/no",
                sofa: "yes/no",
                sofa_bed: "yes/no",
                window: "yes/no",
                balcony: "yes/no",
                coffee-table: "yes/no",
                table: "yes/no",
                tv: "yes/no"
            }
        },
        dining-room: {
            area: 20,
            features: {
                chairs: "yes/no",
                window: "yes/no",
                balcony: "yes/no",
                table: "yes/no",
                tv: "yes/no"
            }
        },
        bedrooms: [
            {
                area: 30,
                type: "single/double/twin/triple",
                features: {
                    wardrobe: "yes/no",
                    chest_of_drawers: "yes/no",
                    desk: "yes/no",
                    chairs: "yes/no",
                    sofa: "yes/no",
                    sofa_bed: "yes/no",
                    towels: "yes/no",
                    bed_linen: "yes/no",
                    window: "yes/no",
                    balcony: "yes/no",
                    tv: "yes/no",
                    lock: "yes/no"
                },
                rent: {
                    base_price: {
                        amount: 50000,
                        currency_code: "EUR"
                    },
                    extra_per_person: {
                        amount: 3000,
                        currency_code: "EUR"
                    },
                    maximum_guests: 2
                }
            },
            {
                area: 20,
                type: "triple",
                features: {
                    wardrobe: "yes/no",
                    chest-of-drawers: "yes/no",
                    desk: "yes/no",
                    chairs: "yes/no",
                    sofa: "yes/no",
                    sofa_bed: "yes/no",
                    towels: "yes/no",
                    bed_linen: "yes/no",
                    window: "yes/no",
                    balcony: "yes/no",
                    tv: "yes/no",
                    lock: "yes/no"
                },
                rent: {
                    base_price: {
                        amount: 55000,
                        currency_code: "EUR"
                    },
                    extra_per_person: {
                        amount: 3500,
                        currency_code: "EUR"
                    },
                    maximum_guests: 3
                }
            }
        ]
    }
}