// booking.js

const maxSeats = 20;  // Maks antall seter
let bookedSeats = 0;  // Antall bookede seter

document.getElementById('bookingForm').addEventListener('submit', function (event) {
    event.preventDefault();  // Forhindrer form fra å sende data før vi sjekker

    if (bookedSeats < maxSeats) {
        bookedSeats++;  // Øker antall bookede seter
        document.getElementById('message').textContent = `Plass booket! Antall ledige seter: ${maxSeats - bookedSeats}`;
    } else {
        document.getElementById('message').textContent = 'Beklager, bussen er fullbooket.';
        document.getElementById('message').classList.add('full');
    }
});
