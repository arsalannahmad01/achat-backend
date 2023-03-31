const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide valid email",
      ],
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    profilePic: {
      type: String,
    },
    savedContacts:{
        type:[mongoose.Types.ObjectId],
        ref:'User',
        unique:true
    }
  },
  { timestamps: true }
)

UserSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    bcrypt.hash(this.password, 10, (err, hash) => {
      if (err) return err

      this.password = hash
      next()
    })
  }
})


UserSchema.methods.comparePassword = async function (password) {
  if (!password) throw new Error("Password is missing")

  try {
    const result = await bcrypt.compare(password, this.password)
    return result
  } catch (error) {
    console.log("Error while comparing password!", error.message)
  }
}

UserSchema.methods.createJwt = function () {
  return jwt.sign({ email: this.email, id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
}

module.exports = mongoose.model("User", UserSchema)