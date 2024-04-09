const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/artclubDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

// Define event schema
const eventSchema = new mongoose.Schema({
    name: String,
    date: Date,
    time: String,
    location: String,
    description: String
});

const Event = mongoose.model('Event', eventSchema);

// Routes

// Home route - displays all events
app.get('/', async (req, res) => {
    try {
        const events = await Event.find();
        res.render('index', { events: events });
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).send('Internal server error');
    }
});

// Route to render the form for adding a new event
app.get('/events/new', (req, res) => {
    res.render('new');
});

// Route to handle adding a new event
app.post('/events', async (req, res) => {
    try {
        const { name, date, time, location, description } = req.body;
        const event = new Event({ name, date, time, location, description });
        await event.save();
        res.redirect('/');
    } catch (error) {
        console.error('Error adding event:', error);
        res.status(500).send('Internal server error');
    }
});

// Route to render the form for editing an event
app.get('/events/:id/edit', async (req, res) => {
    try {
        const eventId = req.params.id;
        const event = await Event.findById(eventId);
        res.render('edit', { event: event });
    } catch (error) {
        console.error('Error fetching event for editing:', error);
        res.status(500).send('Internal server error');
    }
});

// Route to handle updating an event
app.put('/events/:id', async (req, res) => {
    try {
        const eventId = req.params.id;
        const { name, date, time, location, description } = req.body;
        await Event.findByIdAndUpdate(eventId, { name, date, time, location, description });
        res.redirect('/');
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).send('Internal server error');
    }
});

// Route to handle deleting an event
app.delete('/events/:id', async (req, res) => {
    try {
        const eventId = req.params.id;
        await Event.findByIdAndDelete(eventId);
        res.redirect('/');
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).send('Internal server error');
    }
});

// Start the server
app.listen(3000);
