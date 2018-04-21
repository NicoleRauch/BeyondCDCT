import React from 'react';
import {Pet} from './types';


export default ({pet, sellPet}: {pet: Pet, sellPet: any}) => (
    <button onClick={() => sellPet(pet)}>Sell {pet.name}</button>
);
