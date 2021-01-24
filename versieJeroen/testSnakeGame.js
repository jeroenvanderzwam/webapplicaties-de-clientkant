QUnit.module( "testing the function power" );

import * as snakegame from "controller.js";
//QUnit.module("Testing snake game");
 
// Qunit.test( "global failure", extend( function() {
//     QUnit.pushFailure( error, filePath + ":" + linerNr );
//     }, { validTest: validTest } ) );

//     window.onerror = function (msg, url, lineNo, columnNo, error) {
//     return false;
// }

// window.onerror = function (msg, url, lineNo, columnNo, error) {
//     return false;
// }

//  QUnit.test("functie canMoveHandler", function(assert) {
//      let snake = [{10,90,330,"DarkRed"}, {10,90,350,"DarkRed"}, {10,90,370,"DarkRed"}, {10,90,390,"DarkOrange"} ];
//      var result = snakeModule.canMoveHandler(true);
//      assert.equal(result, true, "Should be true");
//  });

//test("Hello");

// test( "Should be able to move", function( assert ) {
//     var result = controller.canMoveHandler("UP");
//     assert.equal( result, true, " Should be true");
//   });
//var snake = {[{10,370,130,"Olive"}, {10,90,90,"Olive"},{10,330,290,"Olive"},{10,390,250,"Olive"}, {10,170,110,"Olive"}], [{10,210,30,"DarkRed"}, {10,210,10,"DarkOrange"}]};
var snake = {
    [{10,370,130,"Olive"}, {10,90,90,"Olive"},{10,330,290,"Olive"},{10,390,250,"Olive"}, {10,170,110,"Olive"}],
    [{10,210,30,"DarkRed"}, {10,210,10,"DarkOrange"}]
}
QUnit.test("De slang moet kunnen bewegen", function( assert ) {
    //assert.expect(snakeModule.canMoveHandler("UP"));
    assert.ok(true);
    assert.ok(snakegame.canMoveHandler("UP"));
}
)

QUnit.test( "uitkomst moet kloppen", function( assert ) {
	assert.expect(3);
	assert.equal(power(2, 2), 4, "2 tot de macht 2 is 4");
	assert.equal(power(1, 1), 1, "1 tot de macht 1 is 1");
	assert.equal(power(3, 0), 1, "3 tot de macht 0 is 1");
});
