import React from 'react';
import {Pet} from './types';
import PetView from './PetView';
import PetSale from './PetSale';


export default ({pets, sellPet, petSaleOK}: { pets: Pet[], sellPet: any, petSaleOK: boolean }) => (
    !pets || !pets.length ? null :
        <div>
            <h3>Pets in our Store</h3>
            <table>
                <tbody>
                {pets.map((pet: Pet) => <PetView pet={pet} petSaleOK={petSaleOK} sellPet={sellPet} key={pet.name + "-" + pet.species}/>)}
                </tbody>
            </table>
        </div>
);
