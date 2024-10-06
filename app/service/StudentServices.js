import studentsModel from "../model/studentsModel.js";
import bcrypt from "bcrypt";
import {EncodeToken} from "../utility/tokenUtility.js";
import OTPModel from "../model/OTPModel.js";
import EmailSend from "../utility/emailUtility.js";

//registration service
export const registrationService = async (req) => {
    try{
        let {email, firstName, lastName, password} = req.body;

        if (!email || !firstName || !lastName || !password) {
            return { status: "error", message: "All fields are required!" };
        }

        const existingStudent = await studentsModel.findOne({email})
        if (existingStudent) {
            return { status: "error", message: "Email is already registered!" };
        }

        //hash password
        password = await bcrypt.hash(password, 10);

        // Create student with hashed password
        let newStudent ={email, firstName, lastName, password};

        let data = await studentsModel.create(newStudent);
        return { status: "success", message: "Registration successfully.", data: data };

    } catch (error) {
        return { status: "error", error: error.toString() };
    }
}

//login service
export const loginService = async (req, res) => {
    try {
        let { email, password } = req.body;

        // Check if all required fields are provided
        if (!email || !password) {
            return { status: "error", message: "All fields are required!" };
        }

        // Find the student by email
        let student = await studentsModel.findOne({ email });

        // If no student is found
        if (!student) {
            return { status: "error", message: "Invalid email or password!" };
        }

        // Compare the provided password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, student.password);
        if (!isPasswordValid) {
            return { status: "error", message: "Invalid email or password!" };
        }

        // If the password is valid, generate a JWT token
        let token = EncodeToken(student.email);

        // Set the cookie with JWT token
        let options = {
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            httpOnly: true,
            sameSite: "none",
            secure: true
        };

        res.cookie("Token", token, options);

        // Return success response with token and student data
        return { status: "success", token: token, data: { _id: student._id, email: student.email } };
    } catch (error) {
        return { status: "error", error: error.toString() };
    }
}

//profile read service
export const profileReadService = async (req) => {
    let email = req.headers.email;
    try {
        let MatchStage = {
            $match: {
                email,
            }
        };

        let project = {
            $project: {
                email: 1,
                firstName: 1,
                lastName: 1,
                img: 1,
                phone: 1,
                dateOfBirth: 1,
                address: 1,
                course: 1
            }
        }

        let data = await studentsModel.aggregate([
            MatchStage,
            project
        ]);

        return { status: "success", data: data[0] };
    } catch (error) {
        return { status: "error", error: error.toString() };
    }
}

//profile update service
export const profileUpdateService = async (req) => {
    // Retrieve the email from headers
    let email = req.headers.email;
    let updateData = req.body;

    try {
        // Find the student by email
        let student = await studentsModel.findOne({email});
        if (!student) {
            return {status: "error", message: "Student not found!"};
        }

        // Update profile fields if provided
        student.firstName = updateData.firstName
        student.lastName = updateData.lastName
        student.phone = updateData.phone
        student.dateOfBirth = updateData.dateOfBirth
        student.address = updateData.address
        student.course = updateData.course
        student.img = updateData.img

        // Save the updated student profile
        await student.save();

        return {status: "success", message: "Profile updated successfully.", data: student};
    } catch (error) {
        return {status: "error", error: error.toString()};
    }
}

//logout service
export const logOutService = async (res) => {
    try {
        res.clearCookie('Token');
        return { status: "success" };
    } catch (e) {
        return { status: "error", error: e.toString() };
    }
}


//verify email service
export const verifyEmailService = async (req) => {
    let email = req.params.email;
    let otp = Math.floor(100000 + Math.random() * 900000);

    try {
        // Email Account Query
        let UserCount = await studentsModel.aggregate([
            { $match: { email: email } },
            { $count: "total" },
        ]);

        if (UserCount[0].total === 1) {
            //Create OTP
            await OTPModel.updateOne(
                { email: email },
                {
                    otp,
                    status: 0,
                },
                { upsert: true, new: true }
            );
            // Send Email
            let SendEmail = await EmailSend(
                email,
                otp,
                "OTP Verification Code"
            );
            return { status: true, data: SendEmail };
        } else {
            return { status: false, data: "No User Found" };
        }
    } catch (error) {
        return { status: false, error: error.toString() };
    }
};

//verify otp service
export const verifyOTPService = async (req) => {
    let email = req.params.email;
    let otp = req.params.otp;
    otp = parseInt(otp);
    try {
        // otp verification
        let OTPCount = await OTPModel.aggregate([
            { $match: { email, otp, status: 0 } },
            { $count: "total" },
        ]);

        if (OTPCount[0].total === 1) {
            let OTPUpdate = await OTPModel.updateOne(
                {
                    email,
                    otp,
                    status: 0,
                },
                {
                    otp,
                    status: 1,
                }
            );
            return { status: true, data: OTPUpdate };
        } else {
            return { status: false, data: "Invalid Verification Code" };
        }
    } catch (error) {
        return { status: false, error: error.toString() };
    }
};

//reset password service
export const resetPasswordService = async (req) => {
    let email = req.params.email;
    let otp = req.params.otp;
    otp = parseInt(otp);
    let reqBody = {
        password: await bcrypt.hash(req.body.password, 10)
    };
    try {
        let OTPUsedCount = await OTPModel.aggregate([
            { $match: { email, otp, status: 1 } },
            { $count: "total" },
        ]);
        if (OTPUsedCount[0].total === 1) {
            // update password
            let passwordUpdate = await studentsModel.updateOne(reqBody);

            // otp reset
            await OTPModel.updateOne(
                {
                    email,
                    otp,
                    status: 1,
                },
                {
                    otp: null,
                    status: null,
                }
            );
            return { status: true, data: passwordUpdate };
        } else {
            return { status: false, data: "Something is Wrong!" };
        }
    } catch (error) {
        return { status: false, error: error.toString() };
    }
};