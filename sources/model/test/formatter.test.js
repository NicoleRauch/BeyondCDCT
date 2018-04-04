const expect = require("must");

const formatter = require("../src/formatter");

describe("Formatting of the differences", function () {
    const object = {
        tag: "Pets",
        pets: [{petName: "A", petPrice: "99", petType: "Rabbit"}, {petName: "B", petPrice: 123, petType: "Cat"}]
    };

    it("formats an object nicely", function () {
        expect(formatter.formatString(object)).to.eql(`{
    "tag": "Pets",
    "pets": [
        {
            "petName": "A",
            "petPrice": "99",
            "petType": "Rabbit"
        },
        {
            "petName": "B",
            "petPrice": 123,
            "petType": "Cat"
        }
    ]
}`);
    });

    it("formats one string nicely", function () {

    });

    it("formats the two result strings nicely", function () {

    });
});
