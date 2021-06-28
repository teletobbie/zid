import Bulbasaur from '../images/pokemons/001-Bulbasaur.png';
import Charizard from '../images/pokemons/006-Charizard.png';
import Squirtle from '../images/pokemons/007-Squirtle.png';
import Butterfree from '../images/pokemons/012-Butterfree.png';
import Pikachu from '../images/pokemons/025-Pikachu.png';
import Jigglypuff from '../images/pokemons/039-Jigglypuff.png';
import Meowth from '../images/pokemons/052-Meowth.png';
import Arcanine from '../images/pokemons/059-Arcanine.png';
import Poliwag from '../images/pokemons/060-Poliwag.png';
import Poliwhirl from '../images/pokemons/061-Poliwhirl.png';
import Onix from '../images/pokemons/095-Onix.png';
import Eevee from '../images/pokemons/133-Eevee.png';
import Chikorita from '../images/pokemons/152-Chikorita.png';
import Pichu from '../images/pokemons/172-Pichu.png';
import Togepi from '../images/pokemons/175-Togepi.png';
import Togetic from '../images/pokemons/176-Togetic.png';
import Torchic from '../images/pokemons/255-Torchic.png';
import UnownC from '../images/pokemons/201-Unown-C.png';
import Marshtomp from '../images/pokemons/259-Marshtomp.png';
import Shiftry from '../images/pokemons/275-Shiftry.png';
import Pelipper from '../images/pokemons/279-Pelipper.png';
import Loudred from '../images/pokemons/294-Loudred.png';
import Chimecho from '../images/pokemons/358-Chimecho.png';
import Wormadam from '../images/pokemons/413-Wormadam.png';
import ArceusDragon from '../images/pokemons/493-Arceus-Dragon.png';

/**
 * Array of pokemon icons.
 */
const pokemons = [
    Bulbasaur, Charizard, Squirtle, Butterfree, Pikachu, 
    Jigglypuff, Meowth, Arcanine, Poliwag, Poliwhirl, 
    Onix, Eevee, Chikorita, Pichu, Togepi, 
    Togetic, Torchic, UnownC, Marshtomp, Shiftry, 
    Pelipper, Loudred, Chimecho, Wormadam, ArceusDragon
];

/**
 * @returns {number} random index by pokemon icon array
 */
export const getRandomIndex = () => {
    return Math.floor(Math.random() * pokemons.length)
}

/**
 * Return image by index, if no index is given then return a image by random index. 
 * @param {number} index 
 * @returns A pokemon icon
 */
const getSource = (index) => {
    const imageIndex = index ? index : getRandomIndex();
    return pokemons[imageIndex]
}

export default getSource
