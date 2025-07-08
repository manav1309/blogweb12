const bcrypt = require("bcryptjs")
const mongoose = require("mongoose")

// User Schema (matching your models)
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["super-admin", "editor"],
      default: "editor",
    },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
)

const User = mongoose.models.User || mongoose.model("User", userSchema)

async function createAdminUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("Connected to MongoDB")

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ role: "super-admin" })
    if (existingAdmin) {
      console.log("Admin user already exists:", existingAdmin.email)
      return
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 12)

    const adminUser = new User({
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      role: "super-admin",
      active: true,
    })

    await adminUser.save()
    console.log("✅ Admin user created successfully!")
    console.log("Email: admin@example.com")
    console.log("Password: admin123")
    console.log("⚠️  Please change the password after first login!")
  } catch (error) {
    console.error("Error creating admin user:", error)
  } finally {
    await mongoose.disconnect()
  }
}

createAdminUser()
