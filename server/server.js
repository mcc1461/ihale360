const express = require("express");
const app = express();

// JSON istekleri için middleware
app.use(express.json());

const PORT = process.env.PORT || 8360;

app.get("/", (req, res) => {
  res.send("Merhaba MusCo Backend sunucusu çalışıyor!");
});

app.listen(PORT, () => {
  console.log(`Backend sunucusu ${PORT} portunda çalışıyor.`);
});
