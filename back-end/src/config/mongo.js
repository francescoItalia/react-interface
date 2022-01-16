const mongoose = require('mongoose');

class Connection {
  static async connectToMongo() {
    try {
      if (this.db) return this.db;
      return await mongoose.connect(this.url, this.options);
    } catch (e) {
      console.error(e);
    }
  }
}

Connection.db = null;
Connection.url = process.env.url;
Connection.options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

module.exports = { Connection };
