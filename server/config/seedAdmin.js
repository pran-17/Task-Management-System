const bcrypt = require("bcryptjs");
const User = require("../models/User");

const DEFAULT_ADMIN = {
  name: "Admin",
  email: "praneeth@gmail.com",
  password: "praneeth123",
  role: "admin",
  isApproved: true
};

async function ensureDefaultAdmin() {
  const existing = await User.findOne({ email: DEFAULT_ADMIN.email });
  if (existing) return;

  // Migrate older default admin email if present.
  const oldAdmin = await User.findOne({ email: "admin@gmail.com", role: "admin" });
  if (oldAdmin) {
    oldAdmin.email = DEFAULT_ADMIN.email;
    oldAdmin.isApproved = true;
    await oldAdmin.save();
    // eslint-disable-next-line no-console
    console.log("Default admin email updated to:", DEFAULT_ADMIN.email);
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(DEFAULT_ADMIN.password, salt);

  await User.create({
    name: DEFAULT_ADMIN.name,
    email: DEFAULT_ADMIN.email,
    password: hashed,
    role: DEFAULT_ADMIN.role,
    isApproved: true
  });

  // eslint-disable-next-line no-console
  console.log("Default admin created:", DEFAULT_ADMIN.email);
}

module.exports = { ensureDefaultAdmin };

