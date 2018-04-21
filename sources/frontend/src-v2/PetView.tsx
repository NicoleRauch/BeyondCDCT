import React from 'react';
import {Pet} from './types';
import PetSale from "./PetSale";


const pictures : { [index:string] : string } = {
    "Cat": require('../img/cat.jpg'),
    "Dog": require('../img/dog.jpg'),
    "Canary": require('../img/canary.jpg'),
    "Rabbit": require('../img/rabbit.jpg'),
    "Fish": require('../img/fish.jpg')
};


export default ({pet, petSaleOK, sellPet}: {pet:Pet, petSaleOK: boolean, sellPet: any}) => (
    <tr key={pet.name + '#' + pet.species}>
        <td><img height="20" src={pictures[pet.species]}/></td>
        <td><span>{pet.name}</span></td>
        {petSaleOK ? <td style={{marginLeft: "10px"}}><PetSale pet={pet} sellPet={sellPet}/></td> : null}
    </tr>
);
