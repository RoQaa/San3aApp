const mongoose = require('mongoose');

const helpMeSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId, //population data
    ref: 'User',
  },
  description: String,
  image: [String],
  Date: String
});

const HelpMe = mongoose.model('HelpMe', helpMeSchema);

module.exports = HelpMe;
