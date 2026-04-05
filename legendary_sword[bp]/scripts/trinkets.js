import {
    world,
    system,
    TicksPerSecond
} from '@minecraft/server';

const CHECK_INTERVAL = TicksPerSecond;

const SWORD_PATTERNS = [
    "minecraft:wooden_sword",
    "minecraft:stone_sword",
    "minecraft:copper_sword",
    "minecraft:iron_sword",
    "minecraft:golden_sword",
    "minecraft:diamond_sword",
    "minecraft:netherite_sword",
    "ls:blazing_sword",
    "ls:broken_sword_lv0",
    "ls:returning_sword_lv1",
    "ls:hero_sword_lv2",
    "ls:legendary_sword_lv3",
    "ls:xinghua_sword"
];

const REGISTERED_SWORDS = new Set(SWORD_PATTERNS);

function isSword(item) {
    if (!item) return false;

    const itemTypeId = item.typeId;
    if (!itemTypeId) return false;
    if (item.hasTag("is_sword")) return true;
    if (REGISTERED_SWORDS.has(itemTypeId)) return true;

    const lowerId = itemTypeId.toLowerCase();
    if (lowerId.includes("sword") && !lowerId.includes("swordfish")) return true;

    const swordSuffixes = ["_blade", "_katana", "_rapier", "_cutlass"];
    if (swordSuffixes.some(suffix => lowerId.endsWith(suffix))) return true;

    return false;
}

world.ls = {
    swordRegistry: {
        add: (id) => REGISTERED_SWORDS.add(id),
        remove: (id) => REGISTERED_SWORDS.delete(id),
        has: (id) => isSword({
            typeId: id,
            hasTag: () => false
        })
    }
};

system.runInterval(() => {
    const players = world.getAllPlayers();

    for (const player of players) {
        const equippable = player.getComponent("minecraft:equippable");
        if (!equippable) continue;
        const offhandItem = equippable.getEquipment('Offhand');
        if (!offhandItem) continue;

        const offhandTypeId = offhandItem.typeId;

        if (offhandTypeId === "ls:tear_hairpin") {
            player.addEffect("fire_resistance", 20, {
                amplifier: 0,
                showParticles: false
            });
        } else if (offhandTypeId === "ls:winecontaining_gourd") {
            player.addEffect("nausea", 15 * 20, {
                amplifier: 0,
                showParticles: false
            });
            player.addEffect("strength", 20, {
                amplifier: 1,
                showParticles: false
            });
        } else if (offhandTypeId === "ls:sword_talisman") {
            const mainhandItem = equippable.getEquipment('Mainhand');
            if (mainhandItem && isSword(mainhandItem)) {
                player.addEffect("strength", 20, {
                    amplifier: 0,
                    showParticles: false
                });
            }
        }
    }
}, CHECK_INTERVAL);