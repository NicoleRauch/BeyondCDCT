
class Pets {
    constructor(){
        this._pets = [];
    }

    getPets() {
        return this._pets;
    }

    addPet(pet) {
        this._pets.push(pet);
        return "Pet successfully added";
    }

    removePet(pet) {
        this._pets = this._pets.filter(p => p.petName === pet.petName && p.petType === pet.petType);
        return "Pet successfully removed";
    }
}

class Users {
    constructor() {
        this._users = [];
    }
}



class Model {
    constructor() {
        this._pets = new Pets();
        this._users = new Users();
    }

    pets() {
        return this._pets;
    }

    users() {
        return this._users;
    }
}



module.exports = Model;
