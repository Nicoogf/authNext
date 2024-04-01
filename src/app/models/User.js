import mongoose , {Schema , Document , ObjectId } from "mongoose";


const UserSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type : String,
        required: true
    }
    },
    {
        versionKey : false ,
        timestamps: true
    }
)


const User = mongoose.models.User || mongoose.model("User", UserSchema)
export default User 