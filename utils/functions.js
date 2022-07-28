const {OWNERS} = require("../config.json")

async function checkOwner(id) {
    for (let owner of OWNERS) {
        if (owner["ID"] === id) {
            return true;
        }
    }
    return false;
}

module.exports = {
    checkOwner
}
