const Parsed=require("./parsed.js");
const ParseInfo=require("./parseInfo.js");
const InvalidKeyError=require("./errors/invalidKeyError.js");

const contains=function(list,key) {
  return list.find(function(validKey){
    return key==validKey;
  });
}

var StrictParseInfo=function(initialParsingFunction,validKeys,caseSensitivity) {
  ParseInfo.call(this,initialParsingFunction);
  this.validKeys=validKeys;
  this.caseSensitive = caseSensitivity;
}

StrictParseInfo.prototype=Object.create(ParseInfo.prototype);

StrictParseInfo.prototype.pushKeyValuePair=function() {
  let currentKey = this.changeKeyToLowerCase() || this.currentKey;
  if(!contains(this.validKeys,currentKey))
  throw new InvalidKeyError("invalid key",this.currentKey,this.currentPos);
  this.parsedKeys[this.currentKey]=this.currentValue;
  this.resetKeysAndValues();
}

StrictParseInfo.prototype.changeKeyToLowerCase = function(){
  if(!this.caseSensitive){
    return this.currentKey.toLowerCase();
  }
};

module.exports=StrictParseInfo;
