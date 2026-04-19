import { world, system, ItemStack } from "@minecraft/server";
import { ActionFormData, ActionFormResponse, MessageFormData, MessageFormResponse } from "@minecraft/server-ui";

const TaskData = [
{
  chapter_id: 1,
  chapter_name: "ls.text.task_group.minecraft",
  chapter_introduction: "ls.text.task_group_introduction.minecraft",
  tasks:[
    {
      task_id: 1,
      task_name: "ls.text.task.crafting_table",
      task_introduction: "ls.text.task_introduction.crafting_table",
      requirement: {
        get_all_items:[{
          item_id: "minecraft:crafting_table",
          count: 1
        }]
      },
      award: {
        get_items:[{
          item_id: "minecraft:bread",
          count: 3
        },
        {
          item_id: "legendary_sword:hopeful_coin",
          count: 4
        }],
        add_xp: 10
      }
    },
    {
      task_id: 2,
      task_name: "ls.text.task.torch",
      task_introduction: "ls.text.task_introduction.torch",
      requirement: {
        get_any_items:[{
          item_id: "minecraft:torch",
          count: 4
        },
        {
          item_id: "minecraft:soul_torch",
          count: 1
        },
        {
          item_id: "minecraft:copper_torch",
          count: 1
        }]
      },
      award: {
        get_items:[{
          item_id: "minecraft:torch",
          count: 6
        },
        {
          item_id: "legendary_sword:hopeful_coin",
          count: 3
        }],
        add_xp: 10
      }
    },
    {
      task_id: 3,
      task_name: "ls.text.task.stone_pickaxe",
      task_introduction: "ls.text.task_introduction.stone_pickaxe",
      requirement: {
        get_all_items:[{
          item_id: "minecraft:stone_pickaxe",
          count: 1
        }]
      },
      award: {
        get_items:[{
          item_id: "minecraft:torch",
          count: 8
        },
        {
          item_id: "legendary_sword:hopeful_coin",
          count: 3
        }],
        add_xp: 10
      }
    },
    {
      task_id: 4,
      task_name: "ls.text.task.iron_pickaxe",
      task_introduction: "ls.text.task_introduction.iron_pickaxe",
      requirement: {
        get_all_items:[{
          item_id: "minecraft:iron_pickaxe",
          count: 1
        }]
      },
      award: {
        get_items:[{
          item_id: "minecraft:coal",
          count: 6
        },
        {
          item_id: "legendary_sword:hopeful_coin",
          count: 5
        }],
        add_xp: 15
      }
    },
    {
      task_id: 5,
      task_name: "ls.text.task.water_bucket",
      task_introduction: "ls.text.task_introduction.water_bucket",
      requirement: {
        get_all_items:[{
          item_id: "minecraft:water_bucket",
          count: 1
        }]
      },
      award: {
        get_items:[{
          item_id: "minecraft:bread",
          count: 3
        },
        {
          item_id: "legendary_sword:hopeful_coin",
          count: 2
        }],
        add_xp: 10
      }
    },
    {
      task_id: 6,
      task_name: "ls.text.task.diamond",
      task_introduction: "ls.text.task_introduction.diamond",
      requirement: {
        get_all_items:[{
          item_id: "minecraft:diamond",
          count: 2
        }]
      },
      award: {
        get_items:[{
          item_id: "minecraft:diamond",
          count: 3
        },
        {
          item_id: "legendary_sword:hopeful_coin",
          count: 5
        }],
        add_xp: 25
      }
    },
    {
      task_id: 7,
      task_name: "ls.text.task.legendary_nugget",
      task_introduction: "ls.text.task_introduction.legendary_nugget",
      requirement: {
        get_all_items:[{
          item_id: "legendary_sword:legendary_nugget",
          count: 1
        }]
      },
      award: {
        get_items:[{
          item_id: "minecraft:iron_ingot",
          count: 5
        },
        {
          item_id: "legendary_sword:hopeful_coin",
          count: 8
        }],
        add_xp: 30
      }
    }
  ]
},
{
  chapter_id: 2,
  chapter_name: "ls.text.task_group.explore",
  chapter_introduction: "ls.text.task_group_introduction.explore",
  tasks:[
   {
      task_id: 8,
      task_name: "ls.text.task.obsidian",
      task_introduction: "ls.text.task_introduction.obsidian",
      requirement: {
        get_all_items:[{
          item_id: "minecraft:obsidian",
          count: 1
        }]
      },
      award: {
        get_items:[{
          item_id: "minecraft:iron_ingot",
          count: 4
        },
        {
          item_id: "legendary_sword:hopeful_coin",
          count: 4
        }],
        add_xp: 25
      }
    },
    {
      task_id: 9,
      task_name: "ls.text.task.coin",
      task_introduction: "ls.text.task_introduction.coin",
      requirement: {
        get_all_items:[{
          item_id: "minecraft:emerald",
          count: 3
        },
        {
          item_id: "legendary_sword:hopeful_coin",
          count: 15
        }]
      },
      award: {
        get_items:[
        {
          item_id: "legendary_sword:hopeful_coin",
          count: 5
        }],
        add_xp: 20
      }
    }
  ]
}]

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function giveItem(player,typeId,count){
  const inventory=player.getComponent("minecraft:inventory").container;
  let item=new ItemStack(typeId,count);
  let availableSlot=[]
  for(let i=1;i<inventory.size;i++){
    let itemInSlot=inventory.getItem(i);
    if(itemInSlot==undefined){
      availableSlot.push(i);
    }
    else if(itemInSlot.typeId==typeId&&itemInSlot.amount+count<=itemInSlot.maxAmount){
      availableSlot.push(i);
    }
  }
  if(availableSlot.length!=0){
    inventory.addItem(item);
  }
  else{
    let dimension=player.dimension;
    let location={x:player.location.x,y:player.location.y+1,z:player.location.z};
    dimension.spawnItem(item,location);
  }
}

function showTasksIndex(player){
  let tasksIndexPage=new ActionFormData();
  tasksIndexPage.title("%ls.text.tasksIndexTitle");
  tasksIndexPage.body("%ls.text.tasksIndex");
  const length=TaskData.length;
  for(let i=0;i<length;i++){
    let chapterName=TaskData[i].chapter_name;
    tasksIndexPage.button(`%${chapterName}`);
  };
  tasksIndexPage.show(player).then((response)=>{
    if (response.canceled) return;
    let chapter=TaskData[response.selection];
    showChapterTaskList(chapter,player);
  });
}

function showChapterTaskList(chapter,player){
  let chapterTaskList=chapter.tasks;
  let chapterTaskListPage=new ActionFormData();
  chapterTaskListPage.title(`%${chapter.chapter_name}`);
  chapterTaskListPage.body(`%${chapter.chapter_introduction}`);
  const length=chapterTaskList.length;
  chapterTaskListPage.button(`%ls.text.return_to_all_chapters`)
  for(let i=0;i<length;i++){
    let taskName=chapterTaskList[i].task_name;
    const taskId=chapterTaskList[i].task_id;
    const isTaskFinished=player.hasTag(`ls:completed_task.${taskId}`);
    const isAwardClaimed=player.hasTag(`ls:claimed_award.${taskId}`);
    if (isTaskFinished&&isAwardClaimed) chapterTaskListPage.button({rawtext:[{translate:"ls.text.task_finished_name",with:{rawtext:[{translate:`%${taskName}`}]}}]},`textures/ui/tasks/task_${taskId}`)
    else if (isTaskFinished&&!isAwardClaimed) chapterTaskListPage.button({rawtext:[{translate:"ls.text.claim_award_name",with:{rawtext:[{translate:`%${taskName}`}]}}]},`textures/ui/tasks/task_${taskId}`)
    else chapterTaskListPage.button(`%${taskName}`,`textures/ui/tasks/task_${taskId}`)
  };
  chapterTaskListPage.show(player).then((response)=>{
    if(response.canceled) return;
    if(response.selection==0){
      showTasksIndex(player)
    }
    else{
      let task=chapterTaskList[response.selection-1]
      showTask(chapter,task,player);
    }
  });
}

function showTask(chapter,task,player){
  let taskPage = new MessageFormData();
  const requirements=task.requirement;
  const award=task.award;
  const taskId=task.task_id;
  const isTaskFinished=player.hasTag(`ls:completed_task.${taskId}`);
  const isAwardClaimed=player.hasTag(`ls:claimed_award.${taskId}`);
  taskPage.title(`%${task.task_name}`)
  let taskBody={
    rawtext:[
      {translate: `${task.task_introduction}`},
      {text: "\n\n"}
    ]
  }
  if(isTaskFinished) taskBody.rawtext.push({translate: "ls.text.task_finished"})
  else{
    taskBody.rawtext.push({translate: "ls.text.task.requirements"})
    if(requirements.get_all_items){
      taskBody.rawtext.push({text: "\n"})
      taskBody.rawtext.push({translate: "ls.text.task.requirements.all_items"})
      for(let i=0;i<requirements.get_all_items.length;i++){
        taskBody.rawtext.push({translate: "ls.text.task.requirements.all_items_display",with:{rawtext:[{translate:`item.${requirements.get_all_items[i].item_id}`},{text:`${requirements.get_all_items[i].count.toString()}`}]}})
      }
    }
    if(requirements.get_any_items){
      taskBody.rawtext.push({text: "\n"})
      taskBody.rawtext.push({translate: "ls.text.task.requirements.any_items"})
      for(let i=0;i<requirements.get_any_items.length;i++){
        taskBody.rawtext.push({translate: "ls.text.task.requirements.any_items_display",with:{rawtext:[{translate:`item.${requirements.get_any_items[i].item_id}`},{text:`${requirements.get_any_items[i].count.toString()}`}]}})
      }
    }
  };
  if(isAwardClaimed) taskBody.rawtext.push({text: "\n"},{translate: "ls.text.award_claimed"})
  else{
    taskBody.rawtext.push({text: "\n"},{translate: "ls.text.task.award"},{text: "\n"})
    if(award.get_items){
      for(let i=0;i<award.get_items.length;i++){
        taskBody.rawtext.push({translate: "ls.text.task.award.items_display",with:{rawtext:[{translate:`item.${award.get_items[i].item_id}`},{text:`${award.get_items[i].count.toString()}`}]}})
      }
    }
    if(award.add_xp){
      taskBody.rawtext.push({translate: "ls.text.task.award.add_xp",with:{rawtext:[{text:`${award.add_xp.toString()}`}]}})
    }
  };
  taskPage.body(taskBody);
  taskPage.button1("%ls.text.ruturn_to_tasks_chapter");
  if(isTaskFinished&&isAwardClaimed){
    taskPage.button2("%ls.text.task_finished_button");
  }
  else if(isTaskFinished&&!isAwardClaimed){
    taskPage.button2("%ls.text.claim_award_button");
  }
  else taskPage.button2("%ls.text.submit_task");
  taskPage.show(player).then((response)=>{
    if (response.canceled) return;
    if(isTaskFinished&&isAwardClaimed||response.selection==0){
      showChapterTaskList(chapter,player);
    }
    else if(isTaskFinished&&!isAwardClaimed){
      giveAward(player,task);
      showChapterTaskList(chapter,player);
    }
    else{
      let event=checkTasks(task,player,true);
      if(event) showChapterTaskList(chapter,player);
    }
  })
}

function checkTasks(task,player,autoClaimAward){
  const inventory=player.getComponent("minecraft:inventory").container;
  const requirements=task.requirement;
  const taskId=task.task_id;
  const taskName=task.task_name;
  const playerName=player.name;
  let meet_all_items=false;
  let meet_any_items=false;
  if(requirements.get_all_items){
    let meet_requirements_all_item=[]
    for(let i=0;i<requirements.get_all_items.length;i++){
      let require_item=requirements.get_all_items[i].item_id;
      let require_amount=requirements.get_all_items[i].count;
      let amount=0;
      for(let i=1;i<inventory.size;i++){
        let itemInSlot=inventory.getItem(i);
        if(itemInSlot!==undefined&&itemInSlot.typeId==require_item) amount+=itemInSlot.amount;
      }
      if(amount>=require_amount) meet_requirements_all_item.push(require_item);
    }
    if(meet_requirements_all_item.length==requirements.get_all_items.length) meet_all_items=true;
  }
  else meet_all_items=true;
  if(requirements.get_any_items){
    let meet_requirements_any_item=[]
    for(let i=0;i<requirements.get_any_items.length;i++){
      let require_item=requirements.get_any_items[i].item_id;
      let require_amount=requirements.get_any_items[i].count;
      let amount=0;
      for(let i=1;i<inventory.size;i++){
        let itemInSlot=inventory.getItem(i);
        if(itemInSlot!==undefined&&itemInSlot.typeId==require_item) amount+=itemInSlot.amount;
      }
      if(amount>=require_amount) meet_requirements_any_item.push(require_item);
    }
    if(meet_requirements_any_item.length>0) meet_any_items=true;
  }
  else meet_any_items=true;
  if(meet_any_items&&meet_all_items){
    player.addTag(`ls:completed_task.${taskId}`)
    if(autoClaimAward) giveAward(player,task);
    world.sendMessage({rawtext:[{translate:"ls.text.finish_task_broadcast",with:{rawtext:[{text:`${playerName}`},{translate:taskName}]}}]})
    return true;
  }
  else{
    player.sendMessage("%ls.text.unfinish_task");
    return false;
  }
}

function giveAward(player,task){
  const inventory=player.getComponent("minecraft:inventory").container;
  const award=task.award;
  const taskId=task.task_id;
  player.addTag(`ls:claimed_award.${taskId}`)
  if(award.get_items){
    for(let i=0;i<award.get_items.length;i++){
      let typeId=award.get_items[i].item_id;
      let count=award.get_items[i].count;
      giveItem(player,typeId,count)
    }
  }
  if(award.add_xp){
    let xp=award.add_xp;
    player.addExperience(xp)
  }
}

world.afterEvents.itemUse.subscribe((event)=>{
  const player=event.source;
  const itemStack=event.itemStack;
  if(itemStack.typeId=="legendary_sword:forgotten_book"){
    showTasksIndex(player)
  }
})