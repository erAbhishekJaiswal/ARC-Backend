const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
exports.UserRegister = async (req, res) => {
    const { name, email, password, phone, role } = req.body;
    try {
        if (!name || !email || !password || !phone || !role) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const ip = req.ip;
        const userAgent = req.headers['user-agent'];
        const deviceFingerprint = `${userAgent}-${ip}`; // Simplified version

        const user = await User.create({ name, email, password: hashPassword, phone, role, deviceFingerprint, ip, userAgent });


        await user.save()

        res.status(201).json({ message: 'User registered successfully', user: user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login a user
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {

        // Find user by email
        const user = await User.findOne({ email });

        // If no user is found, return an error
        if (!user) return res.status(400).json({ message: "User not found" });

        // Compare provided password with the stored one
        const isMatch = await bcrypt.compare(password, user.password);

        // If passwords don't match, return an error
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        user.password = undefined; // Remove password from user object
        user.lastActive = Date.now();

        await user.save()
        // Generate JWT with user ID and role
         const token = jwt.sign({ id: user._id, role: user.role }, 'gyaat12345', { expiresIn: '1h' });
         res.cookie('token', token, { httpOnly: true, maxAge: 30 * 60 * 60 * 1000 });
        res.status(200).json({ message: "Login successful", token, user });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Logout user
exports.logout = (req, res) => {
    // res.cookie( 'token','' , { maxAge: 0 });
    // Clear the JWT cookie
    res.clearCookie('token'); // Clear the token cookie
    res.status(200).json({ message: 'Logout successful' });
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude password from the response
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password'); // Exclude password from the response
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update user by ID
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// User activity logs
 exports.useractivitylogpost = async (req, res) => {
  const { userid, action, metadata } = req.body;
//   console.log(userid, action, metadata);
  
  try {
    const user = await User.findOne({ _id: userid });

    if (!user) return res.status(404).json({ message: 'User is not found in database' });

    user.activityLog.push({ action, metadata }); // timestamp is auto-handled
    user.lastActive = Date.now();
    await user.save();

    res.status(200).json({ message: 'Activity logged' });
  } catch (error) {
    console.error('Activity logging error:', error);
    res.status(500).json({ message: 'Failed to log activity' });
  }
}

// Get user Activity log by id
exports.userActivityById = async (req, res) => {
    try {
        const userid = req.params.userid;

        // console.log(userid);
        
        const user = await User.findOne({ _id: userid });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ name: user.name, email:user.email, phone:user.phone, role:user.role, activityLog: user.activityLog });
    } catch (error) {
        console.error('Guest activity log error:', error.message);
        res.status(500).json({ error: 'Guest activity log failed', message: error.message });
    }
}

// Get all user Log
exports.allUserActiviyLog =  async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ users });
    } catch (error) {
        console.error('User list error:', error.message);
        res.status(500).json({ error: 'User list failed', message: error.message });
    }
}

// Geust login
exports.guestLogin = async (req, res) => {
    try {
        // generate guest user id
        const guestId = 'guest';

        // Find user by email
        const user = await User.findOne({ _id: guestId });

        // If no user is found, return an error
        if (!user) return res.status(400).json({ message: "User not found" });
        

        // Generate JWT with user ID and role
        const token = jwt.sign({ id: 'guest', role: 'guest' }, 'gyaat12345', { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, maxAge: 30 * 60 * 60 * 1000 });
        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

