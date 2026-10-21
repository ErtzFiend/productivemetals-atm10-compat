ServerEvents.recipes(event => {
    event.custom({
        type: 'mekanism:crushing',
        input: { item: 'farmersdelight:straw', count: 1 },
        output: { count: 3, id: 'mekanism:bio_fuel' },
    }).id('themilkfridge:mekanism/crushing/straw_to_bio_fuel')

    event.custom({
        type: 'mekanism:crushing',
        input: { item: 'farmersdelight:straw_bale', count: 1 },
        output: { count: 27, id: 'mekanism:bio_fuel' },
    }).id('themilkfridge:mekanism/crushing/straw_bale_to_bio_fuel')

    console.log('[ATM10 Straw Biofuel] registered straw=3 and straw_bale=27 Mekanism bio fuel recipes')
})
