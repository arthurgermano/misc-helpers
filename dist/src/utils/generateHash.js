const toString=require("./toString.js"),{createHash:createHash}=require("crypto");function generateHash(t="",e="base64",r="sha256"){if(""==(t=toString(t).trim()))return!1;try{const a=createHash(r).update(t).digest(e);if("string"==typeof a)return a}catch(t){}return!1}module.exports=generateHash;