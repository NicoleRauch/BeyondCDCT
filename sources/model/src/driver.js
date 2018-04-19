const async = require('async');
const request = require('request');
// const R = require('ramda');


const formatter = require('./formatter');

const chooseFrom = arr => arr[Math.floor(arr.length * Math.random())];

const possibleNames = ['A', 'B', 'C'];
const possibleSpecies = ['Cat', 'Dog', 'Canary', 'Rabbit', 'Fish'];

const name = () => chooseFrom(possibleNames);
const price = () => Math.floor(150 * Math.random());
const species = () => chooseFrom(possibleSpecies);

const randomPet = () => ({petName: name(), petPrice: price(), petType: species()});

const resets = [
    // delete all pets
    () => ({url: '/reset', method: 'DELETE'}),
];

const modifyingRequestGenerator = [
    // addPet
    () => ({url: '/pets', method: 'POST', json: true, body: randomPet()}),
    // removePet
    () => ({url: '/pets', method: 'DELETE', json: true, body: randomPet()}),
];

const comparisons = [
    // getPets
    () => ({url: '/pets', method: 'GET'}),
];


const backend = {baseURL: 'http://localhost:9090'};
const essence = {baseURL: 'http://localhost:8080'};

const merge = (req, server) => Object.assign({}, req, {url: server.baseURL + req.url});

const requestFunctionFor = (req, server) =>
        callback => request(merge(req, server), (err, response) => callback(err, response.body));


const runRequest = (req, callback) => {
    console.log('Now checking:', req);
    async.parallel({
        backend: requestFunctionFor(req, backend),
        essence: requestFunctionFor(req, essence)
    }, callback);
};


function compareEverything(mainCallback) {
    async.map(comparisons, (itemFunc, callback) => runRequest(itemFunc(), (err, res) => {
            if (res.backend === res.essence) {
                callback(null, null); // no differences
            } else {
                const formatDiff = formatter.formatDiff({
                    backend: JSON.parse(res.backend),
                    essence: JSON.parse(res.essence)
                });
                console.log('Backend:', formatter.formatString(res.backend));
                console.log('Essence:  ', formatter.formatString(res.essence));
                console.log(formatDiff);
                callback(null, formatDiff);
            }
        }),
        (err, results) => {
            const nonmatching = results.filter(res => res !== null);
            if (nonmatching.length === 0) {
                mainCallback(null);
            } else {
                mainCallback('Backend and Essence differ in their data');
            }
        });
}

const requestAndCompare = (request, mainCallback) => {

    console.log('Running the modification request:');

    runRequest(request, (err, result) => {
        const backendString = JSON.stringify(result.backend);
        const essenceString = JSON.stringify(result.essence);
        if (backendString !== essenceString) {
            mainCallback('Backend and Essence responses differ! Backend: ' + backendString + ' - Essence: ' + essenceString); // error, bail out
        } else {
            console.log('Comparing all data:');
            compareEverything(mainCallback);
        }
    });
};

const requests = [resets[0]()]; // initial reset

let count = 0;

while (count < 50) {
    count++;
    requests.push(chooseFrom(modifyingRequestGenerator)());
}

async.mapSeries(requests, requestAndCompare, (err, results) => {
    console.log(results.length + " calls were executed.");
    results.filter(x => x).map(result => console.log(result));
    if (err) {
        console.log(err);
    }
});
