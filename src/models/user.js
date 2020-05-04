
const mongoose = require("mongoose");
const validator = require("validator");

const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken")

//Set up User Schema and Model

const userSchema = mongoose.Schema({
    email:{
        type: String,
        required: [true, "email is required"],
        trim: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: function(value){
                return validator.isEmail(value)
            }
        }
    },
    name:{
        type: String,
        required: [true, "name is required"],
        trim: true
    },
    password: {
        type: String,
        required: [true, "password is required"]
    },
    tokens: [String]
})

//Encrypt password before we save it
userSchema.pre("save", async function (next){ //this is a document
    if (!this.isModified("password")) return next(); //pass in the name of the field, password
    this.password = await bcrypt.hash(this.password, saltRounds)
    next();
})

userSchema.pre("findOneAndUpdate", async function (next){ //this is not a document, it's a query
    if (!this._update.password) return next(); //pass in the name of the field, password
    this._update.password = await bcrypt.hash(this._update.password, saltRounds)
    next();
})

//login
userSchema.statics.loginWithCredentials = async (email, password) => {
    const user = await User.findOne({email: email})
    if(!user) throw new Error("user not found")
    const allow = await bcrypt.compare(password.toString(), user.password)
    if (!allow) throw new Error("incorrect password")
    
    return user
}

//Generate token upon signing in
userSchema.methods.generateToken = async function () {
    const jsonToken = jwt.sign( {email: this.email, id: this._id}, process.env.SECRET)
    this.tokens.push(jsonToken)
    await this.save()
    return jsonToken
}

//Delete fields we don't want to show (the password and version number)
userSchema.methods.toJSON = function () {
    console.log(this) //this is the user object, we want to delete password and __v so user can't see them
    const newObj = this.toObject()
    delete newObj.password;
    delete newObj.__v
    return newObj
}

userSchema.virtual("tours", {
    ref: "Tour", //the model to use
    localField: "_id", 
    foreignField: "organizer"
});


const User = mongoose.model("User", userSchema)

module.exports = User