// models/Pokemon.js
const mongoose = require('mongoose');

const pokemonSchema = new mongoose.Schema({
  name: String,
  ingame: Number
});

const Pokemon = mongoose.model('Pokemon', pokemonSchema);

module.exports = Pokemon;