# FrontendBIMClick

Bei diesem Projekt handelt es sich um eine neuaufgesetzte Version der ursrünglichen "quasarapp".
Umwandlung erfolgte folgendermaßen:

Neuanlegen eines Repositories in GitHub
Wechsel in das neue Repository
Neuerstellung eines Quasarprojekts mittels: quasar create FrontendBIMClick
Während der Neuerstellung: Installation von axios, eslint  ausgewählt
Wechsel in den Ordner

Durchgeführte Änderungen im neu erstellen Projekt:

In quasar.config.js:
Übernahme der components aus quasar.config.js von quasarapp
router-mode auf history geändert
Port auf 4200 (im ursprünglichen Projekt so eingestellt)

Erstellung neuer page mit: qusar new page Baustoffe
Kopie von BaustoffListe.vue aus quasarapp in src/pages/Baustoffe.vue (leichte Anpassung, siehe Code)

Kopie des Inhalts von template von App.vue aus quasarapp in src/layouts/MyLayout.vue ins template (leichte Anpassung, siehe Code)

Anlegen neuer Routes in router/routes.js (siehe Code)
Anpassen der Verlinkungen in src/layouts/MyLayout.vue









