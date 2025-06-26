const http = require('http');
const app = require('./app');
const port = process.env.port || 5000
const server = http.createServer(app)


server.listen(port, () => {
    console.log('Server is listening at post:', port);
});