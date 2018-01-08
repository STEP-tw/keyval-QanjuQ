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
  let currentKey = this.changeKeysToLowerCase([this.currentKey])[0];
  // currentKey = currentKey[0];
  let validKeys = this.changeKeysToLowerCase(this.validKeys);
  if(!contains(validKeys,currentKey))
  throw new InvalidKeyError("invalid key",this.currentKey,this.currentPos);
  this.parsedKeys[this.currentKey]=this.currentValue;
  this.resetKeysAndValues();
}

StrictParseInfo.prototype.changeKeysToLowerCase = function(keys){
  let isCaseSensitive = this.caseSensitive;
  return keys.map((key) =>{
    if(!isCaseSensitive){
      return changeToLowerCase(key);
    }
    return key;
  });
};

const changeToLowerCase = function(key){
    return key.toLowerCase();
};

module.exports=StrictParseInfo;
