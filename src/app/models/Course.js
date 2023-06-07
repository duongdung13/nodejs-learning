const mongoose = require('mongoose')
const Schema = mongoose.Schema
slug = require('mongoose-slug-generator')
mongoose.plugin(slug)

const Course = new Schema({
    name: { type: String, maxLength: 255 },
    description: { type: String, maxLength: 255 },
    image: { type: String, maxLength: 255 },
    videoId: { type: String, maxLength: 255 },
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
    slug: { type: String, slug: 'name' },
})

module.exports = mongoose.model('Course', Course)
