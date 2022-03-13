import { world, BlockLocation} from "mojang-minecraft";
import chainMining             from '../lib/xboyTools/chainMining.js';
import chatEventA              from '../lib/xboyTools/chatEventA.js';
import tpsMspt                 from '../lib/xboyTools/tpsMspt.js';
//import fillAir                 from '../lib/xuniverse/xLand.js';
import  '../lib/xuniverse/xDungeon.js';
import Chunk_Boundary_Point    from '../lib/xpackage/chunkMath.js';
const overworld = world.getDimension("overworld");
const nether = world.getDimension("nether");
const the_end = world.getDimension("the end");
const nowTimeTemp    = new Date().getDate() +"日"+ new Date().getHours() +"时"+ new Date().getMinutes() +"分"+ new Date().getSeconds() +"秒"

world.events.blockBreak.subscribe(e => {

try{
 if(e.player.hasTag("chainMining")){
   //  e.player.runCommand(`title @s actionbar §e连锁成功`);
   let c = chainMining(e.brokenBlockPermutation.type.id, e.block, e.dimension, e.player)
     if(c>0){e.player.runCommand(`title @s actionbar §e连锁方块数量：${c+1}`);}
   }
}catch(err){console.error(err)}

});




world.events.tick.subscribe(i2 => {
tpsMspt()
try{
       overworld.runCommand(`execute @e[type=item,tag=!old_thing,rx=1,rxm=0] ~ ~ ~ scoreboard players add @p[r=8] "§3§l肝度" 1`)
}catch(err){
     //  overworld.runCommand(`me ${err}`)
}
try{
       overworld.runCommand(`tag @e[type=item,tag=!old_thing] add old_thing`)
}catch(err){

}
try{
       overworld.runCommand(`kill @e[type=item,tag=old_thing,rx=1,rxm=0,tag=xdungeon]`)
}catch(err){

}


})




world.events.itemUseOn.subscribe( i=> {

// let point1 = Chunk_Boundary_Point.Chunk_Boundary_Point_2D([i.blockLocation.x, i.blockLocation.z])
             // Chunk_Boundary_Point.Chunk_Boundary_Point_2D_Get_All(point1).map( xz =>{
            // i.source.runCommand(`particle minecraft:endrod ${0.001+xz[0]} ${i.blockLocation.y+1} ${0.001+xz[1]}`).statusMessage
            // i.source.runCommand(`particle minecraft:endrod ${0.001+xz[0]} ${i.blockLocation.y+2} ${0.001+xz[1]}`)
            // i.source.runCommand(`particle minecraft:endrod ${0.001+xz[0]} ${i.blockLocation.y+3} ${0.001+xz[1]}`)

// })

//  if(i.item.id=="minec
//如果玩家使用下界之星点击方块时,进入下面的分支
//         i.source.isSneaking
//如果玩家没有蹲着,则被点击的方块的坐标记为坐标一


})


world.events.beforeChat.subscribe(msg => {

let M = msg.message
// let itt = msg.sender.getComponent("inventory").container.getItem(1);
// msg.sender.runCommand("me "+ typeof itt.setLore(["hi~xboy"]))
// msg.sender.getComponent("inventory").container.setItem(+2,itt)

try{

//fillAir(msg.sender.location.x, [ 320, 224, 128, 32, -64 ], msg.sender.location.z, overworld)
}catch(err){msg.sender.runCommand("tell @a[tag=xboy] "+err)}

chatEventA(msg, M)

//console.warn("####CHAT",msg.sender.name, msg.sender.nameTag,"#",msg.message)

})


// ⬜⬜⬜🏿🏿🏿🏻🏻🏻🏻
// ⬜⬜🏿🏿🏾🏾🏿🏻🏻🏻
// ⬜⬜🏿🏼🏽🏽🏼🏻🏻🏻
// ⬜⬜🏾🏽🏽🏽🏽🏻🏻🏻
// ⬜⬜🏾🏼🏽🏽🏼🏻🏻🏻
// ⬜⬜⬜🏾🏼🏼🏼🏻🏻🏻
// ⬜⬜⬜🏽🏾🏾🏻🏻🏻🏻
// ⬜⬜⬜🏼🏼🏽🏻🏻🏻🏻
// ⬜🏿🏿🏿🏿🏼🏿🏿🏻🏻
// 🏿🏿🏿🏿🏿🏿🏿🏿🏿🏿​



