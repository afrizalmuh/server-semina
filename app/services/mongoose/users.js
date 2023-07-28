const Users = require('../../api/v1/users/model')
const Organizers = require('../../api/v1/organizers/model')
const { BadRequestError, NotFoundError } = require('../../errors')

module.exports = {
  createOrganizer: async (req) => {
    const { organizer, role, email, password, confirmPassword, name } = req.body

    if (password !== confirmPassword)
      throw new BadRequestError('Password dan confirm paswword tidak sesuai')

    const result = await Organizers.create({ organizer });

    const users = await Users.create({
      email,
      name,
      password,
      organizer: result._id,
      role
    })

    delete users._doc.password;
    return users
  },
  createUsers: async (req) => {
    const { organizer, role, email, password, name, confirmPassword } = req.body

    if (password !== confirmPassword)
      throw new BadRequestError('Password dan confirm paswword tidak sesuai')

    const result = await Users.create({
      email,
      name,
      password,
      organizer: req.user.organizer,
      role
    })
    return result
  },
  getAllUsers: async (req) => {
    const result = await Users.find()
    if (!result)
      throw new NotFoundError('User tidak ada')
    return result
  }

}

// const createOrganizer = async (req) => {
//   const { organizer, role, email, password, confirmPassword, name } = req.body

//   if (password !== confirmPassword)
//     throw new BadRequestError('Password dan confirm paswword tidak sesuai')

//   const result = await Organizers.create({ organizer });

//   const users = await Users.create({
//     email,
//     name,
//     password,
//     organizer: result._id,
//     role
//   })

//   delete users._doc.password;
//   return users
// }



//module.exports = { createOrganizer }