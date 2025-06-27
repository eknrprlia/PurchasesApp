const bcrypt = require('bcrypt'); // Ganti ke bcrypt asli

const password = 'password123';
const totalUser = 5;

for (let i = 0; i < totalUser; i++) {
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) throw err;
    console.log(`Hash untuk user ${i + 1}: ${hash}`);
  });
}
