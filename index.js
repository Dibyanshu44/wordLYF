// import express from "express";
// import bodyParser from "body-parser";
// import fs from "fs";
// import path from "path";
// import session from "express-session";
// import { dirname } from "path";
// import { fileURLToPath } from "url";

// const __dirname = dirname(fileURLToPath(import.meta.url));
// const app = express();
// const port = process.env.PORT || 3000;

// let userlist = [];
// let pwdlist = [];
// let titlelist = [];
// let textlist = [];

// app.use(express.static(path.join(__dirname, "public")));
// app.use(bodyParser.urlencoded({ extended: true }));

// app.use(
//   session({
//     secret: "your-strong-secret-key",
//     resave: false,
//     saveUninitialized: false,
//   })
// );

// app.set("view engine", "ejs");

// // Load users on server start
// const infoFile = path.join(__dirname, "info.txt");
// if (fs.existsSync(infoFile)) {
//   const data = fs.readFileSync(infoFile, "utf-8");
//   data.split("\n").forEach(line => {
//     const [user, pass] = line.trim().split(" ");
//     if (user && pass) {
//       userlist.push(user);
//       pwdlist.push(pass);
//     }
//   });
// }

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

// app.post("/signup", (req, res) => {
//   const { username, password } = req.body;
//   if (userlist.includes(username)) {
//     return res.sendFile(path.join(__dirname, "public", "userExists.html"));
//   }
//   fs.appendFile(infoFile, `${username} ${password}\n`, err => {
//     if (err) return res.status(500).send("Signup error");
//     userlist.push(username);
//     pwdlist.push(password);
//     res.sendFile(path.join(__dirname, "public", "login.html"));
//   });
// });

// app.post("/login", (req, res) => {
//   const { username, password } = req.body;
//   const index = userlist.indexOf(username);
//   if (index !== -1 && pwdlist[index] === password) {
//     req.session.username = username;

   
//     titlelist.length = 0;
//     textlist.length = 0;

//     const userFile = path.join(__dirname, `${username}.txt`);
//     if (!fs.existsSync(userFile)) {
//       fs.writeFileSync(userFile, "");
//     } else {

//       const data = fs.readFileSync(userFile, "utf-8");
//       data.trim().split("\n").forEach(post => {
//         const parts = post.split("|");
//         if (parts.length === 3) {
//           titlelist.push(parts[1].trim());
//           textlist.push(parts[2].trim());
//         }
//       });
//     }

//     return res.redirect("/home");
//   }
//   res.sendFile(
//     path.join(
//       __dirname,
//       "public",
//       index === -1 ? "usernotfound.html" : "pwdnotfound.html"
//     )
//   );
// });

// app.get("/home", (req, res) => {
//   if (!req.session.username) return res.redirect("/");
//   res.render("index.ejs", { data: { head: titlelist, body: textlist } });
// });

// app.post("/submit", (req, res) => {
//   if (!req.session.username) return res.redirect("/");

//   const title = req.body.title.trim();
//   const text = req.body.text.trim();
//   const id = titlelist.length + 1;

//   titlelist.push(title);
//   textlist.push(text);

//   const userFile = path.join(__dirname, `${req.session.username}.txt`);
//   fs.appendFile(userFile, `${id}|${title}|${text}\n`, err => {
//     if (err) return res.status(500).send("Error saving post");
//     res.redirect("/home");
//   });
// });

// app.get("/dlt/:id", (req, res) => {
//   if (!req.session.username) return res.redirect("/");

//   const idToDelete = parseInt(req.params.id);
//   if (isNaN(idToDelete) || idToDelete < 1 || idToDelete > titlelist.length) {
//     return res.status(400).send("Invalid ID");
//   }

//   titlelist.splice(idToDelete - 1, 1);
//   textlist.splice(idToDelete - 1, 1);

//   const updatedData = titlelist
//     .map((t, i) => `${i + 1}|${t}|${textlist[i]}`)
//     .join("\n");

//   const userFile = path.join(__dirname, `${req.session.username}.txt`);
//   fs.writeFile(userFile, updatedData + "\n", err => {
//     if (err) return res.status(500).send("Error updating file");
//     res.redirect("/home");
//   });
// });

// app.get("/edit/:id", (req, res) => {
//   if (!req.session.username) return res.redirect("/");

//   const index = parseInt(req.params.id) - 1;
//   if (index < 0 || index >= titlelist.length) return res.status(404).send("Post not found");

//   const data = {
//     head: titlelist[index],
//     body: textlist[index],
//     count: req.params.id,
//   };
//   res.render("edit.ejs", { data });
// });

// app.post("/edit/done/:id", (req, res) => {
//   if (!req.session.username) return res.redirect("/");

//   const index = parseInt(req.params.id) - 1;
//   if (index < 0 || index >= titlelist.length) return res.status(404).send("Post not found");

//   titlelist[index] = req.body.title.trim();
//   textlist[index] = req.body.text.trim();

//   const updatedData = titlelist
//     .map((t, i) => `${i + 1}|${t}|${textlist[i]}`)
//     .join("\n");

//   const userFile = path.join(__dirname, `${req.session.username}.txt`);
//   fs.writeFile(userFile, updatedData + "\n", err => {
//     if (err) return res.status(500).send("Error saving edits");
//     res.redirect("/home");
//   });
// });

// app.use((req, res) => {
//   res.status(404).send("Page not found");
// });

// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });
import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import session from "express-session";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3000;

let userlist = [];
let pwdlist = [];
let titlelist = [];
let textlist = [];

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "your-strong-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

app.set("view engine", "ejs");

// Load users on server start
const infoFile = path.join(__dirname, "info.txt");
fs.readFile(infoFile, "utf-8", (err, data) => {
  if (!err) {
    const lines = data.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line !== "") {
        const parts = line.split(" ");
        if (parts.length === 2) {
          userlist.push(parts[0]);
          pwdlist.push(parts[1]);
        }
      }
    }
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/signup", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  let exists = false;
  for (let i = 0; i < userlist.length; i++) {
    if (userlist[i] === username) {
      exists = true;
      break;
    }
  }

  if (exists) {
    res.sendFile(path.join(__dirname, "public", "userExists.html"));
  } else {
    const entry = username + " " + password + "\n";
    fs.appendFile(infoFile, entry, (err) => {
      if (err) {
        res.status(500).send("Signup error");
      } else {
        userlist.push(username);
        pwdlist.push(password);
        res.sendFile(path.join(__dirname, "public", "login.html"));
      }
    });
  }
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  let foundIndex = -1;
  for (let i = 0; i < userlist.length; i++) {
    if (userlist[i] === username) {
      foundIndex = i;
      break;
    }
  }

  if (foundIndex !== -1) {
    if (pwdlist[foundIndex] === password) {
      req.session.username = username;

      titlelist = [];
      textlist = [];

      const userFile = path.join(__dirname, username + ".txt");
      fs.readFile(userFile, "utf-8", (err, data) => {
        if (err) {
          fs.writeFile(userFile, "", (err2) => {
            if (err2) console.error("Error creating user file.");
            res.redirect("/home");
          });
        } else {
          const posts = data.trim().split("\n");
          for (let i = 0; i < posts.length; i++) {
            const parts = posts[i].split("|");
            if (parts.length === 3) {
              titlelist.push(parts[1].trim());
              textlist.push(parts[2].trim());
            }
          }
          res.redirect("/home");
        }
      });
    } else {
      res.sendFile(path.join(__dirname, "public", "pwdnotfound.html"));
    }
  } else {
    res.sendFile(path.join(__dirname, "public", "usernotfound.html"));
  }
});

app.get("/home", (req, res) => {
  if (!req.session.username) {
    res.redirect("/");
  } else {
    const data = {
      head: titlelist,
      body: textlist,
      name:req.session.username,
    };
    res.render("index.ejs", { data: data });
  }
});

app.post("/submit", (req, res) => {
  if (!req.session.username) {
    res.redirect("/");
  } else {
    const title = req.body.title.trim();
    const text = req.body.text.trim();
    const id = titlelist.length + 1;

    titlelist.push(title);
    textlist.push(text);

    const entry = id + "|" + title + "|" + text + "\n";
    const userFile = path.join(__dirname, req.session.username + ".txt");

    fs.appendFile(userFile, entry, (err) => {
      if (err) {
        res.status(500).send("Error saving post");
      } else {
        res.redirect("/home");
      }
    });
  }
});

app.get("/dlt/:id", (req, res) => {
  if (!req.session.username) {
    res.redirect("/");
  } else {
    const idToDelete = parseInt(req.params.id);

    if (isNaN(idToDelete)) {
      res.status(400).send("Invalid ID");
      return;
    }

    const index = idToDelete - 1;
    if (index >= 0 && index < titlelist.length) {
      titlelist.splice(index, 1);
      textlist.splice(index, 1);

      const userFile = path.join(__dirname, req.session.username + ".txt");
      let newData = "";
      for (let i = 0; i < titlelist.length; i++) {
        newData += (i + 1) + "|" + titlelist[i] + "|" + textlist[i] + "\n";
      }

      fs.writeFile(userFile, newData, (err) => {
        if (err) {
          res.status(500).send("Error updating file");
        } else {
          res.redirect("/home");
        }
      });
    } else {
      res.status(400).send("Invalid ID");
    }
  }
});

app.get("/edit/:id", (req, res) => {
  if (!req.session.username) {
    res.redirect("/");
  } else {
    const index = parseInt(req.params.id) - 1;
    if (index >= 0 && index < titlelist.length) {
      const data = {
        head: titlelist[index],
        body: textlist[index],
        count: req.params.id,
      };
      res.render("edit.ejs", { data: data });
    } else {
      res.status(404).send("Post not found");
    }
  }
});

app.post("/edit/done/:id", (req, res) => {
  if (!req.session.username) {
    res.redirect("/");
  } else {
    const index = parseInt(req.params.id) - 1;
    if (index >= 0 && index < titlelist.length) {
      titlelist[index] = req.body.title.trim();
      textlist[index] = req.body.text.trim();

      const userFile = path.join(__dirname, req.session.username + ".txt");
      let newData = "";
      for (let i = 0; i < titlelist.length; i++) {
        newData += (i + 1) + "|" + titlelist[i] + "|" + textlist[i] + "\n";
      }

      fs.writeFile(userFile, newData, (err) => {
        if (err) {
          res.status(500).send("Error saving edits");
        } else {
          res.redirect("/home");
        }
      });
    } else {
      res.status(404).send("Post not found");
    }
  }
});

app.use((req, res) => {
  res.status(404).send("Page not found");
});

app.listen(port, () => {
  console.log("Server running at http://localhost:" + port);
});
