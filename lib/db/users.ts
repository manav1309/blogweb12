import connectDB from "./connection"
import { User } from "./models"
import bcrypt from "bcryptjs"

export async function getUserByEmail(email: string) {
  await connectDB()
  return await User.findOne({ email }).lean()
}

export async function getUserById(id: string) {
  await connectDB()
  return await User.findById(id).lean()
}

export async function createUser(data: {
  name: string
  email: string
  password: string
  role?: "super-admin" | "editor"
}) {
  await connectDB()

  const hashedPassword = await bcrypt.hash(data.password, 12)

  const user = new User({
    ...data,
    password: hashedPassword,
  })

  return await user.save()
}

export async function updateUser(id: string, data: any) {
  await connectDB()

  if (data.password) {
    data.password = await bcrypt.hash(data.password, 12)
  }

  return await User.findByIdAndUpdate(id, data, { new: true }).lean()
}

export async function getUsers(
  options: {
    search?: string
    role?: string
    page?: number
    limit?: number
  } = {},
) {
  await connectDB()

  const { search, role, page = 1, limit = 10 } = options

  const query: any = {}

  if (search) {
    query.$or = [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }]
  }

  if (role) {
    query.role = role
  }

  const skip = (page - 1) * limit
  const total = await User.countDocuments(query)
  const users = await User.find(query).select("-password").sort({ createdAt: -1 }).skip(skip).limit(limit).lean()

  return {
    data: users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  }
}
