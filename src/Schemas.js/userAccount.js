const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { 
    type: String,
    required: true,
    unique: true
  },
  userName: {
    type: String,
  },
  balance: {
    type: Number,
    default: 0,
  },
  pokeball: {
    type: Number,
    default: 0,
  },
  greatball: {
    type: Number,
    default: 0,
  },
  ultraball: {
    type: Number,
    default: 0,
  },
  masterball: {
    type: Number,
    default: 0,
  },
  caughtPokemon: [{
    name: String,
    rarity: String,
    image: String,
    dexnum: Number,
    quantity: Number,
  }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;