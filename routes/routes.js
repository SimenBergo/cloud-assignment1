const express = require("express");
const UserModel = require("../schema/schema");

const router = express.Router();



//For creating a new user
router.post("/createuser", async (req, res) => {
  const { personal_nr, firstname, lastname, dateofbirth, city } = req.body;

  let userExists = await UserModel.findOne({ personal_nr });
  if (userExists) {
    return res
      .status(400)
      .render('createuser.ejs', { response: "person already exists in database!" });
  }
  let account_nr = Math.floor(Math.random() * 1000000 + 1);
  let createddate = new Date();
  const user = await UserModel.create({
    account_nr,
    personal_nr,
    firstname,
    lastname,
    dateofbirth,
    city,
    createddate,
  });
  let newUser = `Signup successful! You are now a customer, here is your new account number: ${user.account_nr}`;
  return res.status(200).render('createuser.ejs', { output: newUser }
  );
});

//For measuiring end to end latency.
router.post(
  '/latency', (req, res) => {
    let personalNumber = 1234567890;
    let start = new Date().getTime();
    UserModel.findOne({ personal_nr: personalNumber })
    .then(result => {
      if(result) {
        let end = new Date().getTime();
        let latency = `${end - start} ms (End to end)`;
        
         return res.render('latency.ejs', { response: latency });
      } else {
        res.render('latency.ejs', { response: `Error measuring latency`});
      }
    })
  }
);

//For updating user details:
router.post("/updateuser", async (req, res) => {
  let params = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    personal_nr: req.body.personal_nr,
    dateofbirth: req.body.dateofbirth,
    city: req.body.city,
  };

  for (let prop in params) if (!params[prop]) delete params[prop];

  let personal_nr = req.body.personal_nr;
  let filter = { personal_nr };

  await UserModel.findOneAndUpdate(filter, params, function (err, user) {
    if (err) {
      return res.status(400).json("Error updating user");
    } else if (Boolean(user)) {
       
      let updatedUser = `User with personal number ${req.body.personal_nr} updated!`;
        res.status(200)
        .render('updateuser.ejs', { response: updatedUser});
    } else {
      return res.status(400).json({
        message: "Check if personal number is correct",
        user: req.body.personal_nr,
      });
    }
  });
});

//For deleting user:
router.post("/deleteuser", async function (req, res) {
  UserModel.findOneAndDelete(
    { personal_nr: req.body.personal_nr },
    function (err, user) {
      if (err) {
        return res.status(400).json("Error deleting user");
      } else if (Boolean(user)) {
          let deletedUser = `User with personal number ${req.body.personal_nr} deleted from DB!`;
        return res
          .status(200)
          .render(
            'deleteuser.ejs', { response: deletedUser }
          );
      } else {
        return res.status(400).json({
          message: "Check if personal number is correct",
          user: req.body.personal_nr,
        });
      }
    }
  );
});

//For checking if user exists, and returning account nr.
router.get(
    "/checkaccountnr",
    async (req, res) => {
      let personalNumber = parseInt(req.query.personal_nr);
      console.log(personalNumber);
      
      await UserModel.findOne({ personal_nr: personalNumber })
        .then((users) => {
       //console.log(users);
            if (users) {
            let userFound = `Your account number is ${users.account_nr}, and your name is ${users.firstname} ${users.lastname}`;
            console.log(userFound);
            res.status(200).render('index.ejs', { response: userFound } 
            );
      } else {
      return res.status(400).render('index.ejs', { response: `No user with personal number ${personalNumber} exists!`});
      };
    })    
  });

module.exports = router;