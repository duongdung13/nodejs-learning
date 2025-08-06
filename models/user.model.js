import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, unique: true, required: true, index: true },
  role:      { type: String, enum: ['user', 'admin'], default: 'user' },
  age:       { type: Number, min: 18, max: 99 }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual field
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

const User = mongoose.model('User', userSchema);
export default User;
