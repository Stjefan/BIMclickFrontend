<template>
  <q-page padding>
    <!-- content -->
    <div>
    <q-btn label="Neue Eigenschaft anlegen"></q-btn>
    </div>
    <br/>
    <div>
      <q-card class="my-card">
        <div>
        <q-input class="abc" label="Name der Eigenschaft">
        </q-input>
        </div>
        <div>
          <p>
        <q-input class="abc" label="Zugrundeliegende Norm">
        </q-input>
        <q-btn label="Neue Norm hinzufügen">
          </q-btn>
          </p>
        </div>
        <div>
          Werte werden angegeben in:
          <q-radio v-model="selectedRadio" val="Kategorien" label="Wertekategorien" />
          <q-radio v-model="selectedRadio" val="Absolut" label="Absolute Werte"/>
        <div v-if="showKategorieBox">
          <q-input label="Kategoriename">
          </q-input>
          <q-table
            title="Kategorien"
            :data="data"
            :columns="columns"
            row-key="name"
          />
          <div>
          <q-btn label="Kategorie hinzufügen">
          </q-btn>
          <q-btn label="Kategorie löschen">
          </q-btn>
          </div>
        </div>
        <div v-if="showAbsoluteValueBox">
          <q-input label="Einheit">
          </q-input>
        </div>
        </div>
      </q-card>
      </div>
      <br/>
      <q-card class="my-card">
        <div>
          <q-table
            title="Vorhandene bauphysikalische Eigenschaften"
            :data="BPhyEigenschaften"
            :columns="Tabelle_BPhyEigenschaften_Spalten"
            row-key="name"
            :filter="FilterTabelleBPhyEigenschaften"
          />
          <q-input borderless dense debounce="300" v-model="FilterTabelleBPhyEigenschaften" placeholder="Suche">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        </div>
    </q-card>
  </q-page>
</template>

<script>
export default {
  // name: 'PageName',
  data() {
    return {
      val: false,
      selectedRadio: null,

      FilterTabelleBPhyEigenschaften: '',
      BPhyEigenschaften: [
        {
          Bezeichnung: "Wärmedurchganswiderstand"
        },
        {
          Bezeichnung: "Schalldämmmaß"
        },
        {
          Bezeichnung: "Rohdichte"
        },
        {
          Bezeichnung: "Wärmeleitfähgigkeit"
        },
        {
          Bezeichnung: "Bemessungswert nach DIN 4108"
        },
        {
          Bezeichnung: "Brandverhalten Euroklasse",
          Norm: "13501-1"
        },
        {
          Bezeichnung: "Dynamische Steifigkeit"
        },
        {
          Bezeichnung: "Zulässige Flächenlast",
          Norm: "1991-1-1/NA"
        },
        {
          Bezeichnung: "Zusammendrückbarkeit"
        },
        {
          Bezeichnung: "Anwendungsbereich"
        }
      ],
      Tabelle_BPhyEigenschaften_Spalten: [
          {
            name: 1,
            field: 'Bezeichnung',
            label: 'Bezeichnung'
          },
          {
            name: 2,
            field: 'Norm',
            label: 'Norm'
          }
        ],
      columns: [
        {
        name: 1,
        field: 'BezeichnungKategorie',
        align: 'left',
        label: 'Bezeichnung der Kategorie'
        },
        {
          name: 2,
          field: 'KurzbeschreibungKategorie',
          align: 'right',
          label: 'Kurzbeschreibung der Kategorie'
        }
      ],
      data: [
        {
          BezeichnungKategorie: 'A',
          KurzbeschreibungKategorie: 'Sehr wenig Energieverbrauch (<= 5l/100km)'
        },
        {
          BezeichnungKategorie: 'B',
          KurzbeschreibungKategorie: 'Mittlerer Energieverbrauch (> 5l/100km & < 10l/100km)'
        },
        {
          BezeichnungKategorie: 'C',
          KurzbeschreibungKategorie: 'Hoher Energieverbrauch (> 10l/100km)'
        }
      ]
    }
  },
  computed: {
    showKategorieBox: function() {
      return this.selectedRadio === "Kategorien"
    },
    showAbsoluteValueBox: function() {
      return this.selectedRadio === "Absolut"
    }
  }
}
</script>

<style lang="stylus" scoped>
.my-card
  width 100%
  max-width 800px
  margin: 0em
  padding: 1em
.abc
  max-width: 300px
div
{
padding: 0em;
}
</style>
