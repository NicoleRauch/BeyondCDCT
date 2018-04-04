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

    it("converts to single quotes nicely", function () {
       expect(formatter.singleQuote("a\"b\"c\"d")).to.eql("a'b'c'd");
    });

    it("checks identical and different strings nicely", function () {
       expect(formatter.singleDiff(["aaa", "aaa"], 17)).to.be(null);
       expect(formatter.singleDiff(["aaa", "aab"], 17)).to.eql('Difference in line 17:\nModel:\naaa\nBackend:\naab');
    });

    it("formats one diff nicely", function () {
        const diffs = formatter.formatDiff({modelString: object1, backendString: object2});
        expect(diffs).to.eql(["Difference in line 9:\nModel:\n            'petName': 'B',\nBackend:\n            'petName': 'C',"]);
    });

    it("formats one diff result nicely", function () {
        const diffs = formatter.format([
            {modelString: object1, backendString: object2},
            {modelString: object1, backendString: object1},
            {modelString: object2, backendString: object1}
            ]);
        expect(diffs).to.eql([
            ["Difference in line 9:\nModel:\n            'petName': 'B',\nBackend:\n            'petName': 'C',"],
            [],
            ["Difference in line 9:\nModel:\n            'petName': 'C',\nBackend:\n            'petName': 'B',"]
        ]);
    });

    it("formats the two result strings nicely", function () {

    });
});
