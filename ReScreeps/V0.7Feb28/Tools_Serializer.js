"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Serializer {
    static SerializeMap(map) {
        let convertedToArray = [];
        let iter = map.entries();
        let curEntry = iter.next();
        while (!curEntry.done) {
            convertedToArray.push([curEntry.value[0], curEntry.value[1]]);
            curEntry = iter.next();
        }
        return JSON.stringify(convertedToArray);
    }
    static DeserializeMap(serializedString) {
        let convertedArray = JSON.parse(serializedString);
        let map = new Map();
        for (let i = 0, length = convertedArray.length; i < length; i++) {
            map.set(convertedArray[i][0], convertedArray[i][1]);
        }
        return map;
    }
}
exports.Serializer = Serializer;
//# sourceMappingURL=Serializer.js.map
