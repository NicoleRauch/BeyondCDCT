const async = require('async');
const request = require('request');
const R = require("ramda");


const formatter = require("./formatter");

const possiblePetNames = ["A", "B", "C"];
const possiblePetTypes = ["Cat", "Dog", "Canary", "Rabbit", "Fish"];

const chooseFrom = (arr) => arr[Math.floor(arr.length * Math.random())];

const petName = () => chooseFrom(possiblePetNames);
const petPrice = () => Math.floor(150 * Math.random());
const petType = () => chooseFrom(possiblePetTypes);

const generatePet = () => ({petName: petName(), petPrice: petPrice(), petType: petType()});

const resets = [
    // delete all pets
    () => ({url: "/reset", method: "DELETE"}),
];

const modifyingRequestGenerator = [
    // addPet
    () => ({url: "/pets", method: "POST", json: true, body: generatePet()}),
    // removePet
    () => ({url: "/pets", method: "DELETE", json: true, body: generatePet()}),
];

const comparisons = [
    // getPets
    () => ({url: "/pets", method: "GET"}),
];


const backend = {baseURL: "http://localhost:9090"};
const model = {baseURL: "http://localhost:8080"};

let count = 0;

function merge(req, server) {
    return Object.assign({}, req, {url: server.baseURL + req.url});
}

function runAgainstBackend(req, mainCallback) {
    console.log("Now checking:", req);

    async.parallel({
        backendString: function (callback) {
            request(merge(req, backend),
                function (err, response) {
                    // console.log(err, response.body)
                    callback(err, response.body);
                });
        },
        modelString: function (callback) {
            request(merge(req, model),
                function (err, response) {
                    // console.log(err, response.body)
                    callback(err, response.body);
                });
        }
    }, mainCallback);
}

const requestAndCompare = (item, callback) => {

    console.log("Running the modification request:");

    runAgainstBackend(item, function (err, result) {
        if (result.backendString !== result.modelString) {
            console.log("Backend request result: ", result.backendString);
            console.log("Model request result: ", result.modelString);
            callback("Backend and Model differ!"); // error, bail out
        } else {
            console.log("Comparing all data:");

            async.map(comparisons, (itemFunc, callback) => runAgainstBackend(itemFunc(), callback),
                function (err, results) {
                    const nonmatching = results.filter(res => res.backendString !== res.modelString);
                    if (nonmatching.length === 0) {
                        callback(null, "Backend and Model agree");
                    } else {
                        callback(null, formatter.format(nonmatching));
                    }
                });
        }
    });
};

const requests = [resets[0]()];

while (count < 10) {
    count++;
    requests.push(chooseFrom(modifyingRequestGenerator)());
}

async.mapSeries(requests, requestAndCompare, function (err, results) {
    results.map(result => console.log(result));
    if (err) {
        console.log(err);
    }
});
