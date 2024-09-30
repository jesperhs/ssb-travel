const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();

// Bruker Glitch sin miljøvariabel for port hvis den finnes
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname))); // Statisk servering av filer som index.html

let bookings = [];

// Funksjon for å generere en unik bookingreferanse
function generateReference() {
    return 'REF-' + Math.random().toString(36).substr(2, 9); // Genererer en enkel unik referanse
}

// Endpoint for å vise bookinger
app.get('/show_bookings', (req, res) => {
    if (bookings.length === 0) {
        return res.send('Ingen bookinger tilgjengelig.');
    }

    let bookingsHtml = `
    <h2>Bookinger</h2>
    <table border="1">
        <tr>
            <th>Referanse</th>
            <th>Navn</th>
            <th>E-post</th>
            <th>Telefon</th>
            <th>Dato</th>
            <th>Rute</th>
            <th>Handling</th>
        </tr>`;

    bookings.forEach((booking) => {
        bookingsHtml += `
        <tr>
            <td>${booking.reference}</td>
            <td>${booking.name}</td>
            <td>${booking.email}</td>
            <td>${booking.phone}</td>
            <td>${booking.date}</td>
            <td>${booking.direction}</td>
            <td><button onclick="deleteBooking('${booking.reference}')">Slett</button></td>
        </tr>`;
    });

    bookingsHtml += `
    </table>
    <script>
        function deleteBooking(reference) {
            if (confirm('Er du sikker på at du vil slette denne bookingen?')) {
                fetch('/delete_booking', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ reference }),
                })
                .then(response => response.text())
                .then(data => {
                    alert(data);
                    location.reload();
                });
            }
        }
    </script>`;

    res.send(bookingsHtml);
});

// Booking endpoint
app.post('/book', (req, res) => {
    const { name, email, phone, date, direction } = req.body;

    const countForDate = bookings.filter(b => b.date === date && b.direction === direction).length;

    if (direction === 'Kongsvinger' && countForDate >= 6) {
        return res.status(200).json({ message: 'Ruten fra Kongsvinger er fullbooket.' });
    } else if (direction === 'Oslo' && countForDate >= 6) {
        return res.status(200).json({ message: 'Ruten fra Oslo er fullbooket.' });
    }

    const reference = generateReference(); // Generer en unik bookingreferanse
    bookings.push({ reference, name, email, phone, date, direction });
    res.status(201).json({ message: `Booking registrert! Din referanse er: ${reference}`, reference });
});

// Slett booking
app.delete('/delete_booking', (req, res) => {
    const { reference } = req.body;
    const initialLength = bookings.length;
    
    // Filtrerer ut bookingen med den spesifikke referansen
    bookings = bookings.filter(b => b.reference !== reference);
    
    if (bookings.length < initialLength) {
        return res.send('Booking slettet!');
    } else {
        return res.send('Ingen booking funnet med denne referansen.');
    }
});

// Håndtere rotadressen og servere index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start serveren
app.listen(PORT, () => {
    console.log(`Server kjører på port ${PORT}`);
});
