import mongoose from "mongoose";

const genderSchema = new mongoose.Schema({
    gender: {
        type: String,
        required: true
    }
});

export default mongoose.model("genders", genderSchema);