class WaitPlugin{constructor(){this.waitList={}}finishWait(t,i=!0,s){try{return!!this.waitList[t]&&(i?this.waitList[t].resolve(s||!0):this.waitList[t].reject(s||!1))}catch(t){return t}finally{this.waitList[t]&&delete this.waitList[t]}}startWait(t){if(!this.waitList[t])return this.waitList[t]={},this.waitList[t].promise=new Promise(((i,s)=>{this.waitList[t].resolve=i,this.waitList[t].reject=s})),this.waitList[t].promise}finishAll(t,i){console.log(this.waitList);for(let s in this.waitList)console.log("OK",s),this.finishWait(s,t,i)}}const WP=new WaitPlugin;module.exports=WP;