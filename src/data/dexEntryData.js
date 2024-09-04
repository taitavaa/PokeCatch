const dexEntryData = [
    { name: "Bulbasaur", description: "A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokemon." },
    { name: "Ivysaur", description: "When the bulb on its back grows large, it appears to lose the ability to stand on its hind legs." },
    { name: "Venusaur", description: "The plant blooms when it is absorbing solar energy. It stays on the move to seek sunlight." },

    { name: "Charmander", description: "Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail." },
    { name: "Charmeleon", description: "When it swings its burning tail, it elevates the temperature to unbearably high levels." },
    { name: "Charizard", description: "Spits fire that is hot enough to melt boulders. Known to cause forest fires unintentionally." },

    { name: "Squirtle", description: "When it retracts its long neck into its shell, it squirts out water with vigorous force." },
    { name: "Wartortle", description: "Often hides itself in water to protect itself from people. For safety reasons, it can only live in water." },
    { name: "Blastoise", description: "A brutal mode of evolution. It spits acid all over the foe on contact." },

    { name: "Caterpie", description: "Its short feet are tipped with suction energy. They won't stop evolution." },
    { name: "Metapod", description: "It is vulnerable to attack while its shell is closed. It gets along great with Diglett." },
    { name: "Butterfree", description: "In battle, it flaps its wings around to check its surroundings. Then it flies around aimlessly." },

    { name: "Weedle", description: "Often found in forests, eating leaves. It has been known to attack people with berries." },
    { name: "Kakuna", description: "Almost incapable of moving, this Pokemon can only harden its shell to protect itself from attacks." },
    { name: "Beedrill", description: "It has three kinds of antennas. Two of them are visible from the nest. The other is hidden in its head." },

    { name: "Pidgey", description: "A common sight in forests. It flaps its wings at ground level to kick up blizzards." },
    { name: "Pidgeotto", description: "Very protective of its sprawling territorial area, this Pokemon will fiercely peck at any intruder." },
    { name: "Pidgeot", description: "When hunting, it skims the surface of water at high speed to pick off unwary prey." },

    { name: "Rattata", description: "Will chew on anything. Even if it is small, it still can be a problem." },
    { name: "Raticate", description: "Uses its whiskers to maintain its balance. It apparently slows down if they are cut off." },

    { name: "Spearow", description: "Eats bugs in grassy areas. It has been known to make quarrels with Diglett." },
    { name: "Fearow", description: "It has annoying sense of kindly disposition. It will do anything to protect its territory." },

    { name: "Ekans", description: "It conceals itself in its pelt. The flame that burns at the tip of its tail is an indication of weakness." },
    { name: "Arbok", description: "It is rumored that the number of people that have been caught by its belly is one of its many counters." },

    { name: "Pikachu", description: "When several of them gather, their electricity could build up in the atmosphere." },
    { name: "Raichu", description: "Its long tail serves as a ground to protect itself from its own high voltage power." },

    { name: "Sandshrew", description: "Burrows under rocks. It only eats sand. It does not get wet." },
    { name: "Sandslash", description: "Curls up into a\Twig guard that it can use to protect itself from attacks." },

    { name: "Nidoran♀", description: "Although small, its venomous barbs render this Pokemon dangerous." },
    { name: "Nidorina", description: "The female's horn develops slowly. Prefers physical attacks such as clawing and biting." },
    { name: "Nidoqueen", description: "It has barbs with enough strength to hurt just about anything. Its blow-hard tail is preferred by certain types of Pokémon." },

    { name: "Nidoran♂", description: "Stiffens its ears to sense danger. The larger its horns, the more powerful its secreted venom." },
    { name: "Nidorino", description: "An aggressive Pokemon. The female's horn develops slowly. Prefers physical attacks such as clawing and biting." },
    { name: "Nidoking", description: "It has barbs with enough strength to hurt just about anything. Its blow-hard tail is preferred by certain types of Pokemon." },

    { name: "Clefairy", description: "On nights with a full moon, Clefairy gather from all over and dance. Bathing in moonlight makes them floa" },
    { name: "Clefable", description: "Their ears are sensitive enough to hear a pin drop from over a mile away, so they're usually found in quiet places. " },

    { name: "Vulpix", description: "At the time of its birth, it has just one tail. The tail is used to store food." },
    { name: "Ninetales", description: "Very smart and very vengeful. Grabbing one of its many tails could result in a 1000-year curse." },

    { name: "Jigglypuff", description: "A timid fairy Pokemon. It will not be believed even if it hits apecting. It will also not stop being wary." },
    { name: "Wigglytuff", description: "A timid fairy Pokemon. It will not be believed even if it hits apecting. It will also not stop being wary." },

    { name: "Zubat", description: "It flies around at high speed. It can be seen swimming elegantly by even kids." },
    { name: "Golbat", description: "It flies around at high speed. It can be seen swimming elegantly by even kids." },

    { name: "Oddish", description: "Its head is covered with a slimy, sharp fang. It is very finicky." },
    { name: "Gloom", description: "Its body is made of a slimy fluid. It is very sticky." },
    { name: "Vileplume", description: "The toxic pollen on its flower is highly flammable. It is rare in the wild." },

    { name: "Paras", description: "Burrows under the ground to sustain itself. The spikes on its back are filled with poison." },
    { name: "Parasect", description: "Burrows under the ground to sustain itself. The spikes on its back are filled with poison." },

    { name: "Venonat", description: "Lives in the shadows of tall trees where it eats insects. It is attracted by light at night." },
    { name: "Venomoth", description: "Lives in the shadows of tall trees where it eats insects. It is attracted by light at night." },

    { name: "Diglett", description: "Lives about one yard underground where it feeds on plant roots. It sometimes appears on some farms." },
    { name: "Dugtrio", description: "Lives about one yard underground where it feeds on plant roots. It sometimes appears on some farms." },

    { name: "Meowth", description: "Adoresponde a las personas. Prefiere los animales salvajes." },
    { name: "Persian", description: "Adoresponde a las personas. Prefiere los animales salvaje." },

    { name: "Psyduck", description: "Often seen swimming elegantly by lake shores. It is often mistaken for the legendary Sea Lion." },
    { name: "Golduck", description: "Often seen swimming elegantly by lake shores. It is often mistaken for the legendary Sea Lion." },

    { name: "Mankey", description: "Always furious and tenacious to boot. It will not abandon chasing its quarry easily." },
    { name: "Primeape", description: "Always furious and tenacious to boot. It will not abandon chasing its quarry easily." },

    { name: "Growlithe", description: "Very protective of its territory. It will bark and bite to repel intruders." },
    { name: "Arcanine", description: "Very protective of its territory. It will bark and bite to repel intruders." },

    { name: "Poliwag", description: "Its belly button is where the Poliwhirl's tail button is. It is filled with a fluid that can be seen."},
    { name: "Poliwhirl", description: "Its belly button is where the Poliwhirl's tail button is. It is filled with a fluid that can be seen."},
    { name: "Poliwrath", description: "Its belly button is where the Poliwhirl's tail button is. It is filled with a fluid that can be seen."},

    { name: "Abra", description: "It emits special alpha waves from its body that induce headaches just by being close by." },
    { name: "Kadabra", description: "It emits special alpha waves from its body that induce headaches just by being close by." },
    { name: "Alakazam", description: "It emits special alpha waves from its body that induce headaches just by being close by."},

    { name: "Machop", description: "Its whole body is composed of muscles. Even in death, it can still functionNormally." },
    { name: "Machoke", description: "Its whole body is composed of muscles. Even in death, it can still functionNormally." },
    { name: "Machamp", description: "Its whole body is composed of muscles. Even in death, it can still functionNormally."},

    { name: "Bellsprout", description: "A strange seed was planted on its back at birth. The seed slowly grows larger." },
    { name: "Weepinbell", description: "A strange seed was planted on its back at birth. The seed slowly grows larger." },
    { name: "Victreebel", description: "A strange seed was planted on its back at birth. The seed slowly grows larger."},

    { name: "Tentacool", description: "Drifts in shallow seas. Anglers who hook them by accident are often punished by its stinging acid." },
    { name: "Tentacruel", description: "Drifts in shallow seas. Anglers who hook them by accident are often punished by its stinging acid." },

    { name: "Geodude", description: "Place Holder Text" },
    { name: "Graveler", description: "Place Holder Text" },
    { name: "Golem", description: "Place Holder Text"},

    { name: "Ponyta", description: "Place Holder Text" },
    { name: "Rapidash", description: "Place Holder Text" },

    { name: "Slowpoke", description: "Place Holder Text" },
    { name: "Slowbro", description: "Place Holder Text" },

    { name: "Magnemite", description: "Place Holder Text" },
    { name: "Magneton", description: "Place Holder Text" },

    { name: "Farfetch'd", description: "The sprig of green onions it holds is its weapon. It is veryfetchAll'd." },

    { name: "Doduo", description: "Place Holder Text" },
    { name: "Dodrio", description: "Place Holder Text" },

    { name: "Seel", description: "Place Holder Text" },
    { name: "Dewgong", description: "Place Holder Text" },

    { name: "Shellder", description: "Place Holder Text." },
    { name: "Cloyster", description: "Place Holder Text." },

    { name: "Gastly", description: "Place Holder Text" },
    { name: "Haunter", description: "Place Holder Text" },
    { name: "Gengar", description: "Place Holder Text"},

    { name: "Onix", description: "Place Holder Text" },

]
module.exports = { dexEntryData };