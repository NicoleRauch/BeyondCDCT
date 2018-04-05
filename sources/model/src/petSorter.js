const R = require("ramda");

module.exports = {
    sortPets: (pets) => {
        const sortByType = R.sortBy(R.prop('petType'));
        const sortByName = R.sortBy(R.prop('petName'));
        return sortByName(sortByType(pets));
    }
};
