const users = require("../models/users.models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { rmSync } = require("fs");

const register = async (req, res) => {
  try {
    const { password } = req.body;

    const isemailAvailable = await users.findOne({ email: req.body.email });
    if (isemailAvailable) {
      return res.status(403).send({ message: "Email already registered!" });
    }

    const isUsernameAvailable = await users.findOne({
      username: req.body.username,
    });
    if (isUsernameAvailable) {
      return res
        .status(403)
        .send({ message: "Username already taken! Try different" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);
    await delete password;
    const registerUser = await new users({
      ...req.body,
      password: hashPassword,
    });
    await registerUser.save();
    return res.status(201).send({ message: "Registeration successfully" });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Error registering the user", error: error });
  }
};

const login = async (req, res) => {
  try {
    const payload = req.body;

    const isUsernameValid = await users.findOne({ username: payload.username });

    if (isUsernameValid) {
      const isPasswordCorrect = await bcrypt.compare(
        payload.password,
        isUsernameValid.password
      );

      if (isPasswordCorrect) {
        const token = await jwt.sign(
          { id: isUsernameValid._id },
          process.env.secret
        );
        

        res.cookie("accessToken", token, { httpOnly: true, sameSite: "none", secure: true, expire: new Date() + 86400000 });
        return res
          .status(200)
          .send({
            message: "Success",
            data: {
              userid: isUsernameValid._id,
              username: isUsernameValid.username,
            }
          });
      }
      return res.status(401).send({ message: "Incorrect password!" });
    } else {
      return res.status(401).send({ message: "Username not available!" });
    }
  } catch (error) {
    return res.status(500).send({ message: "Couldn't login!", error: error });
  }
};

const forgetPassword = async (req, res) => {
  try {
    const isEmailAvailable = await users.findOne({ email: req.body.email });

    if (isEmailAvailable) {
      let secret_code = crypto.randomBytes(10).toString("hex");

      const salt = bcrypt.genSaltSync(10);
      const hashSecret = bcrypt.hashSync(secret_code, salt);

      const save_token = await users.findOneAndUpdate(
        { email: req.body.email },
        { $set: { temp_token: hashSecret } },
        { new: true }
      );

      if (save_token) {
        //node mailer code:
        const nodemailerFunction = async () => {
          try {
            let transporter = nodemailer.createTransport({
              service: "gmail",
              host: "smtp.gmail.com",
              port: 465,
              secure: true,
              auth: {
                user: process.env.from_email,
                pass: process.env.from_gpassword,
              },
            });

            let mailOptions = {
              from: process.env.from_email,
              to: isEmailAvailable.email,
              subject: "Todolist 2.0 - Login assistance",
              html: `
                            
                            <div>
                                <p>Dear ${isEmailAvailable.username}, please find the secret key for your password assistance!</p>
                                <span><strong>Secret code: </strong><i>${secret_code}</i></span>
                                <p>The code is valid for a period of <strong>10 minutes only</strong></p>
                                <div>
                                    <p>- Todolist support team</p>
                                </div>
                            </div>
                            
                            `,
            };

            await transporter.sendMail(mailOptions, (err, data) => {
              if (err) {
                return res
                  .status(500)
                  .send({ message: "Error while sending email", error: err });
              }
              return res.status(201).send({
                message: `A secret has been sent to ${isEmailAvailable.email}`,
              });
            });
          } catch (error) {
            return res
              .status(500)
              .send({ message: "Error triggering email!", error: error });
          }
        };
        nodemailerFunction();
      }
    } else {
      return res.status(401).send({ message: "Email id not registered!" });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Error initiating the password reset!", error: error });
  }
};

const verifyandUpdatePassword = async (req, res) => {
  try {
    const payload = req.body;

    const findEmail = await users.findOne({ email: payload.email });

    if (!findEmail) {
      return res.status(401).send({ message: "Email not found!" });
    }

    const verifySecretCode = await bcrypt.compare(
      payload.code,
      findEmail.temp_token[0]
    );
    if (!verifySecretCode) {
      return res
        .status(401)
        .send({ message: "Invalid code or code might have expired" });
    }

    const salt = bcrypt.genSaltSync(10);
    const newHashPassword = bcrypt.hashSync(payload.newpassword, salt);
    const removeTempToken = await users.findOneAndUpdate(
      { email: payload.email },
      { $set: { temp_token: null } }
    );

    if (removeTempToken) {
      const updateNewPassword = await users.findOneAndUpdate(
        { email: payload.email },
        { $set: { password: newHashPassword } }
      );

      if (updateNewPassword) {
        return res.status(201).send({ message: "New password updated!" });
      }
    }
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Error verifying password", error: error });
  }
};

module.exports = { register, login, forgetPassword, verifyandUpdatePassword };
