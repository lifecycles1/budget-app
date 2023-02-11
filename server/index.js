// this imports express framework into your node.js server (express framework helps for routing)
const express = require("express");
// this imports dotenv package that allows the server to pickup the .env file
require("dotenv").config();
// instantiating an "app" variable from the express package
const app = express();
// you're telling the "app" to use "express.json()" allowing you to send and receive data in json format
app.use(express.json());
// this is instantiating a spreadsheet variable from the .env file with secrets
const spreadsheetId = process.env.GOOGLE_SPREADSHEET;
// this is importing the google api package that authorizes an oauth client allowing access to google sheets
// i am using google sheets as an online database to store the user's sign up credentials
const { google } = require("googleapis");
// this creates a generic function that instantiates an authorized google sheets client allowing you to use the client further down in the app
const getauthenticatedclient = async () => {
  const authclient = new google.auth.GoogleAuth({
    // the googleauth client authorizes by grabbing this key file which is placed on root level directory inside the server folder
    // the key file is a service account key file created in google cloud platform in a project where google sheets api is enabled
    keyFile: "ADC.json",
    // these are the scopes that the key is requesting (in our case we only need access to spreadsheets)
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });
  const auth = await authclient.getClient();
  const client = google.sheets({ version: "v4", auth });
  return client;
};
// instantiating a variable from the generic google authorization function
const authenticate = getauthenticatedclient();
// generic sleep function which is used further in the application just for fun because initially we have a low amount of users and
// the google sheets client doesnt need much time to find a user, then run an insert or update command and respond back to the react application
// and meanwhile I have added on client side a nice spinning animation on the button to wait for the server's reponse while it's running
// its operations. (Also the "r" variable was running before the loop that is looking for the user's row upon signin/signup and giving undefined.
// this was the original idea of why I added a sleep function)
const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
// this is importing the cryptography package used to encryp and decrypt the user's password on the way in and out of the sheets database
const { scrypt, createCipheriv, scryptSync, createDecipheriv } = require("node:crypto");
// the cryptography package works with an IV (initialization vector) so I am importing Buffer to instantiate an 16 digit long vector of 0's
const { Buffer } = require("node:buffer");
// this is the encryption type algorithm that I am using to encrypt password
const algorithm = "aes-192-cbc";
// this is a supplementary key added along the IV and other password keys in order to encrypt the password safely (the decryption needs to use
// the same key when decrypting the password)
const salt_password = "Password used to generate key";
// this is the 16 digit long iv buffer of 0's
const iv = Buffer.alloc(16, 0);
// importing mongodb package which I use to store the user's income and expenses information into mongo database online cluster
const { MongoClient } = require("mongodb");
// this is grabbing my mongodb cluster url from the .env environment file
const url = process.env.MONGO_URL;
// this is instantiating a new mongo variable from the mongoclient class imported from the mongo package with the url poiting to my online cluster
const mongo = new MongoClient(url);

// this is the signup route
app.all("/signup", async (req, res) => {
  // "OPTIONS" method plus headers settings are added to overcome CORS Preflight restrictions
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST");
  res.header("Access-Control-Allow-Headers", req.header("access-control-request-headers"));
  if (req.method === "OPTIONS") {
    res.send();
    // cors preflight settings end here then starts the normal "POST" request which is enabled for this route
  } else if (req.method === "POST") {
    console.log("signup", req.body);
    //
    const firstname = req.body?.firstname;
    const lastname = req.body?.lastname;
    const fullname = `${firstname} ${lastname}`;
    const telephone = req.body?.telephone;
    const email = req.body?.email;
    const password = req.body?.password;
    let passwordHash;

    scrypt(salt_password, "salt", 24, (err, key) => {
      if (err) throw err;
      const cipher = createCipheriv(algorithm, key, iv);
      let encrypted = cipher.update(password, "utf8", "hex");
      passwordHash = encrypted + cipher.final("hex");
    });

    try {
      authenticate.then((client) => {
        client.spreadsheets.values.get({ spreadsheetId, range: "USERS!A:H", majorDimension: "rows" }).then((response) => {
          const arr = response.data.values;
          var r;
          for (let i = arr.length - 1; i >= 0; i--) {
            if (arr[i][4] === email) {
              r = i;
              break;
            }
          }
          sleep(2000).then((v) => {
            // user already exists
            if (r > 0) {
              res.status(200).json("duplicate");
              // create user
            } else {
              client.spreadsheets.values
                .append({
                  spreadsheetId,
                  range: "USERS!A:H",
                  valueInputOption: "RAW",
                  resource: { values: [[firstname, lastname, fullname, telephone, email, password, passwordHash]] },
                })
                .then((response) => {
                  res.status(200).json("User added");
                });
            }
          });
        });
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
});

// this is the signin route
app.all("/signin", async (req, res) => {
  // "OPTIONS" method plus headers settings are added to overcome CORS Preflight restrictions
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST");
  res.header("Access-Control-Allow-Headers", req.header("access-control-request-headers"));
  if (req.method === "OPTIONS") {
    res.send();
    // cors preflight settings end here then starts the normal "POST" request which is enabled for this route
  } else if (req.method === "POST") {
    console.log("signin", req.body);
    const email = req.body?.email;
    const password = req.body?.password;

    try {
      authenticate.then((client) => {
        client.spreadsheets.values
          .get({ spreadsheetId, range: "USERS!A:N", majorDimension: "rows" })
          .then((response) => {
            // console.log(response.data.values);
            const arr = response.data.values;
            var r;
            for (let i = arr.length - 1; i >= 0; i--) {
              if (arr[i][4] === email) {
                r = i;
                break;
              }
            }
            sleep(2000).then((v) => {
              if (r > 0) {
                const key = scryptSync(salt_password, "salt", 24);
                const decipher = createDecipheriv(algorithm, key, iv);
                let decrypted = decipher.update(arr[r][6], "hex", "utf8");
                decrypted += decipher.final("utf8");
                if (decrypted === password) {
                  if (arr[r][9] !== "yes") {
                    res.status(200).json("not launched");
                  } else if (arr[r][9] === "yes" && arr[r][10] !== "yes") {
                    res.status(200).json("launched");
                  } else if (arr[r][9] === "yes" && arr[r][10] === "yes" && arr[r][13] !== "yes") {
                    res.status(200).json("launched with banks checked");
                  } else if (arr[r][9] === "yes" && arr[r][10] === "yes" && arr[r][13] === "yes") {
                    res.status(200).json("launched with banks checked and income set");
                  }
                } else {
                  res.status(200).json("wrong password");
                }
              } else {
                res.status(200).json("user not found");
              }
            });
          })
          .catch((err) => {
            console.log("error while fetching the user", err);
          });
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
});

// this is the preferences route which collects information from the first set of questionnaires (capturing user goals and statstics)
// goals - "why is the user using this app?"
// statistics - "how did the user hear about this app"
// once both pages are submitted the client fires off the information via a post request to this "/preferences" route and the route
// processes the information and sends it to google sheets
app.all("/preferences", async (req, res) => {
  // "OPTIONS" method plus headers settings are added to overcome CORS Preflight restrictions
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST");
  res.header("Access-Control-Allow-Headers", req.header("access-control-request-headers"));
  if (req.method === "OPTIONS") {
    res.send();
    // cors preflight settings end here then starts the normal "POST" request which is enabled for this route
  } else if (req.method === "POST") {
    console.log("preferences", req.body);
    const email = req.body?.user;
    const preferences = req.body?.goals;
    const statistics = req.body?.statistics;
    try {
      authenticate.then((client) => {
        client.spreadsheets.values
          .get({ spreadsheetId, range: "USERS!A:H", majorDimension: "rows" })
          .then((response) => {
            console.log(response);
            const arr = response.data.values;
            var r;
            for (let i = arr.length - 1; i >= 0; i--) {
              if (arr[i][4] === email) {
                r = i + 1;
                break;
              }
            }
            client.spreadsheets.values
              .update({ spreadsheetId, range: `USERS!H${r}:J${r}`, valueInputOption: "RAW", resource: { values: [[JSON.stringify(preferences), statistics, "yes"]] } })
              .then((res) => {
                console.log("updated user's preferences, statistics and launched status");
              })
              .catch((err) => {
                console.log("error while updating the user preferences", err);
              });
          })
          .catch((err) => {
            console.log("error while fetching the user", err);
          });
      });
      res.status(200).json("saved");
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
});

// this is the banksChecked route. This is used for the next set of questionnaire screens
// banks page - collects information of which bank the user prefers to use
// investments page - collects information about which investment does the user want to choose
app.all("/banksChecked", async (req, res) => {
  // "OPTIONS" method plus headers settings are added to overcome CORS Preflight restrictions
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST");
  res.header("Access-Control-Allow-Headers", req.header("access-control-request-headers"));
  if (req.method === "OPTIONS") {
    res.send();
    // cors preflight settings end here then starts the normal "POST" request which is enabled for this route
  } else if (req.method === "POST") {
    console.log("adding banksChecked to the user in the database", req.body);
    const email = req.body?.user;
    const bank = req.body?.bank;
    const investment = req.body?.investment;

    try {
      authenticate.then((client) => {
        client.spreadsheets.values
          .get({ spreadsheetId, range: "USERS!A:H", majorDimension: "rows" })
          .then((response) => {
            console.log(response);
            const arr = response.data.values;
            var r;
            for (let i = arr.length - 1; i >= 0; i--) {
              if (arr[i][4] === email) {
                r = i + 1;
                break;
              }
            }
            client.spreadsheets.values
              .update({ spreadsheetId, range: `USERS!K${r}:M${r}`, valueInputOption: "RAW", resource: { values: [["yes", bank, investment]] } })
              .then((res) => {
                console.log("updated user's banks, investments and banksChecked flag");
              })
              .catch((err) => {
                console.log("error while updating the user's banksChecked", err);
              });
          })
          .catch((err) => {
            console.log("error while fetching the user", err);
          });
      });
      res.status(200).json("saved");
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
});

// this is the setIncome route. This is used for the 3rd set of questionnaires in the app.
// this questionnaire finnally gets the income and expenses information from the users input.
// the client sends a post request to this route with the income and expense data and the server processes it.
// it connects to mongodb and stores the data in mongo online cluster
// it also connects to google sheets and stores a "yes" to the "income" column into the user's row.
// upon signin the signin route checks for this "yes" from the "income" column and sends the appropriate response back to the client
// which then handles the navigation and navigates the user accordingly to whether he has fulfilled the entire questionnaire if he has all the
// "yes" flags set up he won't be prompted again on any of the questionnaire screens (because the /preferences route saves a "goals" flag column
// and a "statistics" flag column to "yes" and the banksChecked route saves a "banks" flag column and an "investments" flag column to "yes"
// and the /setIncome route saves an "income" flag column to "yes" finally and when the user has all flags the application never shows him
// any questionnaire screens ever again)
app.all("/setIncome", async (req, res) => {
  // "OPTIONS" method plus headers settings are added to overcome CORS Preflight restrictions
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST");
  res.header("Access-Control-Allow-Headers", req.header("access-control-request-headers"));
  if (req.method === "OPTIONS") {
    res.send();
    // cors preflight settings end here then starts the normal "POST" request which is enabled for this route
  } else if (req.method === "POST") {
    console.log("details", req.body);
    const doc = {
      email: req.body?.email,
      income: parseInt(req.body?.income),
      "mortgage/rent": parseInt(req.body?.mortgage),
      groceries: parseInt(req.body?.groceries),
      insurance: parseInt(req.body?.insurance),
      "council tax": parseInt(req.body?.councilTax),
      electricity: parseInt(req.body?.electricity),
      gas: parseInt(req.body?.gas),
      water: parseInt(req.body?.water),
      other: parseInt(req.body?.other),
    };

    try {
      // connecting to mongodb
      // use mongo to insert income info
      await mongo.connect();
      const db = mongo.db("test");
      const collection = db.collection("charts");
      await collection.insertOne(doc);
      // use google sheets to update user's "income" flag to "yes" so we don't display the income form again
      authenticate.then((client) => {
        client.spreadsheets.values
          .get({ spreadsheetId, range: "USERS!A:H", majorDimension: "rows" })
          .then((response) => {
            console.log(response);
            const arr = response.data.values;
            var r;
            for (let i = arr.length - 1; i >= 0; i--) {
              if (arr[i][4] === doc.email) {
                r = i + 1;
                break;
              }
            }
            client.spreadsheets.values
              .update({ spreadsheetId, range: `USERS!N${r}:O${r}`, valueInputOption: "RAW", resource: { values: [["yes"]] } })
              .then((res) => {
                console.log("updated sheets with the user's income flag");
              })
              .catch((err) => {
                console.log("error while updating the user's income flag", err);
              });
          })
          .catch((err) => {
            console.log("error while fetching the user", err);
          });
      });
      res.status(200).json("Income added");
    } catch (e) {
      return res.status(500).json({ error: e.message });
    } finally {
      await mongo.close();
    }
  }
});

// this route is used when the client finally (after the questionnaires) loads a file called "HomePage.jsx", in its useEffect hook function
// which runs every time the page loads - it fires a request with the user's email to this route and this route checks mongodb documents
// where the email matches (it could be only one because our other signup and questionnaire flag methods don't allow user duplicates)
// and returns the stored income and expense data for the current user . the client captures the response with the income data and finally
// displays it onto a chart in the "HomePage.jsx" file. (I have tried using mongo charts. I am not using them anymore but for the mongo charts
// is still available in the "HomePage.jsx" file commented out. In use is now a chart created from react-chartjs-2 package in the same file)
app.all("/getIncome", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST");
  res.header("Access-Control-Allow-Headers", req.header("access-control-request-headers"));
  if (req.method === "OPTIONS") {
    res.send();
  } else if (req.method === "POST") {
    const email = req.body?.email;
    try {
      // await connect to mongo
      await mongo.connect();
      // set to "test" database in the online cluster
      const db = mongo.db("test");
      // set to "charts" collection in the "test" database
      const collection = db.collection("charts");
      // retrieve one document with the users email
      const doc = await collection.findOne({ email });
      // adds a status of "success" to the retrieved object
      const data = { status: "success", ...doc };
      // sends the new object back to the client
      res.status(200).json(data);
    } catch (e) {
      // if error , returns the error message to the client
      return res.status(500).json({ error: e.message });
    } finally {
      // finally (the "finally" block runs regardless of whether there is an error or success) closes the mongo connection
      await mongo.close();
    }
  }
});

app.all("/todos", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST");
  res.header("Access-Control-Allow-Headers", req.header("access-control-request-headers"));
  if (req.method === "OPTIONS") {
    res.send();
  } else if (req.method === "POST") {
    const doc = {
      email: req.body?.email,
      id: req.body?.todo?.id,
      inputValue: req.body?.todo?.inputValue,
    };
    console.log(doc);
    // post this to mongo db here
    // -------------------------->
  }
});

// the express variable "app" which initializes our server app sets a port to the environment variable file PORT or if there isn't any
// specified to port 3001 because usually our react client now runs on port :5173 because it is a vite app, but if it wasn't a vite app
// react would most probably run on port 3000 so our server needs to be on a different port
app.set("port", process.env.PORT || 3001);
// and app.listen instatiates the server to "running"
app.listen(app.get("port"), () => {
  console.log(`Server started on port ${app.get("port")}`);
});
