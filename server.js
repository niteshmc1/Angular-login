var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    userRoutes = require('./expressRouter/userRouter'),
    path = require('path');

const app = express();
app.use(bodyParser.json());
var port = process.env.PORT || 3030;
const mongoUri = "mongodb://admin:admin@ds123399.mlab.com:23399/messenger";
mongoose.connect(mongoUri).then(
    () => {console.log('Database is connected') },
    err => { console.log('Can not connect to the database'+ err)}
  );

app.use('/users', userRoutes);
app.use(express.static('./dist'));
app.use('/*', express.static(path.resolve('dist/index.html')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

var server = app.listen(port, function(){
    console.log('Listening on port ' + port);
});