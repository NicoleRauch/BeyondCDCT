const expect = require('must');

const petSorter = require('../src/petSorter');

describe('Sorting pets', function () {
    const pACat = {petName: 'A', petPrice: '99', petType: 'Cat'};
    const pARabbit = {petName: 'A', petPrice: '99', petType: 'Rabbit'};
    const pBCat = {petName: 'B', petPrice: '99', petType: 'Cat'};
    const pBRabbit = {petName: 'B', petPrice: '99', petType: 'Rabbit'};
    const pCRabbit = {petName: 'C', petPrice: '99', petType: 'Rabbit'};

    const pACanary = {petName: 'A', petPrice: '99', petType: 'Canary'};
    const pBCanary = {petName: 'B', petPrice: '99', petType: 'Canary'};
    const pCCanary = {petName: 'C', petPrice: '99', petType: 'Canary'};
    const pBDog = {petName: 'B', petPrice: '99', petType: 'Dog'};
    const pCDog = {petName: 'C', petPrice: '88', petType: 'Dog'};
    const pAFish = {petName: 'A', petPrice: '88', petType: 'Fish'};
    const pCFish = {petName: 'C', petPrice: '88', petType: 'Fish'};

    it('sorts two pets with the same name and different types', function () {
        expect(petSorter.sortPets([pARabbit, pACat])).to.eql([pACat, pARabbit]);
    });

    it('sorts two pets with different names and the same types', function () {
        expect(petSorter.sortPets([pBRabbit, pARabbit])).to.eql([pARabbit, pBRabbit]);
    });

    it('sorts two pets with different names and different types', function () {
        expect(petSorter.sortPets([pBRabbit, pACat])).to.eql([pACat, pBRabbit]);
    });

    it('sorts multiple pets with different names and different types', function () {
        expect(petSorter.sortPets([pBDog, pCDog, pCFish, pARabbit, pACat, pCCanary, pBRabbit, pCRabbit, pCCanary, pACanary, pAFish]))
            .to.eql([pACanary, pACat, pAFish, pARabbit, pBDog, pBRabbit, pCCanary, pCCanary, pCDog, pCFish, pCRabbit]);
    });
});
