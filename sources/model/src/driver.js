const axios = require('axios');


const possiblePetNames = ["A", "B", "C"];
const possiblePetTypes = ["Cat", "Dog", "Canary", "Rabbit", "Fish"];

const chooseFrom = (arr) => arr[Math.floor(arr.length * Math.random())];

const petName = () => chooseFrom(possiblePetNames);
const petPrice = () => Math.floor(150 * Math.random());
const petType = () => chooseFrom(possiblePetTypes);

const generatePet = () => ({petName: petName(), petPrice: petPrice(), petType: petType()});

const requestGenerator = [
    // getPets
    () => ({url: "/pets", method: "GET"}),
    // addPet
    () => ({url: "/pets", method: "POST", json: true, data: generatePet()}),
    // removePet
    () => ({url: "/pets", method: "DELETE", json: true, data: generatePet()}),
];


const backend = {baseURL: "http://localhost:9090"};
const model = {baseURL: "http://localhost:8080"};

let count = 0;

const requestAndCompare = () => {
    const req = chooseFrom(requestGenerator)();
    let backendString;
    let modelString;
    console.log("before");
    axios(Object.assign(req, backend))
        .then(result => {
            backendString = JSON.stringify(result.data);
        });
    console.log(req);
    console.log("after 1st");
    axios(Object.assign(req, model))
        .then(result => {
            modelString = JSON.stringify(result.data);
        });
    console.log(req);
    console.log("after 2nd");

    if (backendString !== modelString) {
        console.log("Backend result: ", backendString);
        console.log("Model result: ", modelString);
    } else {
        console.log("Backend and Model agree");
    }
};

while (count < 10) {
    count++;
    requestAndCompare();
}

