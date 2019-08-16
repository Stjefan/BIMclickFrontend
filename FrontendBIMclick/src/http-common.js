// Bisher unverändert aus dem alten Vue-Projekt vue.js-client übernommen
// Unklar, ob noch relevant für Quasar, z.B. wird baseURL in quasar.conf.js definiert
// axios wird dort ebenfalls konfiguriert!
import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-type": "application/json",
  }
});