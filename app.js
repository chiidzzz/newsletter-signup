const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const mailchimpApiKey = "e91540831069ef9214d4b602b7f74743-us11";
const listId = "60749e8fac";
const mailchimpUrl = `https://us11.api.mailchimp.com/3.0/lists/${listId}`;

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  var firstName = req.body.fName;
  var lastName = req.body.lName;
  var email = req.body.email;

  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  var jsonData = JSON.stringify(data);

  var options = {
    url: mailchimpUrl,
    method: "POST",
    headers: {
      Authorization: `apikey ${mailchimpApiKey}`,
    },
    body: jsonData,
  };

  request(options, function (error, response, body) {
    if (error) {
      res.sendFile(__dirname + "/failure.html");
      console.log(response.statusCode);
    } else {
      if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
        console.log(response.statusCode);
      }
    }
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
