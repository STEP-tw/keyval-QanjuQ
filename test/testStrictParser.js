const src=function(filePath){return "../src/"+filePath};
const errors=function(filePath){return "../src/errors/"+filePath};

const Parsed = require(src('parsed.js'));

const assert = require('chai').assert;

const StrictParser=require(src('index.js')).StrictParser;
const InvalidKeyError=require(errors('invalidKeyError.js'));

var invalidKeyErrorChecker=function(key,pos) {
  return function(err) {
    if(err instanceof InvalidKeyError && err.invalidKey==key && err.position==pos)
      return true;
    return false;
  }
}

const getExpectedParsed = function(expected){
  let parsed = new Parsed();
  let keys = Object.keys(expected);
  keys.forEach((key)=>{
    parsed[key] = expected[key];
  });
  return parsed;
}

describe("strict parser",function(){
  it("should only parse keys that are specified for a single key",function(){
    let errorType;
    assert.throws(
      ()=>{
        let kvParser=new StrictParser(["name"]);
        try{
          var p = kvParser.parse("age=23");
        }catch(e){
          errorType = invalidKeyErrorChecker("age",5);
          throw e;
        }
      },errorType);
  });

  it("should only parse keys that are specified for multiple keys",function(){
    let kvParser=new StrictParser(["name","age"]);
    let actual=kvParser.parse("name=john age=23");
    let expected={name:"john",age:"23"};
    assert.deepEqual(getExpectedParsed(expected),actual);
    let errorType;
    assert.throws(
      ()=>{
        try{
          var p = kvParser.parse("color=blue");
        }catch(e){
          errorType = invalidKeyErrorChecker("color",9);
          throw e;
        }
      },errorType);
  });

  it("should throw an error when one of the keys is not valid",function(){
    let errorType;
    assert.throws(
      ()=>{
        let kvParser=new StrictParser(["name","age"]);
        try{
          var p = kvParser.parse("name=john color=blue age=23");
        }catch(e){
          errorType = invalidKeyErrorChecker("color",20);
          throw e;
        }
      },errorType);
  });

  it("should throw an error on invalid key when there are spaces between keys and assignment operators",function(){
    let errorType;
    assert.throws(
      ()=>{
        let kvParser=new StrictParser(["name","age"]);
        try{
          var p = kvParser.parse("color   = blue");
        }catch(e){
          errorType = invalidKeyErrorChecker("color",13);
          throw e;
        }
      },errorType);
  });

  it("should throw an error on invalid key when there are quotes on values",function(){
    let kvParser=new StrictParser(["name","age"]);
    let errorType;
    assert.throws(
      ()=>{
        try{
          var p = kvParser.parse("color   = \"blue\"");
        }catch(e){
          errorType = invalidKeyErrorChecker("color",15);
          throw e;
        }
      },errorType);
  });

  it("should throw an error on invalid key when there are cases of both quotes and no quotes",function(){
    let errorType;
    assert.throws(
      ()=>{
        let kvParser=new StrictParser(["name","age"]);
        try{
          var p = kvParser.parse("name = john color   = \"light blue\"");
        }catch(e){
          errorType = invalidKeyErrorChecker("color",33);
          throw e;
        }
      },errorType);
  });

  it("should throw an error when no valid keys are specified",function(){
    let errorType;
    assert.throws(
      ()=>{
        let kvParser=new StrictParser([]);
        try{
          var p = kvParser.parse("name=john");
        }catch(e){
          errorType = invalidKeyErrorChecker("name",8);
          throw e;
        }
      },errorType);
  });

  it("should throw an error when no array is passed",function(){
    let errorType;
    assert.throws(
      ()=>{
        let kvParser=new StrictParser();
        try{
          kvParser.parse("name=john");
        }catch(e){
          errorType = invalidKeyErrorChecker("name",8);
          throw e;
        }
      },errorType);
  });
});
