import Chunk_Boundary_Point from '../xpackage/chunkMath.js';
import { world } from "mojang-minecraft";
//############################################################################
//who
const overworld = world.getDimension("overworld");
const nether = world.getDimension("nether");
const the_end = world.getDimension("the end");

let FIX = 1.0;
world.events.beforeChat.subscribe(msg => {

   const {message} = msg
   if(message.startsWith("环境特效等级") == true){msg.cancel=true;FIX = +message.replace("环境特效等级","")}
})
const block_xboy_tool_xyzuvwIDw = function(x,y,z,u,v,w,block,data,who){
         const blocks = ["deepslate_bricks","deepslate_tiles", "cracked_deepslate_tiles"];
         if(blocks.some(b=>b==block)){
               let a = x > u ? x - u : (x == u ? 1 : u - x);
               let b = y > v ? y - v : (y == v ? 1 : v - y);
               let c = z > w ? z - w : (z == w ? 1 : w - z);
               function xb0y(xbay,xbry,xbdy,xbiy) {
                  // let FIX = 1.6;
                  for (let i = (a * b * c).toFixed(0); i >= 0; i--) {
                     let xboy = Math.random();
                     if (xboy < xbay*FIX && xboy > xbiy) {

                        let xa = x - Math.floor(Math.random() * (x - u));
                        let xb = y - Math.floor(Math.random() * (y - v));
                        let xc = z - Math.floor(Math.random() * (z - w));
                        //who.runCommand(`setblock ${a} ${b} ${c} ${xbry} 0`)
                        //我选择外包、                  
                        tickLineSetblockArray.push([xa, xb, xc, xbry, xbdy, who])

                     }
                  }
               }
            if(block=="deepslate_bricks" && data==0){
               xb0y(0.007,"glowstone",0,0)
               xb0y(0.005,"sealantern",0,0)
               xb0y(0.22,"cracked_deepslate_bricks",0,0)
               //xb0y(0.10,"barrier",0,0)
               xb0y(0.10,"air",0,0)
               xb0y(0.04,"deepslate_brick_slab",0,0)
               xb0y(0.04,"deepslate_brick_slab",1,0)
            }
            if(block=="deepslate_tiles"  && data==0){//floor
               xb0y(0.10, "deepslate_gold_ore",0,    0)
               xb0y(0.08, "deepslate_redstone_ore",0,    0)
               xb0y(0.22,"cracked_deepslate_tiles",0,0)
               xb0y(0.11, "polished_deepslate",0,    0)
               xb0y(0.11, "cobbled_deepslate",0,    0)
               xb0y(0.10,"barrier",0,0)
            }
            if(block=="cracked_deepslate_tiles" && data==0){
               xb0y(0.34,"deepslate_gold_ore",0,0)
               xb0y(0.34,"gold_block",0,        0)
            }
         }
}

var tickLineSetblockArray = [];
var tickLineSetblockFunct = function(x,y,z,block,data,who){
   //who.runCommand(`me DEBUG-tickLineSetblockFunct-${x} ${y} ${z} ${block} ${data}`)
   who.runCommand(`setblock ${x} ${y} ${z} ${block} ${data}`)
}


var tickLineReplaceArray = [];
var tickLineReplaceFunct = function (x,y,z,u,v,w,blockA,dataA,blockB,dataB,who){
      //who.runCommand(`me DBUG-tickLineReplaceFunct-${x} ${y} ${z} ${u} ${v} ${w} ${blockA} ${dataA} replace ${blockB} ${dataB}`);

      who.runCommand(`fill ${x} ${y} ${z} ${u} ${v} ${w} ${blockA} ${dataA} replace ${blockB} ${dataB}`);
      //u know,xboy is an adjective.so,let us xboy blocks.
      block_xboy_tool_xyzuvwIDw(x,y,z,u,v,w,blockA,dataA,who)
}



var tickLineFillArray = []
var tickLineFillFunct = function (x,y,z,u,v,w,block,data,who){
//who.runCommand(`me ${x} ${y} ${z} ${u} ${v} ${w} ${block} ${data} replace`);
who.runCommand(`fill ${x} ${y} ${z} ${u} ${v} ${w} ${block} ${data} replace`);

block_xboy_tool_xyzuvwIDw(x,y,z,u,v,w,block,data,who)

}

var tickLineCLEAR = function(){
      tickLineReplaceArray = [];
      tickLineFillArray    = [];
      tickLineSetblockArray= [];
}

//#1       北 N  z-   #2  @0
//         ^              @1
//         |              @2
//         |              @3
//         |              @4
//  《=====#=====》东 E X+ @5
//         |              @6
//         |              @7
//         |              @8
//         #              @9
//#4      难 S  z+    #3
//
//@_0_1_2_3_4_5_6_7_8_9_@
let tickTime = 0
let s = 0
let t = 0
world.events.tick.subscribe(i => {
tickTime++;

   if(tickTime>0){
   }
      tickTime--;
      try{
         if(tickLineFillArray.length > 0){ let l = tickLineFillArray[0];tickLineFillArray.shift(); tickLineFillFunct(l[0], l[1], l[2], l[3], l[4], l[5], l[6], l[7], l[8]);}//本来是pop来着
         if(tickLineFillArray.length > 0){ let l = tickLineFillArray[0];tickLineFillArray.shift(); tickLineFillFunct(l[0], l[1], l[2], l[3], l[4], l[5], l[6], l[7], l[8]);}//本来是pop来着
      //双核双die，效率更快
      }catch(err){
   //有报错憋着
   }

   try{
      if(tickLineReplaceArray.length > 0){ let l = tickLineReplaceArray[0];tickLineReplaceArray.shift(); tickLineReplaceFunct(l[0], l[1], l[2], l[3], l[4], l[5], l[6], l[7], l[8], l[9], l[10]);}
      if(tickLineReplaceArray.length > 0){ let l = tickLineReplaceArray[0];tickLineReplaceArray.shift(); tickLineReplaceFunct(l[0], l[1], l[2], l[3], l[4], l[5], l[6], l[7], l[8], l[9], l[10]);}
         //双核双die，效率更快
   }catch(err){
//console.log(err)
   }
   try{
      if(!tickLineFillArray.length && !tickLineReplaceArray.length && !!tickLineSetblockArray.length){
         for(let i = 64;i>0;i--){
            s++
         let l = tickLineSetblockArray.pop(); tickLineSetblockFunct(l[0], l[1], l[2], l[3], l[4], l[5]);
         }
      }
   }catch(err){}
   if(s!=t&&s){the_end.runCommand(`title @a[tag=xdungeon,rm=1] actionbar §e§l随机磨损块数量:§3${s}`);t=s}
   if(!tickLineSetblockArray.length){s=0}
})

const work_y_    = [ 320, 224, 128, 32, -64 ]
   
const chunk_fill_tool_xYzIDw  = function ( x, work_y, z, blockId, blockData, who){
   
   const xz1 = Chunk_Boundary_Point.x2D([x,z])
   const xz3 = [ xz1[0]+15, xz1[1]+15 ]
   for(let i = work_y.length-2;i>-1;i--){tickLineFillArray.push([ xz1[0] ,work_y[i+1] ,xz1[1] ,xz3[0] ,work_y[i] ,xz3[1] ,blockId ,blockData ,who ]);}
   
};

const aisle_fill_tool_xyzIDwm = function( x, y, z, blockId, blockData, who, mode){
   
   let xz1 = Chunk_Boundary_Point.x2D([x,z])
   let xz3 = [10000,10000]
   if(mode == "|"){
      tickLineFillArray.push([ xz1[0] ,y+1 ,xz1[1] ,xz1[0]+5 ,y+4 ,xz1[1] ,blockId ,blockData ,who ])
      tickLineFillArray.push([ xz1[0]+9 ,y+1 ,xz1[1] ,xz1[0]+15 ,y+4 ,xz1[1] ,blockId ,blockData ,who ])
      tickLineFillArray.push([ xz1[0] ,y+1 ,xz1[1]+15 ,xz1[0]+5 ,y+4 ,xz1[1]+15 ,blockId ,blockData ,who ])
      tickLineFillArray.push([ xz1[0]+9 ,y+1 ,xz1[1]+15 ,xz1[0]+15 ,y+4 ,xz1[1]+15 ,blockId ,blockData ,who ])

      xz1[0] += 6;
      xz3[0]  = xz1[0] + 3;
      xz3[1]  = xz1[1] + 15;
      
      tickLineFillArray.push([ xz1[0] ,y+1 ,xz1[1] ,xz1[0] ,y+4 ,xz3[1] ,blockId ,blockData ,who ])
      tickLineFillArray.push([ xz3[0] ,y+1 ,xz1[1] ,xz3[0] ,y+4 ,xz3[1] ,blockId ,blockData ,who ])
   };
   if(mode == "="){
      tickLineFillArray.push([ xz1[0] ,y+1 ,xz1[1] ,xz1[0] ,y+4 ,xz1[1]+5 ,blockId ,blockData ,who ])
      tickLineFillArray.push([ xz1[0] ,y+1 ,xz1[1]+9 ,xz1[0] ,y+4 ,xz1[1]+15 ,blockId ,blockData ,who ])
      tickLineFillArray.push([ xz1[0]+15 ,y+1 ,xz1[1] ,xz1[0]+15 ,y+4 ,xz1[1]+5 ,blockId ,blockData ,who ])
      tickLineFillArray.push([ xz1[0]+15 ,y+1 ,xz1[1]+9 ,xz1[0]+15 ,y+4 ,xz1[1]+15 ,blockId ,blockData ,who ])
      
      xz1[1] += 6;
      xz3[1]  = xz1[1] + 3;
      xz3[0]  = xz1[0] + 15;
      
      tickLineFillArray.push([ xz1[0] ,y+1 ,xz1[1] ,xz3[0] ,y+4 ,xz1[1] ,blockId ,blockData ,who ])
      tickLineFillArray.push([ xz1[0] ,y+1 ,xz3[1] ,xz3[0] ,y+4 ,xz3[1] ,blockId ,blockData ,who ])
   };
   //who.runCommand(`me ${xz1[0]} ${y} ${xz1[1]} ${xz3[0]} ${y} ${xz3[1]} `)
   tickLineFillArray.push([ xz1[0] ,y ,xz1[1] ,xz3[0] ,y ,xz3[1] ,blockId ,blockData ,who ])
   
}

const wall_fill_tool_xyzIDw = function (x, y, z, blockId, blockData, who, mode){

   let xz1 = Chunk_Boundary_Point.x2D([x,z])
   
   if(mode == 0){tickLineFillArray.push([ xz1[0]-1 ,y+1 ,xz1[1] ,xz1[0]-1 ,y+4 ,xz1[1]+15 ,blockId ,blockData ,who ]);}
   if(mode == 1){tickLineFillArray.push([ xz1[0] ,y+1 ,xz1[1]-1 ,xz1[0]+15 ,y+4 ,xz1[1]-1 ,blockId ,blockData ,who ]);}
   if(mode == 2){tickLineFillArray.push([ xz1[0]+16 ,y+1 ,xz1[1] ,xz1[0]+16 ,y+4 ,xz1[1]+15 ,blockId ,blockData ,who ]);}
   if(mode == 3){tickLineFillArray.push([ xz1[0] ,y+1 ,xz1[1]+16 ,xz1[0]+15 ,y+4 ,xz1[1]+16 ,blockId ,blockData ,who ]);}

}

const gate_fill_tool_xyzIDIDw = {
   //房间门开关
   a: function (x, y, z, blockIdA, blockDataA, blockIdB, blockDataB, who){

      let xz1 = Chunk_Boundary_Point.x2D([x,z])

         tickLineReplaceArray.push([ xz1[0]-1 ,y+1 ,xz1[1]+7 ,xz1[0]-1 ,y+4 ,xz1[1]+8 ,blockIdA ,blockDataA,blockIdB, blockDataB ,who ]);
         tickLineReplaceArray.push([ xz1[0]+7 ,y+1 ,xz1[1]-1 ,xz1[0]+8 ,y+4 ,xz1[1]-1 ,blockIdA ,blockDataA,blockIdB, blockDataB ,who ]);
         tickLineReplaceArray.push([ xz1[0]+16 ,y+1 ,xz1[1]+7 ,xz1[0]+16 ,y+4 ,xz1[1]+8 ,blockIdA ,blockDataA,blockIdB, blockDataB ,who ]);
         tickLineReplaceArray.push([ xz1[0]+7 ,y+1 ,xz1[1]+16 ,xz1[0]+8 ,y+4 ,xz1[1]+16 ,blockIdA ,blockDataA,blockIdB, blockDataB ,who ]);

  },         
  b: function (x, y, z, blockIdA, blockDataA, blockIdB, blockDataB, who){

   let xz1 = Chunk_Boundary_Point.x2D([x,z])

      tickLineReplaceArray.push([ xz1[0]-1 ,y+1 ,xz1[1]+7 ,xz1[0]-1 ,y+3 ,xz1[1]+8 ,blockIdA ,blockDataA,blockIdB, blockDataB ,who ]);
      tickLineReplaceArray.push([ xz1[0]+7 ,y+1 ,xz1[1]-1 ,xz1[0]+8 ,y+3 ,xz1[1]-1 ,blockIdA ,blockDataA,blockIdB, blockDataB ,who ]);
      tickLineReplaceArray.push([ xz1[0]+16 ,y+1 ,xz1[1]+7 ,xz1[0]+16 ,y+3 ,xz1[1]+8 ,blockIdA ,blockDataA,blockIdB, blockDataB ,who ]);
      tickLineReplaceArray.push([ xz1[0]+7 ,y+1 ,xz1[1]+16 ,xz1[0]+8 ,y+3 ,xz1[1]+16 ,blockIdA ,blockDataA,blockIdB, blockDataB ,who ]);

},
}

const xboy_fill_tool_xyzIDw = {
   //空
   a : function(x,y,z,block,data,who){null},
   ///大十字
   b : function(x,y,z,block,data,who){
      tickLineFillArray.push([x+2,y+1,z+7,x+13,y+3,z+7,block,data,who]);
      tickLineFillArray.push([x+7,y+1,z+2,x+7,y+4,z+13,block,data,who]);
   },
   ///一横中
   c : function(x,y,z,block,data,who){
      tickLineFillArray.push([x+2,y+1,z+7,x+13,y+3,z+7,block,data,who]);
   },
   ///一竖中
   d : function(x,y,z,block,data,who){
      tickLineFillArray.push([x+7,y+1,z+2,x+7,y+4,z+13,block,data,who]);
   },
   ///二横
   e : function(x,y,z,block,data,who){
      tickLineFillArray.push([x+2,y+1,z+3,x+13,y+3,z+3,block,data,who]);
      tickLineFillArray.push([x+2,y+1,z+7,x+13,y+3,z+7,block,data,who]);
   },
   ///二竖
   f : function(x,y,z,block,data,who){
      tickLineFillArray.push([x+3,y+1,z+2,x+3,y+4,z+13,block,data,who]);
      tickLineFillArray.push([x+7,y+1,z+2,x+7,y+4,z+13,block,data,who]);
   },
   ///二横中
   g : function(x,y,z,block,data,who){
      tickLineFillArray.push([x+2,y+1,z+3,x+13,y+3,z+3,block,data,who]);
      tickLineFillArray.push([x+2,y+1,z+11,x+13,y+3,z+11,block,data,who]);
   },
   ///二竖中
   h : function(x,y,z,block,data,who){
      tickLineFillArray.push([x+3,y+1,z+2,x+3,y+4,z+13,block,data,who]);
      tickLineFillArray.push([x+11,y+1,z+2,x+11,y+4,z+13,block,data,who]);
   },
   ///三横
   i : function(x,y,z,block,data,who){
      tickLineFillArray.push([x+2,y+1,z+3,x+13,y+3,z+3,block,data,who]);
      tickLineFillArray.push([x+2,y+1,z+7,x+13,y+3,z+7,block,data,who]);
      tickLineFillArray.push([x+2,y+1,z+11,x+13,y+3,z+11,block,data,who]);
   },
   ///三竖
   j : function(x,y,z,block,data,who){
      tickLineFillArray.push([x+3,y+1,z+2,x+3,y+4,z+13,block,data,who]);
      tickLineFillArray.push([x+7,y+1,z+2,x+7,y+4,z+13,block,data,who]);
      tickLineFillArray.push([x+11,y+1,z+2,x+11,y+4,z+13,block,data,who]);
   },
   ///一横中左半
   k : function(x,y,z,block,data,who){
      tickLineFillArray.push([x+2,y+1,z+7,x+7,y+3,z+7,block,data,who]);
   },
   ///一竖中左半
   l : function(x,y,z,block,data,who){
      tickLineFillArray.push([x+7,y+1,z+2,x+7,y+4,z+7,block,data,who]);
   },
   ///二横左半
   m : function(x,y,z,block,data,who){
      tickLineFillArray.push([x+2,y+1,z+3,x+7,y+3,z+3,block,data,who]);
      tickLineFillArray.push([x+2,y+1,z+7,x+13,y+3,z+7,block,data,who]);
   },
   ///二竖左半
   n : function(x,y,z,block,data,who){
      tickLineFillArray.push([x+3,y+1,z+2,x+3,y+4,z+7,block,data,who]);
      tickLineFillArray.push([x+7,y+1,z+2,x+7,y+4,z+7,block,data,who]);
   },
   ///二横中左半
   o : function(x,y,z,block,data,who){
      tickLineFillArray.push([x+2,y+1,z+3,x+7,y+3,z+3,block,data,who]);
      tickLineFillArray.push([x+2,y+1,z+11,x+7,y+3,z+11,block,data,who]);
   },
   ///二竖中左半
   p : function(x,y,z,block,data,who){
      tickLineFillArray.push([x+3,y+1,z+2,x+3,y+4,z+7,block,data,who]);
      tickLineFillArray.push([x+11,y+1,z+2,x+11,y+4,z+7,block,data,who]);
   },
   ///三横左半
   q : function(x,y,z,block,data,who){
      tickLineFillArray.push([x+2,y+1,z+3,x+7,y+3,z+3,block,data,who]);
      tickLineFillArray.push([x+2,y+1,z+7,x+7,y+3,z+7,block,data,who]);
      tickLineFillArray.push([x+2,y+1,z+11,x+7,y+3,z+11,block,data,who]);
   },
   ///三竖左半
   r : function(x,y,z,block,data,who){
      tickLineFillArray.push([x+3,y+1,z+2,x+3,y+4,z+7,block,data,who]);
      tickLineFillArray.push([x+7,y+1,z+2,x+7,y+4,z+7,block,data,who]);
      tickLineFillArray.push([x+11,y+1,z+2,x+11,y+4,z+7,block,data,who]);
   },
   ///一横中右半
   s : function(x,y,z,block,data,who){
      tickLineFillArray.push([x+7,y+1,z+7,x+13,y+3,z+7,block,data,who]);
   },
   ///一竖中右半
   t : function(x,y,z,block,data,who){
      tickLineFillArray.push([x+7,y+1,z+7,x+7,y+4,z+13,block,data,who]);
   },
   ///二横右半
   u : function(x,y,z,block,data,who){
      tickLineFillArray.push([x+7,y+1,z+3,x+13,y+3,z+3,block,data,who]);
      tickLineFillArray.push([x+7,y+1,z+7,x+13,y+3,z+7,block,data,who]);
   },
   ///二竖右半
   v : function(x,y,z,block,data,who){
      tickLineFillArray.push([x+3,y+1,z+7,x+3,y+4,z+13,block,data,who]);
      tickLineFillArray.push([x+7,y+1,z+7,x+7,y+4,z+13,block,data,who]);
   },
   ///二横中右半
   w : function(x,y,z,block,data,who){
      tickLineFillArray.push([x+7,y+1,z+3,x+13,y+3,z+3,block,data,who]);
      tickLineFillArray.push([x+7,y+1,z+11,x+13,y+3,z+11,block,data,who]);
   },
   ///二竖中右半
   x : function(x,y,z,block,data,who){
      tickLineFillArray.push([x+3,y+1,z+7,x+3,y+4,z+13,block,data,who]);
      tickLineFillArray.push([x+11,y+1,z+7,x+11,y+4,z+13,block,data,who]);
   },
   ///三横右半
   y : function(x,y,z,block,data,who){
      tickLineFillArray.push([x+7,y+1,z+3,x+13,y+3,z+3,block,data,who]);
      tickLineFillArray.push([x+7,y+1,z+7,x+13,y+3,z+7,block,data,who]);
      tickLineFillArray.push([x+7,y+1,z+11,x+13,y+3,z+11,block,data,who]);
   },
   ///三竖右半
   z : function(x,y,z,block,data,who){
      tickLineFillArray.push([x+3,y+1,z+7,x+3,y+4,z+13,block,data,who]);
      tickLineFillArray.push([x+7,y+1,z+7,x+7,y+4,z+13,block,data,who]);
      tickLineFillArray.push([x+11,y+1,z+7,x+11,y+4,z+13,block,data,who]);
   },//欸嘿，正好
   xboy : function(x,y,z,block,data,who){
      //console.log(tickLineFillArray.length)
      tickLineSetblockArray.push([x+3, y+3, z+8, block, data, who])
      tickLineSetblockArray.push([x+3, y+2, z+8, block, data, who])

      tickLineSetblockArray.push([x+6, y+3, z+3, block, data, who])
      tickLineSetblockArray.push([x+6, y+2, z+3, block, data, who])

      tickLineSetblockArray.push([x+11, y+3, z+6, block, data, who])
      tickLineSetblockArray.push([x+11, y+2, z+6, block, data, who])

      tickLineSetblockArray.push([x+8, y+3, z+11, block, data, who])
      tickLineSetblockArray.push([x+8, y+2, z+11, block, data, who])

   }
   
}

export { tickLineCLEAR, chunk_fill_tool_xYzIDw, aisle_fill_tool_xyzIDwm, wall_fill_tool_xyzIDw, gate_fill_tool_xyzIDIDw, xboy_fill_tool_xyzIDw};










