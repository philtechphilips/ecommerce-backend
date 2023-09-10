import dotenv from "dotenv";
import safeCompare from "safe-compare";
import User from "../models/user";
import { errorResponse, successResponse } from "../helpers/response";
import { create, fetchOne, isUnique, update } from "../helpers/schema";
import { decodeVerificationToken, generateVerificationToken, hashPassword, saveVerificationToken, validatePassword } from "../utils/base";
import { sendMail } from "../utils/email";
import { getYear } from "date-fns";
import jwt from "jsonwebtoken";
const cloudinary = require("../config/cloudinary")


dotenv.config();

const verifyEmail = async function (req, res) {
    let {
        email
    } = req.body;

    try {
        const user = await fetchOne(User, { email });
        if (user) {
            return successResponse(res, {
                statusCode: 200,
                message: "User exist!.",
                payload: user,
            });
        } else {
            return errorResponse(res, {
                statusCode: 404,
                message: "User not found!.",
                payload: user,
            });
        }
    } catch (error) {
        console.log(error);
        return errorResponse(res, {
            statusCode: 500,
            message: "An error occured, pls try again later.",
        });
    }
}

const signup = async function (req, res) {
    let {
        first_name,
        last_name,
        email,
        password
    } = req.body;
    let user, responseData, token, verificationCode;
    try {
        user = await isUnique(User, { email });
        if (!user) {
            return errorResponse(res, {
                statusCode: 400,
                message: "Email taken by another user.",
            });
        }
        password = await hashPassword(password);
        user = {
            first_name,
            last_name,
            email,
            password,
        };
        user = await create(User, user);
        token = await user.generateAuthToken();
        verificationCode = await generateVerificationToken();
        await saveVerificationToken(verificationCode, user.email)
        if (user) {
            const subject = `Welcome, Onboard to ${process.env.EMAIL_SENDER_NAME}`;
            const html = `<!DOCTYPE html>
            <html>
            <head>
              <style>
              @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
              </style>
            </head>
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="padding: 20px 0; text-align: center; background-color: #333333;">
                    <h2 style="color: #ffffff;">Welcome, Onboard to ${process.env.EMAIL_SENDER_NAME}</h2>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px; background-color: #ffffff;">
                  <p>Hi ${user.first_name},</p>
                  <p>Welcome to Viruc Ecommerce, your one-stop destination for all things stylish, innovative, and essential. We're thrilled to have you join our family of savvy shoppers! 🛍️
                  At Viruc, we believe in providing you with top-notch products that enhance your lifestyle. From fashion and electronics to home essentials, our diverse range has something special for everyone.</p>
                  <p>Kindly use the verification code below to finalize your account registration.</p>
                  <p>${verificationCode}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px; text-align: center; background-color: #333333;">
                    <p style="color: #ffffff; margin: 0;">© ${getYear(new Date())} ${process.env.EMAIL_SENDER_NAME}. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </body>
            </html>
            `
            const recepient = user.email;
            sendMail(subject, html, recepient);
        }
        responseData = {
            payload: user,
            token,
            statusCode: 201,
            message: "A verification token has been sent to your email.",
        };
        return successResponse(res, responseData);
    } catch (error) {
        console.log(error);
        return errorResponse(res, {
            statusCode: 500,
            message: "An error occured, pls try again later.",
        });
    }
};

const login = async function (req, res) {
    const { email, password } = req.body;
    let user, token;
    try {
        user = await fetchOne(User, { email });
        if (!user) {
            return errorResponse(res, {
                statusCode: 400,
                message: "User cannot be found.",
            });
        }

        const passwordValid = await validatePassword(password, user.password);
        if (!passwordValid) {
            return errorResponse(res, {
                statusCode: 400,
                message: "Invalid login credentials.",
            });
        }

        if (!user.isVerified) {
            return errorResponse(res, {
                statusCode: 400,
                message: "Please confirm your email to login.",
            });
        }
        token = await user.generateAuthToken(); 
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        return successResponse(res, {
            statusCode: 200,
            message: "Login successful.",
            payload: user,
            token,
            tokenExp: decoded.iat
        });
    } catch (error) {
        console.log(error);
        return errorResponse(res, {
            statusCode: 500,
            message: "An error occured, pls try again later.",
        });
    }
};

const verifyOTP = async function (req, res) {
    const { token } = req.body;
    let user, email;
    try {
        email = await decodeVerificationToken(token);
        if (!email) {
            return errorResponse(res, {
                statusCode: 400,
                message: "Invalid or Expired Token.",
            });
        }
        user = await fetchOne(User, { email });
        if (!user) {
            return errorResponse(res, {
                statusCode: 400,
                message: "User cannot be found.",
            });
        }

        if (user.isVerified === true) {
            return errorResponse(res, {
                statusCode: 400,
                message: "User profile is verified!",
            });
        }

        user = await update(User, { email }, { isVerified: true })
        if (!user) {
            return errorResponse(res, {
                statusCode: 400,
                message: "Unable to verify account!",
            });
        }
        return successResponse(res, {
            statusCode: 200,
            message: "Account verified sucessfully!",
            payload: email
        });
    } catch (error) {
        console.log(error);
        return errorResponse(res, {
            statusCode: 500,
            message: "An error occured, pls try again later.",
        });
    }
};

const resendVerificationToken = async function (req, res) {
    const { email } = req.body;
    let user;
    try {
        user = await fetchOne(User, { email });
        if (!user) {
            return errorResponse(res, {
                statusCode: 400,
                message: "User cannot be found.",
            });
        }
        const verificationCode = await generateVerificationToken();
        await saveVerificationToken(verificationCode, user.email)
        if (user) {
            const subject = `Welcome, Onboard to ${process.env.EMAIL_SENDER_NAME}`;
            const html = `<!DOCTYPE html>
            <html>
            <head>
              <style>
              @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
              </style>
            </head>
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="padding: 20px 0; text-align: center; background-color: #333333;">
                    <h2 style="color: #ffffff;">Welcome, Onboard to ${process.env.EMAIL_SENDER_NAME}</h2>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px; background-color: #ffffff;">
                  <p>Hi ${user.first_name},</p>
                  <p>Kindly use the verification code below to finalize your account registration.</p>
                  <p>${verificationCode}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px; text-align: center; background-color: #333333;">
                    <p style="color: #ffffff; margin: 0;">© ${getYear(new Date())} ${process.env.EMAIL_SENDER_NAME}. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </body>
            </html>
            `
            const recepient = user.email;
            sendMail(subject, html, recepient);
        }
        return successResponse(res, {
            statusCode: 200,
            message: "Verification token sent sucessfully!",
        });
    } catch (error) {
        console.log(error);
        return errorResponse(res, {
            statusCode: 500,
            message: "An error occured, pls try again later.",
        });
    }
};

const viewProfile = async function (req, res) {
    const { user } = req;
    try {
        return successResponse(res, {
            statusCode: 200,
            message: "Profile successfully loaded.",
            payload: user,
        });
    } catch (error) {
        console.log(error);
        return errorResponse(res, {
            statusCode: 500,
            message: "An error occured, pls try again later.",
        });
    }
};

const updateProfile = async function (req, res) {
    const { first_name, last_name, phone_number, dob, gender } = req.body;
    console.log(req.body)
    let { user } = req;
    console.log(user._id)
    try {
        user = await update(
            User,
            { _id: user?._id },
            {
                first_name,
                last_name,
                phone_number,
                dob,
                gender
            }
        );
        return successResponse(res, {
            statusCode: 200,
            message: "Profile successfully updated.",
            payload: user,
        });
    } catch (error) {
        console.log(error);
        return errorResponse(res, {
            statusCode: 500,
            message: "An error occured, pls try again later.",
        });
    }
};

const forgotPassword = async function (req, res) {
    const { email } = req.body;
    let user, token;
    try {
        user = await fetchOne(User, { email });
        if (!user) {
            return errorResponse(res, {
                statusCode: 400,
                message: "User cannot be found.",
            });
        }
        const verificationCode = await generateVerificationToken();
        await saveVerificationToken(verificationCode, user.email)
        if (user) {
            const subject = `Verification code for ${process.env.EMAIL_SENDER_NAME}`;
            const html = `<!DOCTYPE html>
            <html>
            <head>
              <style>
              @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
              </style>
            </head>
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="padding: 20px 0; text-align: center; background-color: #333333;">
                    <h2 style="color: #ffffff;">Welcome, Onboard to ${process.env.EMAIL_SENDER_NAME}</h2>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px; background-color: #ffffff;">
                  <p>Hi ${user.first_name},</p>
                  <p>Kindly use the verification code below to finalize your account registration.</p>
                  <p>${verificationCode}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px; text-align: center; background-color: #333333;">
                    <p style="color: #ffffff; margin: 0;">© ${getYear(new Date())} ${process.env.EMAIL_SENDER_NAME}. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </body>
            </html>
            `
            const recepient = user.email;
            sendMail(subject, html, recepient);
        }
        return successResponse(res, {
            statusCode: 200,
            message: "Verification token sent to your mail!",
        });
    } catch (error) {
        console.log(error);
        return errorResponse(res, {
            statusCode: 500,
            message: "An error occured, pls try again later.",
        });
    }
};

const verifyResetPassword = async function (req, res) {
    const { token } = req.body;
    let user, email;
    try {
        email = await decodeVerificationToken(token);
        if (!email) {
            return errorResponse(res, {
                statusCode: 400,
                message: "Invalid or Expired Token.",
            });
        }
        user = await fetchOne(User, { email });
        if (!user) {
            return errorResponse(res, {
                statusCode: 400,
                message: "User cannot be found.",
            });
        }
        return successResponse(res, {
            statusCode: 200,
            message: "Account verified sucessfully!",
            payload: email
        });
    } catch (error) {
        console.log(error);
        return errorResponse(res, {
            statusCode: 500,
            message: "An error occured, pls try again later.",
        });
    }
};

const resetPassword = async function (req, res) {
    let { email, password } = req.body;
    let user;
    password = await hashPassword(password);
    try {
        user = await fetchOne(User, { email });
        if (!user) {
            return errorResponse(res, {
                statusCode: 400,
                message: "User cannot be found.",
            });
        }
        user = await update(
            User, { email }, { password }
        );
        return successResponse(res, {
            statusCode: 200,
            message: "Password reset successful, kindly login with your new password.",
            payload: user,
        });
    } catch (error) {
        console.log(error);
        return errorResponse(res, {
            statusCode: 500,
            message: "An error occured, pls try again later.",
        });
    }
};

const uploadProfileImage = async function (req, res) {
    const { _id } = req.user;
    let user, profileImgUrl;
    try {
        if (!req.files) {
            throw new Error("Please upload a valid image.");
        }
        const path = req.files.profileImg.tempFilePath;
        const upload = await cloudinary.uploader.upload(path, {
            folder: "profileImage",
            width: 100, 
            height: 100, 
            crop: "fill"
        });
        if (!upload) throw new Error("Error occured while uploading image.");
        profileImgUrl = upload.secure_url;
        user = await update(
            User,
            { _id },
            {
                profileImgUrl,
            }
        );
        return successResponse(res, {
            statusCode: 200,
            message: "Profile image uploaded.",
            payload: user,
        }); 
    } catch (error) {
        console.log(error.message);
        return errorResponse(res, {
            statusCode: 500,
            message: "An error occured, pls try again later.",
        });
    }
}

const getAuthenticatedUser = async function (req, res) {
    const user = req.user;

    try {
        if (user) {
            return successResponse(res, {
                statusCode: 200,
                message: "User exist!.",
                payload: user,
            });
        } else {
            return errorResponse(res, {
                statusCode: 404,
                message: "User not found!.",
                payload: user,
            });
        }
    } catch (error) {
        console.log(error);
        return errorResponse(res, {
            statusCode: 500,
            message: "An error occured, pls try again later.",
        });
    }
}

const refreshToken = async function (req, res) {
    const { refreshToken } = req.body;

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

        const user = await User.findOne({ _id: decoded._id });

        if (!user) {
            return errorResponse(res, {
                statusCode: 400,
                message: "User not found.",
            });
        }

        const accessToken = await user.generateAuthToken();

        return successResponse(res, {
            statusCode: 200,
            message: "Token refreshed successfully.",
            token: accessToken,
            tokenExp: decoded.iat
        });
    } catch (error) {
        console.log(error);
        return errorResponse(res, {
            statusCode: 500,
            message: "An error occurred while refreshing the token.",
        });
    }
};

export {
    verifyEmail,
    signup,
    login,
    verifyOTP,
    resendVerificationToken,
    viewProfile,
    updateProfile,
    forgotPassword,
    verifyResetPassword,
    resetPassword,
    uploadProfileImage,
    getAuthenticatedUser,
    refreshToken
}