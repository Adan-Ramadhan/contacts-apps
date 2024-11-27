const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const {
  loadContacts,
  findContact,
  addContact,
  cekDuplikat,
  deleteContact,
  updateContacts
} = require("./utils/contacts");
const app = express();
const port = 3000;
const {
  body,
  validationResult,
  check
} = require('express-validator');
const session = require('express-session');
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");


app.set("view engine", "ejs");
app.use(expressLayouts); // third party middleware
app.use(express.static("public")); // build-in middleware
app.use(express.urlencoded({
  extended: true
}));

// konfigurasi flash
app.use(cookieParser("secret"));
app.use(
  session({
    cookie: {
      maxAge: 6000
    },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  }),
);
app.use(flash());

app.get('/', (req, res) => {
  const contacts = loadContacts();


  res.render("index", {
    layout: "layout/main-layouts",
    nama: "Adan Ramadhan",
    title: "Halaman Home",
    contacts,
  })
});

app.get("/contact", (req, res) => {
  const contacts = loadContacts();

  res.render("contact", {
    layout: "layout/main-layouts",
    title: "Halaman Contact",
    contacts,
    msg: req.flash("msg"),
  })
});


app.get("/contact/add", (req, res) => {
  res.render("add-contact", {
    layout: "layout/main-layouts",
    title: "Form Tambah Data Contact",
  });
});

// process data contact
app.post("/contact", [
  body("nama").custom((value) => {
    const duplikat = cekDuplikat(value);
    if (duplikat) {
      throw new Error("Nama contact sudah terdaftar");
    };

    return true;
  }),
  check("email", "Email tidak valid").isEmail(),
  check("noHp", "No Hp tidak valid").isMobilePhone("id-ID"),
], (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
      
    res.render("add-contact", {
      layout: "layout/main-layouts",
      title: "Form Tambah Data Contact",
      errors: result.array()
    });
  }
   else {
    addContact(req.body);                                                                                                                                                        
    // kirimkan flash message
    req.flash("msg", "Data contact berhasil ditambahkan");
    res.redirect("/contact");
  }
});


// proses delete contact
app.get("/contact/delete/:nama", (req, res) => {
  const contact = findContact(req.params.nama);

  // jika contac tidaak ada
  if(!contact){
    res.status(404);
    res.send("<h1>404</h1>");
  }else{
    deleteContact(req.params.nama);
    req.flash("msg", "Data contact berhasil dihapus");
    res.redirect("/contact");
  }
} );

// halaman form ubah data contact
app.get("/contact/edit/:nama", (req, res) => {
  const contact = findContact(req.params.nama);
  
  res.render("edit-contact", {
    layout: "layout/main-layouts",
    title: "Form Ubah Data Contact",
    contact,
  });
});


// proses ubah data
app.post("/contact/update", [
  body("nama").custom((value, {req}) => {
    const duplikat = cekDuplikat(value);
    if (value !== req.body.oldNama && duplikat) {
      throw new Error("Nama contact sudah terdaftar");
    };
    return true;
  }),
  check("email", "Email tidak valid").isEmail(),
  check("noHp", "No Hp tidak valid").isMobilePhone("id-ID"),
], (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    // return res.status(400).json({
    //   errors: result.array()
    // });
    res.render("edit-contact", {
      layout: "layout/main-layouts",
      title: "Form Ubah Data Contact",
      errors: result.array(),
      contact: req.body
    });
  } else {
    updateContacts(req.body);
    // kirimkan flash message
    req.flash("msg", "Data contact berhasil diubah");
    res.redirect("/contact");
  }
});

app.get("/contact/:nama", (req, res) => {
  const contact = findContact(req.params.nama);


  res.render("detail", {
    layout: "layout/main-layouts",
    title: "Halaman Detail Contact",
    contact,
  });
});


app.get('/about', (req, res) => {
  res.render("about", {
    layout: "layout/main-layouts",
    title: "Halaman About",
  });
});

app.use((req, res) => {
  res.status(404)
  res.send("<h1>404</h1>")
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});