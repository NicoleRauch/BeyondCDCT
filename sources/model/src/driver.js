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
        backend: function (callback) {
            request(merge(req, backend),
                function (err, response) {
                    callback(err, response.body);
                });
        },
        model: function (callback) {
            request(merge(req, model),
                function (err, response) {
                    callback(err, response.body);
                });
        }
    }, mainCallback);
}

const requestAndCompare = (request, mainCallback) => {

    console.log("Running the modification request:");

    runAgainstBackend(request, function (err, result) {
        const backendString = JSON.stringify(result.backend);
        const modelString = JSON.stringify(result.model);
        if (backendString !== modelString) {
            mainCallback("Backend and Model responses differ! Backend: " + backendString + " - Model: " + modelString); // error, bail out
        } else {
            console.log("Comparing all data:");

            async.map(comparisons, (itemFunc, callback) => runAgainstBackend(itemFunc(), function(err, res) {
                if(res.backend === res.model){
                    callback(null, null); // no differences
                } else {
                    const formatDiff = formatter.formatDiff({backend: JSON.parse(res.backend), model: JSON.parse(res.model)});
                    console.log("Backend:", formatter.formatString(res.backend));
                    console.log("Model:  ", formatter.formatString(res.model));
                    console.log(formatDiff);
                    callback(null, formatDiff);
                }
                }),
                function (err, results) {
                    const nonmatching = results.filter(res => res !== null);
                    if (nonmatching.length === 0) {
                        mainCallback(null, "Backend and Model contain the same data");
                    } else {
                        mainCallback("Backend and Model differ in their data");
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
