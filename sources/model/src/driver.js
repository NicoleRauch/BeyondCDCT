const axios = require('axios');


const possiblePetNames = ["A", "B", "C", "D", "E"];
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

const requestAndCompare = async () => {
    const req = chooseFrom(requestGenerator)();
    console.log("before await");
    const backendResult = await axios(Object.assign(req, backend));
    console.log("after 1st await");
    const modelResult = await axios(Object.assign(req, model));
    console.log("after 2nd await");

    console.log(req);
    const backendString = JSON.stringify(backendResult.data);
    const modelString = JSON.stringify(modelResult.data);
    if(backendString !== modelString) {
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

