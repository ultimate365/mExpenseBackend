const mongoose = require("mongoose");

var uriapp = `mongodb://${process.env.ADMINNAME}:${process.env.APPPASSWORD}@ac-8hdwteo-shard-00-00.kzeyg6g.mongodb.net:27017,ac-8hdwteo-shard-00-01.kzeyg6g.mongodb.net:27017,ac-8hdwteo-shard-00-02.kzeyg6g.mongodb.net:27017/${process.env.DATABASE}?ssl=true&replicaSet=atlas-xv30id-shard-0&authSource=admin&retryWrites=true&w=majority`;

mongoose
  .connect(uriapp, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((con) => console.log("Connected To DB"))
  .catch((err) => console.log("error", err));

module.exports = mongoose;
