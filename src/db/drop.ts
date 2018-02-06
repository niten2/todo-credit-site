import { connectDb, dropDb } from "config/initialize/mongoose"

const main = async () => {
  try {
    await connectDb()
    await dropDb()

    console.log("drop all documents succsess")

  } catch (err) {
    console.log(err.stack)
  }

  process.exit()
}

main()
