import { world, system } from "@minecraft/server";

const CONFIG = {
  blocks: ["ls:steve_doll", "ls:alex_doll", "ls:livia_redgear_doll", "ls:olivia_fieryn_doll", "ls:su_kuina_doll", "ls:lin_xinghua_doll", "ls:rex_anvil_doll", "ls:victor_nightbrew_doll", "ls:silas_frostborne_doll", "ls:jdingot_doll", "ls:kuluo_d_doll", "ls:kusanagi_sans_doll", "ls:luning39_doll", "ls:mccaptain5412_doll", "ls:mings9210_doll", "ls:slimedragon_doll", "ls:stonenugget_doll", "ls:wangxiaojin_doll", "ls:xiris_doll"],
  sound: "doll.break_click",
  volume: 1.0,
  pitch: 1.0
};

function isTargetDoll(blockId) {
  return CONFIG.blocks.includes(blockId);
}

function playDollSound(dimension, location) {
  dimension.playSound(CONFIG.sound, location, {
    volume: CONFIG.volume,
    pitch: CONFIG.pitch
  });
}

world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
  const { player, block } = event;
  if (!event.isFirstEvent) return;
  if (!isTargetDoll(block.typeId)) return;
  
  event.cancel = true;
  system.run(() => {
    playDollSound(player.dimension, block.location);
  });
});

world.afterEvents.playerBreakBlock.subscribe((event) => {
  const { block, player } = event;
  
  if (!isTargetDoll(block.typeId)) return;
  const loc = { x: block.location.x, y: block.location.y, z: block.location.z };
  const dim = player.dimension;
  
  system.run(() => {
    playDollSound(dim, loc);
  });
});
