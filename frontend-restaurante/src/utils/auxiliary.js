export function convertToJSON(csvArray) {
    var objArray = [];
    for (var i = 1; i < csvArray.length; i++) {
        objArray[i - 1] = {};
        for (var k = 0; k < csvArray[0].length && k < csvArray[i].length; k++) {
            var key = csvArray[0][k];
            objArray[i - 1][key] = csvArray[i][k];
        }
    }
    return objArray;
}
