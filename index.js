const express = require('express')
const app = express()
const mongoose = require('mongoose');
const cors = require('cors')
require("dotenv").config()

const port = process.env.PORT || 3006

// Middleware
app.use(cors())

// Connect to MongoDB 
const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
        process.exit(1);
    }
};

// health api
app.get('/health', (req, res) => {
    res.json({
        service: 'Trade Parsing and Balance Calculator',
        status: 'Active',
        time: new Date(),
    })
})

// Import routes
// const authRoute = require("./routes/auth")
// const storyRoute = require("./routes/storyRoutes")
// const likeRoute = require("./routes/likesRoutes")
// const bookmarkRoute = require("./routes/bookmarksRoutes")
// const shareRoute = require("./routes/shareRoutes")

// app.use('/api', authRoute)
// app.use('/api/story', storyRoute)
// app.use('/api/like', likeRoute)
// app.use('/api/bookmark', bookmarkRoute)
// app.use('/api/share', shareRoute)

// Start server
const startServer = async () => {
    await connectToDatabase();
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
};

startServer();