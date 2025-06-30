import { Character, type House } from "./types.ts"

export const resolvers = {

    Character: {

        house: async (parent: Character): Promise <House>=> {

            const response = await fetch (`https://hp-api.onrender.com/api/characters/house/${parent.house!.name}`);
            const data = await response.json();

            console.log (data);
            
            return ({

                name: parent.house!.name,
                characters: data,

            })
        }

    },

    House: {

        characters: (parent: House) => {
            
            return (parent.characters.map ((char)=>{

                return ({

                id: char.id,
                name: char.name,
                alternate_names: char.alternate_names,
                species: char.species,
                gender: char.gender,
                house: {name: char.house,
                    characters: []
                }

            });

            }))

        }

    },

    Query: {

        getCharacter: async (_:unknown, {id}: {id:string}): Promise <Character | null> => {

            const response = await fetch (`https://hp-api.onrender.com/api/character/${id}`);
            const data = await response.json();

            //console.log (data.at(0).house);

            return ({

                id: data.at(0).id,
                name: data.at(0).name,
                alternate_names: data.at(0).alternate_names,
                species: data.at(0).species,
                gender: data.at(0).gender,
                house: {name: data.at(0).house,
                    characters: []
                }

            });

        },

        getCharacters: async (_:unknown, {ids}: {ids: string[]}): Promise <Character[]> => {

            if (!ids){

                const response = await fetch ("https://hp-api.onrender.com/api/characters");
                const data = await response.json();

                return (data);

            }else {

                console.log (ids);

                const characters = await Promise.all (ids.map(async (id:string) => {

                    const response = await fetch (`https://hp-api.onrender.com/api/character/${id}`);
                    const data = await response.json ();
                    console.log (data);
                    return (data);

                }))
                const chars = characters.map ((char) => {
                    //console.log (index);
                    return ({

                        id: char.at(0).id,
                        name: char.at(0).name,
                        alternate_names: char.at(0).alternate_names,
                        species: char.at(0).species,
                        gender: char.at(0).gender,
                        house: {name: char.at(0).house,
                            characters: []
                        }

                    });
                })
                //console.log (chars);

                return (chars);

            }

        }

    }

}