const expect = require("must");

const formatter = require("../src/formatter");

describe("Formatting of the differences", function () {
    const object1 = {
        tag: "Pets",
        pets: [{petName: "A", petPrice: "99", petType: "Rabbit"}, {petName: "B", petPrice: 123, petType: "Cat"}]
    };
    const object2 = {
        tag: "Pets",
        pets: [{petName: "A", petPrice: "99", petType: "Rabbit"}, {petName: "C", petPrice: 123, petType: "Cat"}]
    };

    it("formats an object nicely", function () {
        expect(formatter.formatString(object1)).to.eql(`{
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

    it("splits a format string nicely", function () {
        expect(formatter.spliceString(object1)).to.eql([
            "{",
            "    \"tag\": \"Pets\",",
            "    \"pets\": [",
            "        {",
            "            \"petName\": \"A\",",
            "            \"petPrice\": \"99\",",
            "            \"petType\": \"Rabbit\"",
            "        },",
            "        {",
            "            \"petName\": \"B\",",
            "            \"petPrice\": 123,",
            "            \"petType\": \"Cat\"",
            "        }",
            "    ]",
            "}"]);
    });

    it("formats one diff nicely", function (done) {
        /*
        formatter.formatDiff({modelString: object1, backendString: object2}, function (err, results) {
            expect(results).to.eql([]);
            done(err);
        })
        */
        done();
    });

    it("formats one diff result nicely", function () {

    });

    it("formats the two result strings nicely", function () {

    });
});
