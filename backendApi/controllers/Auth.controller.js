const Model = require("../models/user.model");
const RoleModel = require("../models/role.model");
// const { registerSchema, registerUserSchema, registerVendorSchema, loginSchema, loginUserSchema, verifyOtpSchema, onboardInfluencerSchema, createUserSchema } = require('../Validations/auth_validation_schema')
const createError = require("http-errors");
var moment = require("moment");
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require("../Helpers/jwt_helper");

module.exports = {

  signUp: async (req, res, next) => {
    try {
      const result = req.body;
      resultRolesAllowed = ["Student", "Guardian", "Teacher"];
      if (!resultRolesAllowed.includes(result.role)) {
        throw createError.BadRequest("Invalid Role");
      }
      let UserRole = await RoleModel.findOne({ name: result.role });
      if (!UserRole) {
        const newSuperAdminRole = new RoleModel({
          name: "Super Admin",
          permissions: [
            "ROLES_VIEW",
            'DASHBOARD_VIEW',
            'ROLES_VIEW',
            'ROLES_ADD',
            'ROLES_EDIT',
            'ROLES_DELETE',
            'USERS_VIEW',
            'USERS_ADD',
            'USERS_EDIT',
            'USERS_DELETE',
            'PROFILE_VIEW',
            'SETTINGS_VIEW',
          ],
        });
        UserRole = await newSuperAdminRole.save();
      }
      const data = {
        name: result.name,
        email: result.email,
        password: result.password,
        confirmPassword: result.confirmPassword,
        ...result,
        role: UserRole._id,
      };
      const dataExists = await Model.findOne({
        $or: [{ email: data.email }],
        is_inactive: false,
      }).lean();
      if (dataExists) {
        throw createError.Conflict(
          `User already exists with email`
        );
      }
      const newData = new Model(data);
      const resultData = await newData.save();
      const accessToken = await signAccessToken(resultData._id);
      const refreshToken = await signRefreshToken(resultData._id);
      res.send({
        success: true,
        msg: "Registration Successful",
        accessToken,
        refreshToken,
        user: {
          id: resultData._id,
          name: resultData.name,
          email: resultData.email,
          role: resultData.role,
          mothers_name: resultData.mothers_name,
          fathers_name: resultData.fathers_name,
          dob: resultData.dob,
          school_name: resultData.school_name,
          preferred_subject: resultData.preferred_subject,
          manageable_subject: resultData.manageable_subject,
          highest_qualification: resultData.highest_qualification,
          board_name: resultData.board_name,
          role_name: UserRole.name,
          permissions: UserRole.permissions,
        },
      });
    } catch (error) {
      if (error.isJoi === true)
        return next(createError.BadRequest("Invalid Username/Password"));
      next(error);
    }
  },
  login: async (req, res, next) => {
    try {
      const result = req.body;
      let user =
        (await Model.findOne({ email: result.email })) ||
        (await Model.findOne({ mobile: result.email }));
      if (!user) {
        throw createError.NotFound("User not registered");
      }

      const isMatch = await user.isValidPassword(result.password);
      if (!isMatch)
        throw createError.NotAcceptable("Username/password not valid");
      const accessToken = await signAccessToken(user.id);
      const refreshToken = await signRefreshToken(user.id);
      const RoleData = await RoleModel.findOne({ _id: user.role });

      res.send({
        success: true,
        msg: "Login Successful",
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          mothers_name: user.mothers_name,
          fathers_name: user.fathers_name,
          dob: user.dob,
          school_name: user.school_name,
          preferred_subject: user.preferred_subject,
          manageable_subject: user.manageable_subject,
          highest_qualification: user.highest_qualification,
          board_name: user.board_name,
          role_name: RoleData.name,
          permissions: RoleData.permissions
        },
      });
    } catch (error) {
      if (error.isJoi === true)
        return next(createError.BadRequest("Invalid Username/Password"));
      next(error);
    }
  },
  refreshToken: async (req, res, next) => {
    try {
      // refresh access token with refresh token
      const { refreshToken } = req.body;
      if (!refreshToken) throw createError.BadRequest();
      const userId = await verifyRefreshToken(refreshToken);
      const accessToken = await signAccessToken(userId);
      const refToken = await signRefreshToken(userId);

      res.send({ accessToken, refreshToken: refToken });
      return;
    } catch (err) {
      next(err);
    }
  },
  profile: async (req, res, next) => {
    try {
      if (!req.user) throw createError.Unauthorized("User not found");
      const RoleData = await RoleModel.findOne({ _id: req.user.role });
      data = {
        success: true,
        msg: "Profile Fetched",
        user: {
          id: req.user.id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
          mothers_name: req.user.mothers_name,
          fathers_name: req.user.fathers_name,
          dob: req.user.dob,
          school_name: req.user.school_name,
          preferred_subject: req.user.preferred_subject,
          manageable_subject: req.user.manageable_subject,
          highest_qualification: req.user.highest_qualification,
          board_name: req.user.board_name,
          role_name: RoleData.name,
          permissions: RoleData.permissions
        },
      };
      data = JSON.parse(JSON.stringify(data));
      delete data.user.password;
      res.send(data);
    } catch (error) {
      if (error.isJoi === true)
        return next(createError.BadRequest("Invalid Username/Otp"));
      next(error);
    }
  },
};
