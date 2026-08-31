// carbon_basin_cast.js — molten carbon -> coal block in the PMW casting basin
// Coal block melts down (productivemetalworks:melting/storage_blocks/coals.json)
// into 900 mB of productivemetalworks:molten_carbon, so 900 mB casts back to
// one minecraft:coal_block. Basin casting previously had no recipe for
// molten_carbon (pouring did nothing). Uses the same recipe type as the
// pack's own block casts (productivemetalworks:block_casting).
ServerEvents.recipes(event => {
  event.custom({
    type: 'productivemetalworks:block_casting',
    cast: [],
    consume_cast: false,
    fluid: {
      amount: 900,
      fluid: 'productivemetalworks:molten_carbon'
    },
    result: {
      count: 1,
      id: 'minecraft:coal_block'
    }
  })
})
