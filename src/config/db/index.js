const mongoose = require('mongoose');

async function connect() {
    try{
        await mongoose.connect('MONGO_URI_CONNECTION', {
            useNewUrlParser: true,
            useUnifiedTopology: true
    })
    console.log('Connect Successful!')
    }catch (error){
        console.log('Error connecting');
    }
}

module.exports = { connect };