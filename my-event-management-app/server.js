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

// Define Member schema
const memberSchema = new mongoose.Schema({
    name: String,
    email: String,
});

const Member = mongoose.model('Member', memberSchema);

// Define event schema
const eventSchema = new mongoose.Schema({
    name: String,
    date: Date,
    time: String,
    location: String,
    description: String,
    invitedMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }]
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
app.get('/events/new', async (req, res) => {
    try {
        const members = await Member.find();
        res.render('new', { members: members });
    } catch (error) {
        console.error('Error fetching members:', error);
        res.status(500).send('Internal server error');
    }
});

// Route to handle adding a new event
app.post('/events', async (req, res) => {
    try {
        const { name, date, time, location, description, invitedMembers } = req.body;
        const event = new Event({ name, date, time, location, description, invitedMembers });
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
        const members = await Member.find();
        res.render('edit', { event: event, members: members });
    } catch (error) {
        console.error('Error fetching event for editing:', error);
        res.status(500).send('Internal server error');
    }
});

// Route to handle updating an event
app.put('/events/:id', async (req, res) => {
    try {
        const eventId = req.params.id;
        const { name, date, time, location, description, invitedMembers } = req.body;
        await Event.findByIdAndUpdate(eventId, { name, date, time, location, description, invitedMembers });
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

// Route to search for members by name or email
app.get('/members/search', async (req, res) => {
    try {
        const query = req.query.q; // Search query
        const members = await Member.find({
            $or: [
                { name: { $regex: query, $options: 'i' } }, // Search by name
                { email: { $regex: query, $options: 'i' } } // Search by email
            ]
        }); 
        res.json(members);
    } catch (error) {
        console.error('Error searching members:', error);
        res.status(500).send('Internal server error');
    }
});

// Route to fetch event invitations for a user
app.get('/invitations', async (req, res) => {
    try {
        const userId = req.user.id; // Assuming you have user authentication middleware
        const invitations = await Event.find({ 'invitedUsers.user': userId });
        res.json(invitations);
    } catch (error) {
        console.error('Error fetching event invitations:', error);
        res.status(500).send('Internal server error');
    }
});

// Route to update Accepted/Declined status for a user
app.put('/invitations/:eventId/respond', async (req, res) => {
    try {
        const userId = req.user.id; // Assuming you have user authentication middleware
        const eventId = req.params.eventId;
        const { status } = req.body; // Status can be 'accepted' or 'declined'

        // Update RSVP status for the user in the event document
        await Event.findOneAndUpdate(
            { _id: eventId, 'invitedUsers.user': userId },
            { $set: { 'invitedUsers.$.status': status } }
        );

        res.sendStatus(200);
    } catch (error) {
        console.error('Error updating RSVP status:', error);
        res.status(500).send('Internal server error');
    }
});

// Start the server
app.listen(3000);
