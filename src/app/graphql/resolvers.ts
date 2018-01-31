import { User, Client, Loan } from "app/models"
import { createJwt } from "app/services/jwt"

const Query = {
  users: async (root: any, args: any) => {
    const users = await User.find()
    return users
  },

  user: async (root: any, args: any) => {
    const user = await User.findById(args.id)
    return user
  },

  clients: async (root: any, args: any) => {
    const clients = await Client.find()
    return clients
  },

  client: async (root: any, args: any) => {
    const client = await Client.findById(args.id)

    await Loan.populate(client, "loans")

    // await Loan.populate(loan, {
    //   path: 'client',
    //   populate: { path: 'territory' }
    // })

    return client
  },

}

const Mutation = {

  createUser: async (root: any, args: any, ctx: any) => {
    ctx.ability.throwUnlessCan('create', User)

    const user = await User.create(args.input)
    return user
  },

  updateUser: async (root: any, args: any) => {
    const user = await User.findById(args.input.id)
    await user.set(args.input)
    await user.save()

    return user
  },

  deleteUser: async (_: any, args: any) => {
    const user = await User.findByIdAndRemove(args.input.id)
    return user
  },

  createToken: async (_: any, args: any): Promise<object> | never => {
    const { email, password } = args.input

    const user = await User.findOne({ email: email })

    if (!user) {
      throw new Error("user not found")
    }

    if (!await user.comparePassword(password)) {
      throw new Error("wrong password")
    }

    const value = await createJwt(user)

    return {
      id: user.id,
      email: user.email,
      value,
    }
  },

  createClient: async (root: any, args: any, ctx: any) => {
    ctx.ability.throwUnlessCan('create', Client)

    return await Client.create(args.input)
  },

  updateClient: async (root: any, args: any, ctx: any) => {
    ctx.ability.throwUnlessCan('update', Client)

    const client = await Client.findById(args.input.id)
    await client.set(args.input)
    await client.save()

    return client
  },

  deleteClient: async (_: any, args: any) => {
    const client = await Client.findByIdAndRemove(args.input.id)

    return client
  },

  createLoan: async (root: any, args: any, ctx: any) => {
    ctx.ability.throwUnlessCan('create', Loan)

    const client = await Client.findById(args.input.client)
    const loan =  await Loan.create(args.input)

    await client.addLoan(loan)

    return loan
  },
}

export default { Query, Mutation }
