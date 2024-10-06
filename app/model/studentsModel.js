import mongoose from "mongoose";

const databaseSchema = mongoose.Schema(
    {
        email: { type: String, unique: true, required: true, lowercase: true },
        password: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        phone: { type: String, required: false, default: "" },
        dateOfBirth: { type: String, required: false, default: ""  },
        address: { type: String, required: false, default: ""  },
        course: {type: String, required: false, default: ""  },
        img: { type: String, required: false, default: ""  },
    },
    {
        timestamps: true,
        versionKey: false,
    }
)

const studentsModel = mongoose.model('students', databaseSchema)

export default studentsModel

