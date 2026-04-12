// File: backend/controllers/authController.js
exports.register = async (req, res) => { res.json({ message: "Mock register successful", data: { id: "123", email: req.body.email } }); };
exports.login = async (req, res) => { res.json({ message: "Mock login successful", data: { user: { id: "123", email: req.body.email }, accessToken: "mock-token" } }); };
exports.refreshToken = async (req, res) => { res.json({ message: "Mock refresh successful", data: { accessToken: "mock-token-2" } }); };
exports.logout = async (req, res) => { res.json({ message: "Mock logout successful" }); };
exports.getMe = async (req, res) => { res.json({ message: "Mock getMe", data: { id: "123", email: "mock@local", role: "student" } }); };
exports.changePassword = async (req, res) => { res.json({ message: "Mock changePassword" }); };
