require('dotenv').config()
require('../Helpers/init_mongodb')

// const RoleModel = require('./../Models/Role.model')
const UserModel = require('./../Models/User.model')

const init_auth = async () => {
    let suRole = await RoleModel.findOne({ name: process.env.SUPER_ADMIN_INITIALS }, { _id: 1 });
    if (!suRole) {
        console.log('Generating SU Role...');
        suRole = await RoleModel.create({ name: process.env.SUPER_ADMIN_INITIALS });
        console.log('Role SU Generated!');
    }
    let userRole = await RoleModel.findOne({ name: "User", topRole: suRole._id }, { _id: 1 });
    if (!userRole) {
        console.log('Generating User Role...');
        userRole = await RoleModel.create({ name: "User", topRole: suRole._id });
        console.log('Role User Generated!');
    }
    let vendorRole = await RoleModel.findOne({ name: "Vendor", topRole: suRole._id }, { _id: 1 });
    if (!vendorRole) {
        console.log('Generating Vendor Role...');
        vendorRole = await RoleModel.create({ name: "Vendor", topRole: suRole._id });
        console.log('Role Vendor Generated!');
    }
    let suUser = await UserModel.findOne({ role: suRole._id }, { _id: 1 });
    if (!suUser) {
        const password = generatePassword();
        console.log('Generating User...');
        suUser = await UserModel.create({ full_name: "Super Admin", email: `suadmin@${process.env.DOMAIN}`, password, role: suRole._id });
        console.log('User Generated!');
        console.table({ email: `suadmin@${process.env.DOMAIN}`, password });
        console.log('Above is `Super Admin` Credentials, Save it carefully and update as soon as possible!');
    }
    console.log('Done!!')
    process.exit()
}

function generatePassword() {
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

init_auth()
