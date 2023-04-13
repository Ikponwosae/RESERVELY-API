const mongoose = require('mongoose')
const { Agenda } = require('@hokify/agenda');
const { sendReminderEmail } = require('../controllers/appointment')

mongoose.set("strictQuery", false)

module.exports.connectDB = async(url) => {
  return mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
}

//function to create an agenda instance, connect to db and define agenda and start agenda
module.exports.startAgenda = async(url) => {
    try {
      const agenda = new Agenda({ db: { address: url }});

      //define agenda
      agenda.define('schedule reminder', async job => {
          //send reminder
          await sendReminderEmail(job.attrs.data);
  
      });
      
      //start agenda
      await agenda.start();
    } catch(error) {
      console.log(error);
    }
};
