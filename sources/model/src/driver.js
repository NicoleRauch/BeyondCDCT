const axios = require('axios');
const async = require('async');

const possiblePetNames = ["A", "B", "C"];
const possiblePetTypes = ["Cat", "Dog", "Canary", "Rabbit", "Fish"];

const chooseFrom = (arr) => arr[Math.floor(arr.length * Math.random())];

const petName = () => chooseFrom(possiblePetNames);
const petPrice = () => Math.floor(150 * Math.random());
const petType = () => chooseFrom(possiblePetTypes);

const generatePet = () => ({petName: petName(), petPrice: petPrice(), petType: petType()});

const modifyingRequestGenerator = [
    // addPet
    () => ({url: "/pets", method: "POST", json: true, data: generatePet()}),
    // removePet
    () => ({url: "/pets", method: "DELETE", json: true, data: generatePet()}),
];

const comparisons = [
    // getPets
    () => ({url: "/pets", method: "GET"}),
];


const backend = {baseURL: "http://localhost:9090"};
const model = {baseURL: "http://localhost:8080"};

let count = 0;

function runAgainstBackend(req, mainCallback) {
    console.log(req);

    async.parallel({
        backendString: function(callback) {
            axios(Object.assign(req, backend))
                .then(result => {
                    callback(JSON.stringify(result.data));
                });
        },
        modelString: function(callback) {
            axios(Object.assign(req, model))
                .then(result => {
                    callback(JSON.stringify(result.data));
                });
        }
    }, mainCallback);
}

const requestAndCompare = (item, callback) => {

    // 1) request
    runAgainstBackend(item, function (err, result) {
        console.log("after all", result)
        if (result.backendString !== result.modelString) {
            console.log("Backend request result: ", backendString);
            console.log("Model request result: ", modelString);
            callback("Backend and Model differ!"); // error, bail out
        } else {
            // 2) compare all data
            async.map(comparisons, (itemFunc, callback) => runAgainstBackend(itemFunc(), callback),
                function (err, results) {
                console.log("after comparisons", results)
                    const nonmatching = results.filter(res => res.backendString !== res.modelString);
                    if(nonmatching.length === 0) {
                        callback(null, "Backend and Model agree");
                    } else {
                        callback("Differences:" + JSON.stringify(nonmatching));
                    }
            });
        }
    });
};

const requests = [];

while (count < 10) {
    count++;
    requests.push(chooseFrom(modifyingRequestGenerator)());
}

async.map(requests, requestAndCompare, function(err, results) {
   results.map(result => console.log(result));
});
