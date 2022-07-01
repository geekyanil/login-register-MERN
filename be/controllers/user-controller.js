const User = require("../models/User");

// register
exports.register = async (req, res) => {
  try {
    // getting the value of name, email and password
    const { name, email, password } = req.body;

    // checking user email is present on the database or not
    let user = await User.findOne({ email });

    // checking if email is present on database
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already Exists",
      });
    }

    // if user is not present in the database then creating the user
    user = await User.create({ name, email, password });

    //  setting token and expiring time
    const token = await user.generateToken();
    const options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 1000),
      httpOnly: true,
    };

    res.status(200).cookie("token", token, options).json({
      success: true,
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Login

exports.login = async (req, res) => {
  try {
    // Getting the value of email and password
    const { email, password } = req.body;

    // checking the value of email and password are present in email and password
    const user = await User.findOne({ email }).select("+password");

    // Checking user is present or not
    if (!user) {
      return res.status(400).json({
        success: true,
        message: "User doesn't exist",
      });
    }

    // Checking password is correct or not
    const isMatch = await user.matchPassword(password);

    // if password is not correct
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }

    // generating the token for the particular user
    const token = await user.generateToken();
    const options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 1000),
      httpOnly: true,
    };

    res
      .status(200)
      .cookie("token", token, options)
      .json({
        success: [true, "Login successful"],
        user,
        token,
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// logout
exports.logout = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", null, { expires: new Date(Date.now()), httpOnly: true })
      .json({
        success: true,
        message: "logout",
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all users ---- (Admin)
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single User---- (Admin)
exports.getSingleUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json({
        success: true,
        message: "user not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: true,
    });
  }
};

// update user Role -----(Admin)
exports.updateUserRole = async (req, res, next) => {
  try {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
    };

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// delete user -----( Admin)
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    await user.remove();

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: true,
      message: error.message,
    });
  }
};
