const toString=require("./toString.js");function regexReplaceTrim(e="",r="A-Za-zÀ-ú0-9 ",t=""){return toString(e).replace(new RegExp(`[^${toString(r)}]`,"g"),toString(t)).trim()}module.exports=regexReplaceTrim;