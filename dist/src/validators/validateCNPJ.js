const toString=require("../utils/toString.js");function validateCNPJ(t=""){if(""==(t=toString(t).replace(/[^\d]+/g,""))||t.length>14)return!1;if("00000000000000"==(t=t.padStart(14,"0"))||"11111111111111"==t||"22222222222222"==t||"33333333333333"==t||"44444444444444"==t||"55555555555555"==t||"66666666666666"==t||"77777777777777"==t||"88888888888888"==t||"99999999999999"==t)return!1;let r=t.length-2,e=t.substring(0,r),n=t.substring(r),i=0,a=r-7;for(let t=r;t>=1;t--)i+=e.charAt(r-t)*a--,a<2&&(a=9);let l=i%11<2?0:11-i%11;if(l!=n.charAt(0))return!1;r+=1,e=t.substring(0,r),i=0,a=r-7;for(let t=r;t>=1;t--)i+=e.charAt(r-t)*a--,a<2&&(a=9);return l=i%11<2?0:11-i%11,l==n.charAt(1)}module.exports=validateCNPJ;