import Chunk_Boundary_Point from '../xpackage/chunkMath.js';
import { world } from "mojang-minecraft";
//############################################################################
//who
const overworld = world.getDimension("overworld");

var tickLineFillArray = []
var tickLineFillFunct = function (x,y,z,u,v,w,block,data,who){
//who.runCommand(`me ${x} ${y} ${z} ${u} ${v} ${w} ${block} ${data} replace`);
who.runCommand(`fill ${x} ${y} ${z} ${u} ${v} ${w} ${block} ${data} replace`);
}