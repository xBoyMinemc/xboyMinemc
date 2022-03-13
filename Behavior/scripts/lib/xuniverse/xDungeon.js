import { 
	world,
	EntityQueryOptions,
	BlockLocation,
	Location
  } from "mojang-minecraft";
import {
	tickLineCLEAR,
	chunk_fill_tool_xYzIDw,
	aisle_fill_tool_xyzIDwm,
	wall_fill_tool_xyzIDw,
	gate_fill_tool_xyzIDIDw,
	xboy_fill_tool_xyzIDw
  } from './xLand.js';
import {
	testDead,
	getPlayers
  } from '../xpackage/playerMath.js'                                          //无情的fill机器-cmd&tick实现
import { initConsole }       from '../RGB39/tellraw-console.js';//RGB牌控制台输出-Powered by RGB39
import Chunk_Boundary_Point  from '../xpackage/chunkMath.js';   //计算并返回区块边界点#1
import xboy                  from '../xuniverse/xx.js';                    //生成房间位置
const overworld = world.getDimension("overworld");
const nether = world.getDimension("nether");
const the_end = world.getDimension("the end");
const wholeWorld = ["overworld", "nether", "the end"];// zawaluduo
const backTag    = "###xback###";
const xz2_17_5 = Chunk_Boundary_Point.x2D([2**17.5,2**17.5])[0] +300                    //忘记干嘛的了
const getScorePlayerStr = function (playerName,obj){return overworld.runCommand(`scoreboard players test "${playerName}" ${obj} * *`).statusMessage.split("在")[0].replaceAll("分数","").replaceAll(" ","");};
const setScorePlayerStr = function (name,obj,num){overworld.runCommand(`scoreboard players set ${name} ${obj} ${num}`)};
const addScorePlayerStr = function (name,obj,num){overworld.runCommand(`scoreboard players add ${name} ${obj} ${num}`)};//仨旧时代的产物
const az = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","★"];//az not is AZ
const orxyz = [-704,0,-160];//核心参数，地牢起始坐标
const where = the_end;      //核心参数，地牢所在维度
/*
71@hkrpw
const orxyzLocation = new Location(-704,0,-160);//also
const ocxyzLocation = new Location(-544,0,0);   //also

scoreboard objectives add xdungon dummy xdungeon
scoreboard objectives add xdungon_rooms dummy xdungeon_rooms
scoreboard objectives add xdungon_dis dummy §e§l-地牢攻略积分-
scoreboard objectives add xdungon_boss dummy §e§l-地牢攻略Boss数目-

/scoreboard players add @a xdungon 1
*/
const orxyzLocation = new Location(orxyz[0],orxyz[1],orxyz[2]);             //also
const ocxyzLocation = new Location((orxyz[0]+160),orxyz[1],orxyz[2]+160);   //also
const xocxyzLocation = new Location((orxyz[0]+167),orxyz[1]+7,orxyz[2]+167);   //also

const tConsole = initConsole(nether);//来自地狱的圣言哈哈哈哈哈哈哈艹
	  tConsole.injectConsole();

let gamecache = [];//字(mi)面意思
// -627 ~ -80
// -476 ~ 80
//


/*
;;;;;
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
//@_0_1_2_3_4_5_6_7_8_9@
//orxyz
// , , , , , , , , , , , , , , , , , , , , 
// , , , , , , , , , , , , , , , , , , , , 
// , , , , , , , , , , , , , , , , , , , ,
// , , , , , , , , , , , , , , , , , , , , 
// , , , , , , , , , ,c,=,1, , , , , , , ,
// , , , , , , , , , ,|, ,|, , , , , , , , 
// , , , , , , , , , ,d,=,c,=,1, , , , , ,
// , , , , , , , , , ,|, ,|, ,|, , , , , , 
// , , , , , , , ,d,=,e,=,d,=,c, , , , , ,
// , , , , , , , ,|, ,|, ,|, ,|, , , , , , 
// , , , , , ,1,=,c,=,f,=,e,=,1, , , , , ,
// , , , , , , , ,|, , , ,|, , , , , , , , 
// , , , , , , , ,1, , , ,d, , , , , , , ,
// , , , , , , , , , , , ,|, , , , , , , , 
// , , , , , , , , , ,1,=,c,=,★, , , , , ,
// , , , , , , , , , , , ,|, , , , , , , , 
// , , , , , , , , , , , ,1, , , , , , , ,
// , , , , , , , , , , , , , , , , , , , , 
// , , , , , , , , , , , , , , , , , , , ,
// , , , , , , , , , , , , , , , , , , , , 
// , , , , , , , , , , , , , , , , , , , ,
*/

let FIX = 1.0;
let tickingmain = function(){

	try{where.runCommand(`execute @a[r=225,m=s,x=${orxyz[0]+160},y=${orxyz[1]},z=${orxyz[2]+160}] ~ ~ ~ gamemode a`)}catch(err){}
	try{where.runCommand(`execute @a[rm=225,m=a,x=${orxyz[0]+160},y=${orxyz[1]},z=${orxyz[2]+160}] ~ ~ ~ gamemode s`)}catch(err){}
//满满的无奈
	let dungeonTickPlayersArray = [];
	{
		let __tess = new EntityQueryOptions();
			__tess.location = ocxyzLocation;
			__tess.maxDistance = 225;
			__tess.type = "minecraft:player";

		let __tes = where.getEntities(__tess)

		for(let __ta of __tes){
			if( __ta.location.y<orxyz[1]+16 && __ta.location.y>orxyz[1]){
				//在场景附近，且在房间内，正常
				//mode->冒险
				
				dungeonTickPlayersArray.push(__ta)
				//console.log(__ta.id)
				//塞玩家入列表
				
				///backTool.setxd("###xd###","the end",__ta);//专属死亡回溯,无了
			}else{
				//在场景附近，但不在房间内，处理掉
			}
		}
	}
	if(gamecache.length && dungeonTickPlayersArray.length){

		let dungeonTickRoomsArray = []
		{
			dungeonTickPlayersArray.forEach((__te)=>{
				let __txz = Chunk_Boundary_Point.x2D([__te.location.x,__te.location.z])
				gamecache.forEach((__te)=>{
					if(__te.x===__txz[0]&&__te.z===__txz[1]){dungeonTickRoomsArray.push(__te)}
				})
			})
		}

		dungeonTickRoomsArray.forEach((room,__tex)=>{

				let	 xboyInRoom = function(type){
				let  xboyInRoom = new EntityQueryOptions();
					 xboyInRoom.location = new Location(room.x+7,orxyz[1]+2,room.z+7);
				 	 xboyInRoom.maxDistance = 12;
					 xboyInRoom.type = type;

						let xboy  = [];
					for(let xb0y of where.getEntities(xboyInRoom)){xboy.push(xb0y)};
					return  xboy.filter(xbay => xbay.location.x<=room.x+17 && xbay.location.x>=room.x-1 && xbay.location.y<=8 && xbay.location.y>=0 && xbay.location.z<=room.z+17 && xbay.location.z>=room.z-1 )
							  //再判是否在房间内
					}
				let xboyInRoomTurest = !xboyInRoom("minecraft:zombie").length && !xboyInRoom("minecraft:skeleton").length;
					xboyInRoom("minecraft:item").forEach((item)=>{
						item.addTag("xdungeon");
						item.runCommand(`scoreboard players add @p[x=${room.x-1},y=${orxyz[1]},z=${room.z-1},dx=17,dy=17,dz=17] xdungon 1`);
						item.runCommand(`scoreboard players add @p[x=${room.x-1},y=${orxyz[1]},z=${room.z-1},dx=17,dy=17,dz=17] xdungon_dis 1`);
					});//掉落物标记，图省事直接丢main里了
///console.log(room.detail)

			if (room.status == 1 && room.detail == "★") {
				clear();
				rest();
				next();
				room.status = 0;
				dungeonTickRoomsArray[__tex] = room;
			}
			if (room.status == 2 && room.detail == "★") {
				room.status = 1;
				dungeonTickRoomsArray[__tex] = room;
			}
			if (room.status == 3 && room.detail == "★") {
				room.status = 2;
				dungeonTickRoomsArray[__tex] = room;
			}


			if(room.status == 1 && xboyInRoomTurest){
				try{
					xboyInRoom("minecraft:player").forEach((player)=>{
						player.runCommand(`scoreboard players add @s xdungon_rooms 1`);
					})
					
				}catch(err){}

				gate_fill_tool_xyzIDIDw.b(room.x, orxyz[1], room.z, "air", 0, "nether_brick_fence", 0, where)//芝麻开门
				where.runCommand(`particle xboy:ttk_end ${room.x-1  } ${orxyz[1]+2} ${room.z+7.5}`)
				where.runCommand(`particle xboy:ttk_end ${room.x+7.5} ${orxyz[1]+2} ${room.z-1  }`)
				where.runCommand(`particle xboy:ttk_end ${room.x+16 } ${orxyz[1]+2} ${room.z+7.5}`)
				where.runCommand(`particle xboy:ttk_end ${room.x+7.5} ${orxyz[1]+2} ${room.z+16 }`)
				room.status = 0;
				dungeonTickRoomsArray[__tex] = room;
			}
			if(room.status == 2 && xboyInRoomTurest){
				{
						gate_fill_tool_xyzIDIDw.a(room.x, orxyz[1], room.z, "nether_brick_fence", 0, "air", 0, where)
						where.runCommand(`particle xboy:ttk ${room.x+8} ${orxyz[1]+6.1} ${room.z+8}`)
					for(let i = 4*FIX;i>0;){
						let x = Math.floor(Math.random() * 15);
						let z = Math.floor(Math.random() * 15);
						    i = Math.floor(Math.random() * 15)>8 ? i : i-1;
						where.runCommand(`particle xboy:s ${room.x+x} ${orxyz[1]+1} ${room.z+z}`)
						where.runCommand(`summon minecraft:zombie ${room.x+x} ${orxyz[1]+3} ${room.z+z}`)
					}
					for(let i = 1*FIX;i>0;){
						let x = Math.floor(Math.random() * 15);
						let z = Math.floor(Math.random() * 15);
							i = x>8 ? i : i-1;
						where.runCommand(`particle xboy:s ${room.x+x} ${orxyz[1]+1} ${room.z+z}`)
						where.runCommand(`summon minecraft:skeleton ${room.x+x} ${orxyz[1]+3} ${room.z+z}`)
					}
				let xroom = room;
					xroom.status = Math.floor(Math.random() * 15)>4 ? 1 : 2;
				dungeonTickRoomsArray[__tex] = xroom;
				}
			}
			if(room.status == 3 && xboyInRoomTurest){
				where.runCommand(`particle xboy:ttk ${room.x+8} ${orxyz[1]+6.1} ${room.z+8}`)
				for(let i = 2*FIX;i>0;){
					let x = Math.floor(Math.random() * 15);
					let z = Math.floor(Math.random() * 15);
						i = x>8 ? i : i-1;
					where.runCommand(`particle xboy:s ${room.x+x} ${orxyz[1]+1} ${room.z+z}`)
					where.runCommand(`summon minecraft:zombie ${room.x+x} ${orxyz[1]+3} ${room.z+z}`)
				}
				for(let i = 1*FIX;i>0;){
					let x = Math.floor(Math.random() * 15);
					let z = Math.floor(Math.random() * 15);
						i = x>8 ? i : i-1;
					where.runCommand(`particle xboy:s ${room.x+x} ${orxyz[1]+1} ${room.z+z}`)
					where.runCommand(`summon minecraft:skeleton ${room.x+x} ${orxyz[1]+3} ${room.z+z}`)
				}
				gate_fill_tool_xyzIDIDw.a(room.x, orxyz[1], room.z, "nether_brick_fence", 0, "air", 0, where)
				
				let xroom = room;
				xroom.status = Math.floor(Math.random() * 15)>4 ? 2 : 3;
				dungeonTickRoomsArray[__tex] = xroom;
			}
		})
	}
}

/*
let temp = 0
let tempp = 0
*/

const backTool = {
	// setxd : function (backTagMain,worldNameTag,player) {//待修
	// 	//因为死亡后player不再在所选区域，于是不再触发此函数，导致死亡时无法触发此函数
	// 	//地牢特供
	// 		let func = {
	// 			tag: function (player) {
	// 				player.getTags().forEach(
	// 					tag => { if (tag.startsWith(backTagMain)) { player.removeTag(tag) } }
	// 				)
	// 			}
	// 		};
	// 		if (testDead(player) && player.location.y < 32767) {
	// 			func.tag(player)
	// 			player.addTag(backTagMain + worldNameTag + "#" + player.location.x.toFixed(1) + "#" + player.location.y.toFixed(1) + "#" + player.location.z.toFixed(1) + backTagMain)
	// 		}

	// },
	set : function (backTagMain,worlds) {
		//###xback###           worlds:String[]
		//在选定的维度里，用固定的tag标识符
		worlds.forEach(worldNameTag => {
			getPlayers(world.getDimension(worldNameTag)).forEach(player => {
					let mode = "tag";//后面还要换储存方式
					let func = {
						tag: function (player) {
							player.getTags().forEach(
								tag => { if (tag.startsWith(backTagMain)) { player.removeTag(tag) } }
							)
						}
					};
					if(testDead(player) && player.location.y<32767){
													//掉虚空的给一个回去记坐标的机会
						                            //什么？y32767。。。。人死后不会上天堂，但真的的会上天
						func.tag(player)
						//									维度标识符#x#y#z
						player.addTag(backTagMain + worldNameTag + "#"  + player.location.x.toFixed(1) + "#" +  player.location.y.toFixed(1) + "#" +  player.location.z.toFixed(1) + backTagMain)
					}
				})
		})

	},
	get : function(backTagMain,worlds,players){
		//backTagMain:String
		//worlds:String[]
		//players:player[]
		//什么叫特色，这就叫特色
		//一个维度一个死亡回溯点
		//搭配有偿使用风味更佳哟
		players.forEach(player => {
			let i = 0;
			worlds.forEach(worldNameTag => {
				player.getTags().forEach(tag => {
						if (tag.startsWith(backTagMain + worldNameTag)) { let wxyz = tag.replaceAll(backTagMain, "").split("#"); player.teleport(new Location(+wxyz[1], +wxyz[2], +wxyz[3]), world.getDimension(worldNameTag), 125, 404.1332);i++ } 

					})
			})
			if(!i){ player.runCommand(`tellraw @s {"rawtext":[{"text":"§e§l-所选维度无可用死亡回溯点"}]}`) }
		})

	},
	del : function(backTagMain,worlds,players){
		players.forEach(player => {
			let i = 0;
			worlds.forEach(worldNameTag => {
				player.getTags().forEach(tag => {
						if (tag.startsWith(backTagMain + worldNameTag)) {player.removeTag(tag);player.runCommand(`tellraw @s {"rawtext":[{"text":"§e§l-所选维度已清除死亡回溯点"}]}`);i++}
				})//CV是人类第一生产力
			})
			if(!i){ player.runCommand(`tellraw @s {"rawtext":[{"text":"§e§l-所选维度无可用死亡回溯点"}]}`) }
		})
	}
}


let __te = 0
world.events.tick.subscribe(() => {//我()了，这也是一种不（）

	tConsole.update();
	tickingmain();
 	backTool.set(backTag,["the end"]);

	 [overworld,nether,the_end].forEach((w)=>{
		getPlayers(w).forEach(player => {
	
			if(player.hasTag("xdungeon")){
	
				let x  = player.location.x
				let y  = player.location.y
				let z  = player.location.z
				for(let i = 6;i<48;){
					i=i+Math.floor(Math.random() * 4)
					player.runCommand(`particle xboy:xendrod ${x} ${+y.toFixed(0)+i} ${z}`)
				}
				
			}
		})
	})

	__te++
	if(__te>25){__te=0;
[overworld,nether,the_end].forEach((w)=>{
	getPlayers(w).forEach(player => {

		if(player.hasTag("chunk")){
			let x  = player.location.x //>= 0 ? player.location.x-0.5 : player.location.x+0.5;
			let y  = player.location.y
			let z  = player.location.z //>= 0 ? player.location.z-0.5 : player.location.z+0.5;
			let xz =  Chunk_Boundary_Point.x2D([x,z])
			player.runCommand(`particle minecraft:endrod ${xz[0]} ${y.toFixed(0)-1} ${xz[1]}`)
			player.runCommand(`particle minecraft:endrod ${xz[0]} ${y.toFixed(0)} ${xz[1]}`)
			player.runCommand(`particle minecraft:endrod ${xz[0]} ${y.toFixed(0)+1} ${xz[1]}`)
			player.runCommand(`particle minecraft:endrod ${xz[0]} ${y.toFixed(0)-1} ${xz[1]+15}`)
			player.runCommand(`particle minecraft:endrod ${xz[0]} ${y.toFixed(0)} ${xz[1]+15}`)
			player.runCommand(`particle minecraft:endrod ${xz[0]} ${y.toFixed(0)+1} ${xz[1]+15}`)
			player.runCommand(`particle minecraft:endrod ${xz[0]+15} ${y.toFixed(0)-1} ${xz[1]}`)
			player.runCommand(`particle minecraft:endrod ${xz[0]+15} ${y.toFixed(0)} ${xz[1]}`)
			player.runCommand(`particle minecraft:endrod ${xz[0]+15} ${y.toFixed(0)+1} ${xz[1]}`)
			player.runCommand(`particle minecraft:endrod ${xz[0]+15} ${y.toFixed(0)-1} ${xz[1]+15}`)
			player.runCommand(`particle minecraft:endrod ${xz[0]+15} ${y.toFixed(0)} ${xz[1]+15}`)
			player.runCommand(`particle minecraft:endrod ${xz[0]+15} ${y.toFixed(0)+1} ${xz[1]+15}`)
			// 为什么套y.toFixed(0)呢？
			//因为0溢事件
		}
	})
})
	}
	/*
	//旧时代的测试用核心，圆满完成使命
	getPlayers(where).forEach(player => {
		let x = player.location.x >= 0 ? player.location.x-0.5 : player.location.x+0.5;
		let z = player.location.z >= 0 ? player.location.z-0.5 : player.location.z+0.5;
	let xz =  Chunk_Boundary_Point.x2D([x,z])

	xz = {x:xz[0],z:xz[1]};temp++;
		if(gamecache.length > 0 && temp>0){
			temp=0
			gamecache.forEach((room)=>{
 
				if(room.x==xz.x && room.z==xz.z ){
					overworld.runCommand(`title @a actionbar ${room.x} ${room.z} # ${xz.x} ${xz.z}`)
					if(tempp==0){
						where.runCommand(`particle xboy:ttk ${xxz.x+8} ${orxyz[1]+7} ${xxz.z+8}`)
						//where.runCommand(`particle xboy:ttk ${xxz.x+7} 198 ${xxz.z+7}`)
						where.runCommand(`particle xboy:s ${xxz.x+7} ${orxyz[1]+7} ${xxz.z+7}`)
						where.runCommand(`particle xboy:s ${xxz.x+3} ${orxyz[1]+7} ${xxz.z+9}`)
						where.runCommand(`particle xboy:s ${xxz.x+5} ${orxyz[1]+7} ${xxz.z+5}`)
						where.runCommand(`particle xboy:s ${xxz.x+1} ${orxyz[1]+7} ${xxz.z+8}`)
						where.runCommand(`particle xboy:s ${xxz.x+10} ${orxyz[1]+7} ${xxz.z+6}`)
						where.runCommand(`summon minecraft:zombie ${xxz.x+7} ${orxyz[1]+7} ${xxz.z+7}`)
						where.runCommand(`summon minecraft:zombie ${xxz.x+3} ${orxyz[1]+7} ${xxz.z+9}`)
						where.runCommand(`summon minecraft:zombie ${xxz.x+5} ${orxyz[1]+7} ${xxz.z+5}`)
						where.runCommand(`summon minecraft:zombie ${xxz.x+1} ${orxyz[1]+7} ${xxz.z+8}`)
						where.runCommand(`summon minecraft:zombie ${xxz.x+10} ${orxyz[1]+7} ${xxz.z+6}`)
						//where.runCommand(`me ############${[xxz.x+8, 192, xxz.z+8, "stone", 0, "air", 0]}`)
						gate_fill_tool_xyzIDIDw.a(xxz.x, orxyz[1], xxz.z, "nether_brick_fence", 0, "air", 0, where)
						tempp++	
					}
				}else{
				//overworld.runCommand("title @a actionbar "+xz.x+"#"+xz.z)
				};

		})}
	});
*/
})



function next(){
	let x = -536;
	let y = 8;
	let z = 8;
	// //particle /
	// where.runCommand(`tellraw @a[tag=xdungeon] {"rawtext":[{"text":"§r§l⑨${0}"}]}`)
	where.runCommand(`title @a[tag=xdungeon] title 恭喜，进入下一关`)
	where.runCommand(`effect @a[tag=xdungeon] slow_falling 5 30 true`)
	where.runCommand(`effect @a[tag=xdungeon] slowness 2 2 true`)
	where.runCommand(`particle xboy:ttk_win_gold ${x} ${y} ${z}`)
	where.runCommand(`particle xboy:ttk_win_diamond ${x} ${y} ${z}`)

	where.runCommand(`summon minecraft:fireworks_rocket ${x+1.5} ${y} ${z+0.5}`)
	where.runCommand(`summon minecraft:fireworks_rocket ${x+1.5} ${y} ${z-0.5}`)
	where.runCommand(`summon minecraft:fireworks_rocket ${x-1.5} ${y} ${z+0.5}`)
	where.runCommand(`summon minecraft:fireworks_rocket ${x-1.5} ${y} ${z-0.5}`)
	where.runCommand(`summon minecraft:fireworks_rocket ${x+0.5} ${y} ${z+1.5}`)
	where.runCommand(`summon minecraft:fireworks_rocket ${x-0.5} ${y} ${z+1.5}`)
	where.runCommand(`summon minecraft:fireworks_rocket ${x+0.5} ${y} ${z-1.5}`)
	where.runCommand(`summon minecraft:fireworks_rocket ${x-0.5} ${y} ${z-1.5}`)
}
function clear(){
	gamecache = [];
	tickLineCLEAR();//清空跑道
for(let u = 2;u<19;u++){
  for(let v = 2;v<19;v++){
	  if(where.getBlock(new BlockLocation(orxyz[0]+16*v+8, orxyz[1], orxyz[2]+16*u+8)).id != "minecraft:air" || true){
	 // if( true){
			//console.log({a:1,b:2,c:[99,1],[Symbol('symbol')]:'ok'})
			chunk_fill_tool_xYzIDw(orxyz[0]+16*v,[orxyz[1],orxyz[1]+6],orxyz[2]+16*u,"air",0,where)
		   }
	  }
}
}

function rest(){
	
	let u21v21;
	let level = 5;
	for(let i = 0;i==0;){let xb0y = xboy(level);if(xb0y){
		let a = {x:90,y:90,u:0,v:0}
		let w = 0;
		//w用于判断最少房间数
		//a用于保持起始房间与终点距离
		for(let u = 2;u<19;u++){
			 for(let v = 2;v<19;v++){
				if(xb0y[u][v] != " " && xb0y[u][v] != "|" && xb0y[u][v] != "="){w++}
				if(xb0y[u][v] == az[level]){a.x = u;a.y = v}
				if(xb0y[u][v] == "★"     ){a.u = u;a.v = v}
			}
		}
		let x = a.x>a.u ? a.x-a.u : a.u-a.x;
		let y = a.y>a.v ? a.y-a.v : a.v-a.y;
		if(x+y>6 && x+y<30 && w>15){i++;u21v21=xb0y;
			//console.log(a,"#x:",x,"#y:",y,"#w:",w)
	}
	};};

	for(let u = 2;u<19;u++){

		 //where.runCommand(`me ${u21v21[u]}`)
		 if(Array.from(new Set(u21v21[u])).length != 1){
			 //console.log(u21v21[u].join())
			 try{
			 the_end.runCommand(`tellraw @a[tag=xdungeon] {"rawtext":[{"text":"§r§l⑨${u21v21[u].join().replace("★","§e★§r§l")}"}]}`)
			 }catch(err){}
			}
  		 for(let v = 2;v<19;v++){
			   let roomDetail = u21v21[u][v];
		 if(roomDetail != " "){
		 //我是憨批，复制的忘记改了
			if(az.indexOf(roomDetail) != -1 && u21v21[u][v-1] == " "){wall_fill_tool_xyzIDw(orxyz[0]+16*v, orxyz[1], orxyz[2]+16*u, "deepslate_bricks", 0, where, 0);}
			if(az.indexOf(roomDetail) != -1 && u21v21[u-1][v] == " "){wall_fill_tool_xyzIDw(orxyz[0]+16*v, orxyz[1], orxyz[2]+16*u, "deepslate_bricks", 0, where, 1);}
			if(az.indexOf(roomDetail) != -1 && u21v21[u][v+1] == " "){wall_fill_tool_xyzIDw(orxyz[0]+16*v, orxyz[1], orxyz[2]+16*u, "deepslate_bricks", 0, where, 2);}
			if(az.indexOf(roomDetail) != -1 && u21v21[u+1][v] == " "){wall_fill_tool_xyzIDw(orxyz[0]+16*v, orxyz[1], orxyz[2]+16*u, "deepslate_bricks", 0, where, 3);}
			//崩了。习惯了
			//喵喵喵？
			if(roomDetail == "=" || roomDetail == "|"){
			aisle_fill_tool_xyzIDwm(orxyz[0]+16*v, orxyz[1], orxyz[2]+16*u, "deepslate_bricks", 0, where, roomDetail)

			}else{
			if(roomDetail == "★"){
			
			gamecache.push({x:orxyz[0]+16*v,z:orxyz[2]+16*u,detail:roomDetail,status:3})
			chunk_fill_tool_xYzIDw(orxyz[0]+16*v, [orxyz[1],orxyz[1]], orxyz[2]+16*u, "cracked_deepslate_tiles", 0, where)
			}else{
			if(roomDetail == az[level]){

			chunk_fill_tool_xYzIDw(orxyz[0]+16*v, [orxyz[1],orxyz[1]], orxyz[2]+16*u, "deepslate_tiles", 0, where)
			//where.runCommand(`me  ${orxyz[0]+16*v+8} 8 ${orxyz[2]+16*u+8}`)
			try{
				{
					let __tess = new EntityQueryOptions();
						__tess.type = "minecraft:player";
						__tess.tags = ["xdungeon"];
			
					let __tes = where.getEntities(__tess)
			
					for(let __ta of __tes){
						if(__ta.dimension === where){
						__ta.teleport(new Location(orxyz[0]+16*v+8,8,orxyz[2]+16*u+8),where,0,0)
						//__ta.addEffect()//真拉跨
						__ta.runCommand(`effect @s slow_falling 5 0 true`)
						__ta.runCommand(`effect @s slowness 2 2 true`)
						}

					}
					//猜猜这块哪复制来的
				}
			//where.runCommand(`tp @a[tag=xdungeon] ${orxyz[0]+16*v+8} 8 ${orxyz[2]+16*u+8}`)

			}catch(err){}
			}else{//垃圾游戏，又崩了
				
				gamecache.push({x:orxyz[0]+16*v,z:orxyz[2]+16*u,detail:roomDetail,status:3})
				chunk_fill_tool_xYzIDw(orxyz[0]+16*v, [orxyz[1],orxyz[1]], orxyz[2]+16*u, "deepslate_tiles", 0, where)//deepslate_gold_ore      cobbled_deepslate    chiseled_deepslate  
				xboy_fill_tool_xyzIDw[az[Math.floor(Math.random() * 25)]](orxyz[0]+16*v, orxyz[1], orxyz[2]+16*u, "deepslate_bricks", 0, where)//生成房间内隔断
				xboy_fill_tool_xyzIDw[az[Math.floor(Math.random() * 25)]](orxyz[0]+16*v, orxyz[1], orxyz[2]+16*u, "deepslate_bricks", 0, where)//生成房间内隔断
				xboy_fill_tool_xyzIDw.xboy(orxyz[0]+16*v, orxyz[1], orxyz[2]+16*u, "air", 0, where)
				
			} 
			}//嘛耶，if瀑布
		   }//  高血压上来了                                                                                               
		}//整平，我不觉，心不烦
	  }
}
try{where.runCommand(`tellraw @a[tag=xdungeon] {"rawtext":[{"text":"§e§l-房间数量；${gamecache.length}"}]}`)}catch(err){}
}

clear();
rest();


const helperList = [
	"---以下使用皆需满足前提条件---",
	"- 地牢开 => 一切的前提",
	"- 进牢",
	"- 开牢",
	"- 出牢",
	"- 探牢 或 探监 => 进入被栅栏封闭的房间",
	"- 牢底 或 案底",
	"- 待更新",
	"- 待更新",
	"- 待更新",
];
world.events.beforeChat.subscribe(msg => {

const {message} = msg
/*
if(message == "..xd clear" && msg.sender.hasTag("xboy")){msg.message = "清场中....";clear()}
if(message == "..xd rest"  && msg.sender.hasTag("xboy")){msg.message = "生成中...."; rest()}
if(message == "..xd back"  && msg.sender.hasTag("xboy")){msg.message = "进牢中...."; msg.sender.teleport(xocxyzLocation,where,0,0)}
*/
//
//console.log(msg.sender.getEntitiesFromViewVector()[0].getComponents())
if (message == '..back del'){msg.cancel = true;backTool.del(backTag,wholeWorld,[msg.sender]);}
if (message == '..back'){msg.cancel = true;backTool.get(backTag,wholeWorld,[msg.sender]);}
if (message == '..xd back'){msg.cancel = true;backTool.get("###xd###","the end",[msg.sender]);}

if(message == "..xd clear"){msg.message = "清场中...."; clear()}
if(message == "..xd rest" ){msg.message = "生成中...."; rest() }
if(message == "..xd start"){msg.message = "进牢中...."; msg.sender.teleport(xocxyzLocation,where,0,0)}


if(message == "地牢帮助"){msg.cancel = true;
	helperList.forEach(text=>{
		msg.sender.runCommand(`tellraw @s {"rawtext":[{"text":"§e§l+]${text}"}]}`)
	})
}
if(message.startsWith("难度调整")){FIX = +message.replace("难度调整","");msg.message = "难度调整为；"+FIX}
if(message == "坐牢" && msg.sender.hasTag("xdungeon") ){msg.message = "爷又回来辣！！！！";backTool.get("###xback###",["the end"],[msg.sender]);msg.sender.runCommand(`xp -1L`)}
if(message == "清牢" && msg.sender.hasTag("xdungeon") && msg.sender.dimension === where){msg.message = "清场中....";clear()   }
if(message == "开牢" && msg.sender.hasTag("xdungeon") && msg.sender.dimension === where){msg.message = "清场中....请等待生成";clear() ; rest()   }
if(message == "出牢" && msg.sender.dimension === where){msg.cancel  = true;msg.sender.kill()}
if(message == "进牢" && msg.sender.hasTag("xdungeon") ){msg.message = "进牢中...."; msg.sender.teleport(xocxyzLocation,where,0,0)}

if((message == "探牢" || message == "探监") && msg.sender.hasTag("xdungeon") && msg.sender.dimension === where){
	msg.cancel  = true;
	let x = msg.sender.location.x;
	let z = msg.sender.location.z;
	try{
	[
		[-4,0],
		[0,-4],
		[ 4,0],
		[0, 4]
	].forEach((xz)=>{
		gamecache.forEach((room)=>{
			let uv = Chunk_Boundary_Point.x2D([x+xz[0],z+xz[1]])
			if(uv[0] == room.x && uv[1] == room.z){
				msg.sender.runCommand(`tp @s ${room.x+7} ${orxyz[1]+2} ${room.z+8}`);
				// +7 又 +8,文明是√8
				throw new Error("为了让forEach中断减少性能开销，我加了个try，怎么想的");
			}
		})
	})

	}catch(err){}
}
if(message == "牢底" || message == "案底"){
	msg.cancel  = true;
	msg.sender.runCommand(`tellraw @s {"rawtext":[{"text":"§e§l-地牢攻略积分- ${getScorePlayerStr(msg.sender.nameTag,"xdungon_dis")}"}]}`)
	msg.sender.runCommand(`tellraw @s {"rawtext":[{"text":"§e§l-地牢攻略数量- ${getScorePlayerStr(msg.sender.nameTag,"xdungon_rooms")}"}]}`)
	msg.sender.runCommand(`tellraw @s {"rawtext":[{"text":"§e§l-现可兑换积分- ${getScorePlayerStr(msg.sender.nameTag,"xdungon")}"}]}`)
}

//gamecache.forEach((room)=>{console.log(room.x,"#",room.z)})

})




/*
// 开始-> 是否已经开始-> 清场-> 预定坐标加载初始房间
// ->确认参加玩家名单-> addTag
// ->将参与玩家tp进场-> 游戏->
// #->死亡->房间内有玩家->仍有则游戏继续
// #->死亡->房间内无玩家->游戏结束
// ##->结算
// ->房间阶段结束判定:
// ###->没有怪物三秒钟->生成新房间-将新房间位置返回-保存在gt临时变量中
// ###
// -初始房间-概率生成五级或四级房间-北门
// -五级房间-除南门外随机选择2-3个门生成四级到三级房间
// -四级
// -三级
// -二级
// -一级
*/












//forEach是坏文明吗