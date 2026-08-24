const app = require('../src/app.js');
const connectDB = require('../src/db/db.js');

module.exports = async (req, res) => {
    try {
        await connectDB();
        return app(req, res);
    } catch (error) {
        console.error('API startup error:', error.message);
        return res.status(503).json({ message: 'Database unavailable' });
    }
};