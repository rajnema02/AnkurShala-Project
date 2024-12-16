const userModel = require('../Models/User.model');
const roleModel = require('../Models/Role.model');

module.exports = {
    inactiveUser: async () => {
        try {

            const uRole = await roleModel.findOne({ name: new RegExp('User', 'i') }, { _id: 1 })
            if (!uRole) return;
            let query = {};
            query = {
                email: { $exists: false }, full_name: { $exists: false }, is_profile_completed: true, role: uRole._id
            }
            const users = await userModel.updateMany(query, { $set: { disabled: true, is_inactive: true } })
        } catch (error) {
            console.log(error);
        }
    }
}