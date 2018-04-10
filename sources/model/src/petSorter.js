const R = require('ramda');

module.exports = {
    sortPets: (pets) => {
        return R.sortWith([
            R.ascend(R.prop('petName')),
            R.ascend(R.prop('petType')),
            R.ascend(R.prop('petPrice'))
        ])(pets);
    }
};
