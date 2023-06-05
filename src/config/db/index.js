const mongoose = require('mongoose');

async function connect() {
    try{
        await mongoose.connect('mongodb+srv://dungdcth:WeWRCIDesEM2ejcG@cluster0.xz0cadd.mongodb.net/myblog', {
            useNewUrlParser: true,
            useUnifiedTopology: true
    })
    console.log('Connect Successful!')
    }catch (error){
        console.log('Error connecting');
    }
}

module.exports = { connect };