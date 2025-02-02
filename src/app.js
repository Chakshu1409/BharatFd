const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const faqRoutes = require('./routes/faqRoutes');
const path = require('path');
dotenv.config();
// Connect to DB
connectDB();
const app = express();
// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })); // Needed for form data
app.use(express.json()); // Needed for JSON requests
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// Routes
app.use('/api/faqs', faqRoutes);
// Health check
app.get('/', (req, res) => {
    res.render('admin'); // Ensure 'admin.ejs' is inside the 'views' directory
});
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});