const axios = require('axios');


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

function runAgainstBackend(req) {
    let backendString;
    let modelString;
    console.log(req);
    axios(Object.assign(req, backend))
        .then(result => {
            console.log(result.data)
            backendString = JSON.stringify(result.data);
        });
    console.log("after backend req")
    axios(Object.assign(req, model))
        .then(result => {
            console.log(result.data)
            modelString = JSON.stringify(result.data);
        });
    console.log("after model req")
    console.log("results:", backendString, modelString)
    return {backendString, modelString};
}

const requestAndCompare = () => {
    const req = chooseFrom(modifyingRequestGenerator)();
    let {backendString, modelString} = runAgainstBackend(req);

    console.log("after all")
    if (backendString !== modelString) {
        console.log("Backend and Model differ!");
        console.log("Backend request result: ", backendString);
        console.log("Model request result: ", modelString);
    } else {
        console.log("compare now")
        const comparisonData = comparisons.map(comp => runAgainstBackend(comp()));
        console.log("data:", comparisonData)
        const nonmatching = comparisonData.filter(res => res.backendString !== res.modelString);
        if(nonmatching.length === 0) {
            console.log("Backend and Model agree");
        } else {
            console.log("Differences:", nonmatching);
        }
    }
};

while (count < 10) {
    count++;
    requestAndCompare();
}

