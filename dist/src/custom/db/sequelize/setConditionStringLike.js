function setConditionStringLike(i,e,n=!0){e&&i&&i[e]&&(i[e]=n?{$iLike:`%${i[e]}%`}:{$like:`%${i[e]}%`})}module.exports=setConditionStringLike;