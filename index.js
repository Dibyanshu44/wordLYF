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
// fs.readFile(infoFile, "utf-8", (err, data) => {
//   if (!err) {
//     const lines = data.split("\n");
//     for (let i = 0; i < lines.length; i++) {
//       const line = lines[i].trim();
//       if (line !== "") {
//         const parts = line.split(" ");
//         if (parts.length === 2) {
//           userlist.push(parts[0]);
//           pwdlist.push(parts[1]);
//         }
//       }
//     }
//   }
// });

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

// app.post("/signup", (req, res) => {
//   const username = req.body.username;
//   const password = req.body.password;

//   let exists = false;
//   for (let i = 0; i < userlist.length; i++) {
//     if (userlist[i] === username) {
//       exists = true;
//       break;
//     }
//   }

//   if (exists) {
//     res.sendFile(path.join(__dirname, "public", "userExists.html"));
//   } else {
//     const entry = username + " " + password + "\n";
//     fs.appendFile(infoFile, entry, (err) => {
//       if (err) {
//         res.status(500).send("Signup error");
//       } else {
//         userlist.push(username);
//         pwdlist.push(password);
//         res.sendFile(path.join(__dirname, "public", "login.html"));
//       }
//     });
//   }
// });

// app.post("/login", (req, res) => {
//   const username = req.body.username;
//   const password = req.body.password;

//   let foundIndex = -1;
//   for (let i = 0; i < userlist.length; i++) {
//     if (userlist[i] === username) {
//       foundIndex = i;
//       break;
//     }
//   }

//   if (foundIndex !== -1) {
//     if (pwdlist[foundIndex] === password) {
//       req.session.username = username;

//       titlelist = [];
//       textlist = [];

//       const userFile = path.join(__dirname, username + ".txt");
//       fs.readFile(userFile, "utf-8", (err, data) => {
//         if (err) {
//           fs.writeFile(userFile, "", (err2) => {
//             if (err2) console.error("Error creating user file.");
//             res.redirect("/home");
//           });
//         } else {
//           const posts = data.trim().split("\n");
//           for (let i = 0; i < posts.length; i++) {
//             const parts = posts[i].split("|");
//             if (parts.length === 3) {
//               titlelist.push(parts[1].trim());
//               textlist.push(parts[2].trim());
//             }
//           }
//           res.redirect("/home");
//         }
//       });
//     } else {
//       res.sendFile(path.join(__dirname, "public", "pwdnotfound.html"));
//     }
//   } else {
//     res.sendFile(path.join(__dirname, "public", "usernotfound.html"));
//   }
// });

// app.get("/home", (req, res) => {
//   if (!req.session.username) {
//     res.redirect("/");
//   } else {
//     const data = {
//       head: titlelist,
//       body: textlist,
//       name:req.session.username,
//     };
//     res.render("index.ejs", { data: data });
//   }
// });

// app.post("/submit", (req, res) => {
//   if (!req.session.username) {
//     res.redirect("/");
//   } else {
//     const title = req.body.title.trim();
//     const text = req.body.text.trim();
//     const id = titlelist.length + 1;

//     titlelist.push(title);
//     textlist.push(text);

//     const entry = id + "|" + title + "|" + text + "\n";
//     const userFile = path.join(__dirname, req.session.username + ".txt");

//     fs.appendFile(userFile, entry, (err) => {
//       if (err) {
//         res.status(500).send("Error saving post");
//       } else {
//         res.redirect("/home");
//       }
//     });
//   }
// });

// app.get("/dlt/:id", (req, res) => {
//   if (!req.session.username) {
//     res.redirect("/");
//   } else {
//     const idToDelete = parseInt(req.params.id);

//     if (isNaN(idToDelete)) {
//       res.status(400).send("Invalid ID");
//       return;
//     }

//     const index = idToDelete - 1;
//     if (index >= 0 && index < titlelist.length) {
//       titlelist.splice(index, 1);
//       textlist.splice(index, 1);

//       const userFile = path.join(__dirname, req.session.username + ".txt");
//       let newData = "";
//       for (let i = 0; i < titlelist.length; i++) {
//         newData += (i + 1) + "|" + titlelist[i] + "|" + textlist[i] + "\n";
//       }

//       fs.writeFile(userFile, newData, (err) => {
//         if (err) {
//           res.status(500).send("Error updating file");
//         } else {
//           res.redirect("/home");
//         }
//       });
//     } else {
//       res.status(400).send("Invalid ID");
//     }
//   }
// });

// app.get("/edit/:id", (req, res) => {
//   if (!req.session.username) {
//     res.redirect("/");
//   } else {
//     const index = parseInt(req.params.id) - 1;
//     if (index >= 0 && index < titlelist.length) {
//       const data = {
//         head: titlelist[index],
//         body: textlist[index],
//         count: req.params.id,
//       };
//       res.render("edit.ejs", { data: data });
//     } else {
//       res.status(404).send("Post not found");
//     }
//   }
// });

// app.post("/edit/done/:id", (req, res) => {
//   if (!req.session.username) {
//     res.redirect("/");
//   } else {
//     const index = parseInt(req.params.id) - 1;
//     if (index >= 0 && index < titlelist.length) {
//       titlelist[index] = req.body.title.trim();
//       textlist[index] = req.body.text.trim();

//       const userFile = path.join(__dirname, req.session.username + ".txt");
//       let newData = "";
//       for (let i = 0; i < titlelist.length; i++) {
//         newData += (i + 1) + "|" + titlelist[i] + "|" + textlist[i] + "\n";
//       }

//       fs.writeFile(userFile, newData, (err) => {
//         if (err) {
//           res.status(500).send("Error saving edits");
//         } else {
//           res.redirect("/home");
//         }
//       });
//     } else {
//       res.status(404).send("Post not found");
//     }
//   }
// });

// app.use((req, res) => {
//   res.status(404).send("Page not found");
// });

// app.listen(port, () => {
//   console.log("Server running at http://localhost:" + port);
// });
import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import session from "express-session";
import { dirname } from "path";
import { fileURLToPath } from "url";
import http from "http";
import { Server } from "socket.io";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const server = http.createServer(app);
const io = new Server(server);
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
      name: req.session.username,
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
        io.emit("new-post", { id, title, text }); // broadcast new post
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
          io.emit("delete-post", idToDelete); // broadcast deletion
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
      const updatedTitle = req.body.title.trim();
      const updatedText = req.body.text.trim();

      titlelist[index] = updatedTitle;
      textlist[index] = updatedText;

      const userFile = path.join(__dirname, req.session.username + ".txt");
      let newData = "";
      for (let i = 0; i < titlelist.length; i++) {
        newData += (i + 1) + "|" + titlelist[i] + "|" + textlist[i] + "\n";
      }

      fs.writeFile(userFile, newData, (err) => {
        if (err) {
          res.status(500).send("Error saving edits");
        } else {
          io.emit("edit-post", {
            id: req.params.id,
            title: updatedTitle,
            text: updatedText,
          }); // broadcast edit
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

server.listen(port, () => {
  console.log("Server running at http://localhost:" + port);
});
