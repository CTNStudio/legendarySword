import { system, world } from '@minecraft/server';

const where_it_starts = [
    'ls:record_where_it_starts'
];

world.beforeEvents.playerInteractWithBlock.subscribe(evd => {
    const { player, itemStack, block } = evd;

    if (block?.typeId !== 'minecraft:jukebox') return;
    if (player?.isSneaking) return;

    if (itemStack) {
        const recordPlayer = block.getComponent("minecraft:record_player");
        
        if (!recordPlayer) return;
        if (recordPlayer.isPlaying()) return;
        
        if (where_it_starts.includes(itemStack.typeId)) {
            system.run(() => {
                block.dimension.playSound("record.where_it_starts", block.location);
                player.runCommand(`title @a[r=10] actionbar §d正在播放： FREirc - 始生之墟`);
            });
        }
    }
});
world.beforeEvents.playerInteractWithBlock.subscribe(data => {
    const { block, player, isFirstEvent } = data;

    if (block?.typeId !== 'minecraft:jukebox') return;
    if (player?.isSneaking) return;

    const recordPlayer = block.getComponent("minecraft:record_player");
    if (!recordPlayer) return;

    const record = recordPlayer.getRecord();
    if (record?.typeId === 'ls:record_where_it_starts') {
        system.run(() => {
            player.runCommand(`stopsound @a record.where_it_starts`);
        });
    }
});
world.beforeEvents.playerBreakBlock.subscribe(data => {
    const { block, player } = data;
    
    if (block?.typeId !== 'minecraft:jukebox') return;
    if (player?.isSneaking) return;

    const recordPlayer = block.getComponent("minecraft:record_player");
    if (!recordPlayer) return;

    const record = recordPlayer.getRecord();
    if (record?.typeId === 'ls:record_where_it_starts') {
        system.run(() => {
            player.runCommand(`stopsound @a record.where_it_starts`);
        });
    }
});
