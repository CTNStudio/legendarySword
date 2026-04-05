import * as server from "@minecraft/server"

const world = server.world

world.afterEvents.entityHitEntity.subscribe(data => {
    let invi = data.damagingEntity.getComponent("inventory").container
    let items = invi?.getItem(data?.damagingEntity?.selectedSlotIndex)
    if (data.damagingEntity?.typeId == "minecraft:player" && items?.typeId == 'ls:blazing_sword') {
        data.hitEntity.setOnFire(6)
    }
})
