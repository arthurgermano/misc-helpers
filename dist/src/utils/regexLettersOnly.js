const toString=require("./toString.js");function regexLettersOnly(e=""){return toString(e).replace(/[^A-Za-zÀ-ú]/g,"").trim()}module.exports=regexLettersOnly;