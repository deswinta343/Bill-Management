import Pusher from 'pusher-js';

const pusher = new Pusher('92d0b93bdd5aa3b20b75', {
    cluster: 'ap1',
    encrypted: true,
});

// Mengikat ke sebuah channel
const channel = pusher.subscribe('my-channel');

// Menangani pesan yang diterima dari channel
channel.bind('my-event', function(data) {
    alert('Received message: ' + data.message);
});
