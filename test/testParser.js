const src=function(filePath){return "../src/"+filePath};
const errors=function(filePath){return "../src/errors/"+filePath};

const chai = require('chai');

const Parser=require(src('index.js')).Parser;
const MissingValueError=require(errors('missingValueError.js'));
const MissingEndQuoteError=require(errors('missingEndQuoteError.js'));
const MissingKeyError=require(errors('missingKeyError.js'));
const MissingAssignmentOperatorError=require(errors('missingAssignmentOperatorError.js'));
const IncompleteKeyValuePairError=require(errors('incompleteKeyValuePairError.js'));

var kvParser;

describe("parse basic key values",function(){
  beforeEach(function(){
    kvParser=new Parser();
  });

  it("parses an empty string",function(){
    let actual=kvParser.parse("");
    chai.assert.equal(0,actual.length());
  });

  it("parse key=value",function(){
    let actual=kvParser.parse("key=value");
    // chai.assert.deepEqual(kvParser.parse("key=value"),{'key':'value'}));
    chai.assert.equal("value",actual.key);
    chai.assert.equal(1,actual.length());
  });

  it("parse when there are leading spaces before key",function(){
    let actual=kvParser.parse(" key=value");
    let expected = {'key':'value'};
    chai.expect(actual).to.own.include(expected);
  });

  it("parse when there are spaces after key",function(){
    let expected={key:"value"};
    chai.expect(kvParser.parse("key =value")).to.own.include(expected);
  });

  it("parse when there are spaces before and after key",function(){
    let expected={key:"value"};
    chai.expect(kvParser.parse(" key =value")).to.own.include(expected);
  });

  it("parse when there are spaces before value",function(){
    let expected={key:"value"};
    chai.expect(kvParser.parse("key= value")).to.own.include(expected);
  });

  it("parse when there are spaces after value",function(){
    let expected={key:"value"};
    chai.expect(kvParser.parse("key=value ")).to.own.include(expected);
  });
});

describe("parse digits and other special chars",function(){
  beforeEach(function(){
    kvParser=new Parser();
  });

  it("parse keys with a single digit",function(){
    let expected={'1':"value"};
    chai.expect(kvParser.parse("1=value")).to.own.include(expected);
  });

  it("parse keys with only multiple digits",function(){
    let expected={'123':"value"};
    chai.expect(kvParser.parse("123=value")).to.own.include(expected);
  });

  it("parse keys with leading 0s",function(){
    let expected={'0123':"value"};
    chai.expect(kvParser.parse("0123=value")).to.own.include(expected);
  });

  it("parse keys with underscores",function(){
    let expected={'first_name':"value"};
    chai.expect(kvParser.parse("first_name=value")).to.own.include(expected);
  });

  it("parse keys with a single underscore",function(){
    let expected={'_':"value"};
    chai.expect(kvParser.parse("_=value")).to.own.include(expected);
  });

  it("parse keys with multiple underscores",function(){
    let expected={'__':"value"};
    chai.expect(kvParser.parse("__=value")).to.own.include(expected);
  });

  it("parse keys with alphabets and digits(digits leading)",function(){
    let expected={'0abc':"value"};
    chai.expect(kvParser.parse("0abc=value")).to.own.include(expected);
  });

  it("parse keys with alphabets and digits(alphabets leading)",function(){
    let expected={'a0bc':"value"};
    chai.expect(kvParser.parse("a0bc=value")).to.own.include(expected);
  });
});

describe("multiple keys",function(){
  beforeEach(function(){
    kvParser=new Parser();
  });

  it("parse more than one key",function(){
    let expected={key:"value",anotherkey:"anothervalue"};
    chai.expect(kvParser.parse("key=value anotherkey=anothervalue")).to.own.include(expected);
  });

  it("parse more than one key when keys have leading spaces",function(){
    let expected={key:"value",anotherkey:"anothervalue"};
    chai.expect(kvParser.parse("   key=value anotherkey=anothervalue")).to.own.include(expected);
  });

  it("parse more than one key when keys have trailing spaces",function(){
    let expected={key:"value",anotherkey:"anothervalue"};
    chai.expect(kvParser.parse("key  =value anotherkey  =anothervalue")).to.own.include(expected);
  });

  it("parse more than one key when keys have leading and trailing spaces",function(){
    let expected={key:"value",anotherkey:"anothervalue"};
    chai.expect(kvParser.parse("  key  =value anotherkey  =anothervalue")).to.own.include(expected);
  });
});

describe("single values with quotes",function(){
  beforeEach(function(){
    kvParser=new Parser();
  });

  it("parse a single value with quotes",function(){
    let expected={key:"value"};
    chai.expect(kvParser.parse("key=\"value\"")).to.own.include(expected);
  });

  it("parse a single quoted value that has spaces in it",function(){
    let expected={key:"va lue"};
    chai.expect(kvParser.parse("key=\"va lue\"")).to.own.include(expected);
  });

  it("parse a single quoted value that has spaces in it and leading spaces",function(){
    let expected={key:"va lue"};
    chai.expect(kvParser.parse("key=   \"va lue\"")).to.own.include(expected);
  });

  it("parse a single quoted value that has spaces in it and trailing spaces",function(){
    let expected={key:"va lue"};
    chai.expect(kvParser.parse("key=\"va lue\"   ")).to.own.include(expected);
  });
});

describe("multiple values with quotes",function(){
  it("parse more than one value with quotes",function(){
    let expected={key:"va lue",anotherkey:"another value"};
    chai.expect(kvParser.parse("key=\"va lue\" anotherkey=\"another value\"")).to.own.include(expected);
  });

  it("parse more than one value with quotes with leading spaces",function(){
    let expected={key:"va lue",anotherkey:"another value"};
    chai.expect(kvParser.parse("key= \"va lue\" anotherkey= \"another value\"")).to.own.include(expected);
  });

  it("parse more than one value with quotes when keys have trailing spaces",function(){
    let expected={key:"va lue",anotherkey:"another value"};
    chai.expect(kvParser.parse("key = \"va lue\" anotherkey = \"another value\"")).to.own.include(expected);
  });
});

describe("mixed values with both quotes and without",function(){
  it("parse simple values with and without quotes",function(){
    let expected={key:"value",anotherkey:"anothervalue"};
    chai.expect(kvParser.parse("key=value anotherkey=\"anothervalue\"")).to.own.include(expected);
  });

  it("parse simple values with and without quotes and leading spaces on keys",function(){
    let expected={key:"value",anotherkey:"anothervalue"};
    chai.expect(kvParser.parse("   key=value anotherkey=\"anothervalue\"")).to.own.include(expected);
  });

  it("parse simple values with and without quotes and trailing spaces on keys",function(){
    let expected={key:"value",anotherkey:"anothervalue"};
    chai.expect(kvParser.parse("key  =value anotherkey  =\"anothervalue\"")).to.own.include(expected);
  });

  it("parse simple values with and without quotes and leading and trailing spaces on keys",function(){
    let expected={key:"value",anotherkey:"anothervalue"};
    chai.expect(kvParser.parse("  key  =value anotherkey  = \"anothervalue\"")).to.own.include(expected);
  });

  it("parse simple values with and without quotes(quoted values first)",function(){
    let expected={key:"value",anotherkey:"anothervalue"};
    chai.expect(kvParser.parse("anotherkey=\"anothervalue\" key=value")).to.own.include(expected);
  });
});

const errorChecker=function(key,pos,typeOfError) {
    return function(err) {
      if(err instanceof typeOfError && err.key==key && err.position==pos)
        return true;
      return false;
    }
}

describe("error handling",function(){
  beforeEach(function(){
    kvParser=new Parser();
  });

  it("throws error on missing value when value is unquoted",function(){
    let errorType;
    chai.assert.throws(
      ()=>{
        try{
          kvParser.parse("key=");
        }catch(e){
          errorType = errorChecker("key",3,MissingValueError);
          throw e;
        }
      },errorType);
  });

  it("throws error on missing value when value is quoted",function(){
    let errorType;
    chai.assert.throws(
      ()=>{
        try{
          kvParser.parse("key=\"value");
        }catch(e){
          errorType = errorChecker("key",9,MissingEndQuoteError);
          throw e;
        }
      },errorType);
  });

  it("throws error on missing key",function(){
    let errorType;
    chai.assert.throws(
      ()=>{
        try{
          kvParser.parse("=value");
        }catch(e){
          errorType = errorChecker(undefined,0,MissingKeyError);
          throw e;
        }
      },errorType);
  });

  it("throws error on invalid key",function(){
    let errorType;
    chai.assert.throws(
      ()=>{
        try{
          kvParser.parse("'foo'=value");
        }catch(e){
          errorType = errorChecker(undefined,0,MissingKeyError);
          throw e;
        }
      },errorType)
  });

  it("throws error on missing assignment operator",function(){
    let errorType;
    chai.assert.throws(
      ()=>{
        try{
          kvParser.parse("'foo'=value");
        }catch(e){
          errorType = errorChecker(undefined,4,MissingAssignmentOperatorError);
          throw e;
        }
      },errorType);
  });

  it("throws error on incomplete key value pair",function(){
    let errorType;
    chai.assert.throws(
      ()=>{
        try{
          kvParser.parse("key");
        }catch(e){
          errorType = errorChecker(undefined,2,IncompleteKeyValuePairError);
          throw e;
        }
      },errorType);
    });
});
