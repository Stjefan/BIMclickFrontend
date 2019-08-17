<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <!-- <q-avatar">
            <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg">
      </q-avatar>-->
      <q-img src="statics/KuFiLogoTransparent.png" style="height: 145px; max-width: 800px"></q-img>
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="left = !left" />
        <q-toolbar-title>BIM.click V0.5</q-toolbar-title>
        <q-btn dense flat round icon="menu" @click="right = !right" />
      </q-toolbar>

      <!-- Einbauen der Links -->
      <q-tabs align="left">
        <q-route-tab :to="{name: 'Baustoffe'}" label="Baustoffe" />
        <q-route-tab :to="{name: 'Bauprodukte'}" label="Bauprodukte" />
        <q-route-tab :to="{name: 'Bauvorschriften'}" label="Bauvorschriften" />
        <q-route-tab :to="{name: 'Bauvorhaben'}" label="Bauvorhaben" />
        <q-route-tab :to="{name: 'Validierung'}" label="Validierung" />
        <q-route-tab :to="{name: 'Optimierung'}" label="Optimierung" />
        <q-route-tab :to="{name: 'Datenaustausch'}" label="Datenaustausch" />
      </q-tabs>
    </q-header>

    <q-drawer v-model="left" side="left" bordered>
      <br />
      <strong>Linker Auszug (Drawer)</strong>
      <br />
      <h6>Expertenchat</h6>
      <!-- drawer content -->
      <q-chat-message
        name="Stefan"
        avatar="statics/boyavatar1.png"
        :text="['Wie heßt nochmal die Estrichnorm?']"
        stamp="vor 5 Minuten"
        sent
      />
      <q-chat-message
        name="Katrin"
        avatar="statics/girlavatar1.png"
        :text="['DIN 18560-2']"
        stamp="vor 3 Minuten"
        sent
      />
      <q-chat-message
        name="Erik"
        avatar="statics/boyavatar2.png"
        :text="['Cool!']"
        stamp="vor 2 Minuten"
        sent
      />
      <br />
      <br />Hier kann weitere Information eingeblendet werden
    </q-drawer>

    <q-drawer v-model="right" side="right" bordered>
      <br />
      <strong>Rechter Auszug für Zusatzinformation</strong>
      <h6>DIN 18560-2 Estriche und Heizestriche auf Dämmschichten</h6>
      <q-img src="statics/Estrich.jpg" style="max-width: 280px"></q-img>
      <br />
      <br />
      <br />3.1 Allgemeine Anforderungen - Estrich, schwimmend
      <br />3.2.1 Dicke und Festigkeits- bzw. Härteklassen - Estrich, unbeheizt
      <br />3.2.2 Dicke und Festigkeits- bzw. Härteklassen - Heizestrich
      <br />3.3 Dämmschichten - Estrich, schwimmend
      <br />4 Bauliche Anforderungen - Estrich, schwimmend
      <br />5.1 Ausführung der Dämmschicht - Estrich, schwimmend
      <br />5.2 Randstreifen - Estrich, schwimmend
      <br />5.3 Ausführung - Estrich, schwimmend
      <br />6.2 Eignungsprüfung - Estrich, schwimmend
      <br />6.3 Bestätigungsprüfung - Estrich, schwimmend
    </q-drawer>

    <q-page-container>
     <!--  <div id="q-app" class="q-pa-md q-mt-xs q-gutter-md">
        <q-btn
          color="white"
          text-color="black"
          push
          @click="$router.replace('/')"
          label="Anzeigen"
        />
        <q-btn color="primary" push @click="$router.replace('/add')" label="Hinzufügen" />
        <q-btn color="secondary" push @click="$router.replace('/search')" label="Suchen" />
      </div> -->
      <router-view>
        <!-- Vue-Befehl - hier injected der Router vorläufig die Pages -->
      </router-view>
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <!-- <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg"> -->
          </q-avatar>© 2019 Michael Scheible
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'

export default {
  name: 'MyLayout',
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
      left: false,
      right: false,
    }
  },
  methods: {
    openURL
  }
}
</script>

<style>
</style>
