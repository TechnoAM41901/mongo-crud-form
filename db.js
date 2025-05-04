const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = 'mongodb://127.0.0.1:27017/'; // Replace with your MongoDB connection string
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;










// useNewUrlParser: true

// This option tells Mongoose to use the new URL string parser.
//  The old parser was deprecated, and the new one provides better
//  support for certain connection string features, including handling 
// special characters and parsing MongoDB connection URLs more efficiently.
//  By setting useNewUrlParser: true, you ensure that your application uses
//  the latest and most reliable parser available.

// useUnifiedTopology: true

// This option tells Mongoose to use the new unified topology engine.
//  The old topology engine is deprecated and the new one provides a
// more consistent behavior and solves several issues related to connection
//  handling and monitoring. It includes features such as:

// Improved server discovery and monitoring.

// More efficient connection pool management.

// Simplified codebase and improved maintainability.


// process.exit(1);

// This line exits the Node.jsprocess with a failure code (1) if the
//  connection fails.