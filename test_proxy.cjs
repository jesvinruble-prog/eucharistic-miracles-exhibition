const http = require('http');

http.get('http://www.therealpresence.org/eucharst/mir/english_pdf/Fiecht.pdf', (res) => {
  console.log('Status:', res.statusCode);
});
http.get('http://www.therealpresence.org/eucharst/mir/english_pdf/fiecht.pdf', (res) => {
  console.log('lowercase Status:', res.statusCode);
});
