<template>
  <q-page padding>
    <!-- content -->
    <template>
  <div class="q-pa-md row q-col-gutter-sm">
    <!------------------------------------------------------------------------------------------------------------------>
    <!-- q-splitter                                                                                                   -->
    <!------------------------------------------------------------------------------------------------------------------>
    <q-splitter v-model="splitterModel" style="max-width: 2000px">
      <template v-slot:before>
        <!------------------------------------------------------------------------------------------------------------------>
        <!-- q-tree für Baustoffbaum                                                                                      -->
        <!------------------------------------------------------------------------------------------------------------------>
        <div class="col-md-6">
          <div class="text-h6">Baustoffe</div>
          <div class="q-pa-md">
            <q-tree
              ref="tree"
              :nodes="treeData"
              default-expand-all
              node-key="_id"
              label-key="bezeichnung"
              @lazy-load="onLazyLoad"
              :selected.sync="selectedKey"
              @update:selected="handleSelectedNode"
            />
          </div>
          <!------------------------------------------------------------------------------------------------------------------>
          <!-- ref="tree"                                                                                                   -->
          <!-- Siehe https://stackoverflow.com/questions/56125406/default-expand-all-doesnt-work-for-q-tree-vue-js          -->
          <!-- Erlaubt Zugriff auf QTree API, genaue Syntax siehe unten in methods handleSelectedNode                       -->
          <!------------------------------------------------------------------------------------------------------------------>
        </div>
      </template>
      <!-- v-slot:before -->
      <!------------------------------------------------------------------------------------------------------------------->
      <!-- <div v-if="selectedKey"> hier wieder entfernt                                                                 -->
      <!-- Hier gar kein div erlaubt, template muss auf Root Level sein inside the receiving component!!!                -->
      <!------------------------------------------------------------------------------------------------------------------->
      <template v-slot:after>
        <!------------------------------------------------------------------------------------------------------------------->
        <!-- <div v-if="selectedKey"> - ist zwar hier erlaubt, aber damit sonderbare Formatierung des q-splitters!!!       -->
        <!-- Daher versucht, die vi-ifs, nach weiter unten zu verschieben, um die eingebettete q-form und die 2 q-tables   -->
        <!-- herum, damit diese nur bei selektiertem Node angezeigt werden -- in den q-tables damit gescheitert, wohl weil -->
        <!-- diese schon komplexe selektive Logik in ihren v-models haben. Siehe unten.                                    -->
        <!-- ERFOLG: Mit <div v-if="selectedKey">  an den q-tab-panels FUNKTIONIERT die selektive Anzeige der Panels,      -->
        <!-- abhängig davon, ob ein Node im Tree selektiert ist oder nicht                                                 -->
        <!-- ACHTUNG: NICHT v-if="this.selectedKey"!!! Dann kommen undefined Fehler und q-tree wird nicht angezeigt!!!     -->
        <!-- Merkwürdigerweise wurde {{ selectedKey }} aber korrekt angezeigt!!!                                           -->
        <!-- Einfacher Grund: Es muss v-if="selectedKey" heißen, nicht "this.selectedKey"!!!                               -->
        <!-- HINWEIS: Ursprünglich: v-if="selectedNode" - nutzt nichts, da selectedNode schon am Anfang existiert          -->
        <!--          und initialisiert ist mit Werten in seiner Deklaration unten!!!                                      -->
        <!------------------------------------------------------------------------------------------------------------------->

        <!------------------------------------------------------------------------------------------------------------------>
        <!-- NEU: Tabs - v-slot:after (rechter Slot von q-splitter) soll 3 q-tabs mit 3 q-tab-panels hosten !!!!!!!!      -->
        <!------------------------------------------------------------------------------------------------------------------>
        <q-card>
          <q-tabs
            v-model="tab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
          >
            <q-tab name="typEigenschaften" label="Typeigenschaften" />
            <q-tab name="materialEigenschaften" label="Materialeigenschaften" />
            <q-tab name="abhängigeBaustoffe" label="Abhängige Baustoffe" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" animated>
            <!-- Es folgen die 3 q-tab-panels -->

            <q-tab-panel name="typEigenschaften" v-if="selectedKey">
              <!------------------------------------------------------------------------------------------------------------------>
              <!-- q-form für Eigenschaften des im q-tree selektierten Baustoffs                                                -->
              <!------------------------------------------------------------------------------------------------------------------>
              <!-- q-form wird q-tab-panel 1 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!                                    -->
              <!------------------------------------------------------------------------------------------------------------------>

              <q-form>
                <!---------------------------------------------------------------------------------------------------------------->
                <!-- ACHTUNG: Erst neues div mit v-if="selectedKey" hier probiert, funktionierte auch, aber nicht               -->
                <!-- in den komplexen Tabellen mit eigenem v-model und q-select darunter. Daher wieder entfernt!!!              -->
                <!-- v-if="selectedKey" an q-tab-panel scheint dagegen zu funktionieren!!!                                      -->
                <!---------------------------------------------------------------------------------------------------------------->
                <div class="q-gutter-md" style="min-width: 1500px max-width: 1500px">
                  <div class="text-h6">Typeigenschaften</div>
                  <div>_id: {{ selectedKey }}</div>
                  <!-- Erstes q-input hat Testcode zur Nutzung von rules: -->
                  <q-input
                    outlined
                    v-model="selectedNode.kurzBezeichnung"
                    @change="handleChange"
                    @input="handleInput"
                    lazy-rules
                    :rules="[
                      v => !!v || 'Kurzbezeichnung ist erforderlich',
                      v => (v && v.length <= 30) || 'Kurzbezeichnung darf höchstens 30 Zeichen lang sein',
                    ]"
                    label="Kurzbezeichnung:"
                    hint="Frei wählbare Bezeichnung, z.B.: 'Mein Kleber', 'Mein Estrich', ... "
                  />
                  <q-input
                    outlined
                    v-model="selectedNode.bezeichnung"
                    @change="handleChange"
                    @input="handleInput"
                    label="Bezeichnung:"
                    hint="Fachliche Bezeichnung, z.B.: 'Kleber', 'Estrich', ..."
                  />
                  <q-input
                    outlined
                    v-model="selectedNode.baumKnotenTyp"
                    @change="handleChange"
                    @input="handleInput"
                    label="Knotentyp:"
                    hint="Typ des Knotens im Baum: 'Wurzelknoten', 'Verzweigungsknoten', 'Blattknoten'"
                  />
                  <q-input
                    outlined
                    v-model="selectedNode.verzweigungsTyp"
                    @change="handleChange"
                    @input="handleInput"
                    label="Verzweigungstyp:"
                    hint="Typ der Verzweigung im Baum: '(ungeordnete) Selektion', 'ungeordnete Aggregation', 'vertikal angeordnete Aggregation', 'horizontal angeordnete Aggregation'"
                  />
                  <!------------------------------------------------------------------------------------------------------------------------------------>
                  <!-- ACHTUNG: Warnung "Invalid prop type" kommt in früherer Version des Codes für q-input mit v-model mit Feld Aktiv                -->
                  <!-- v-model funktioniert laut dieser Warnung nur mit String, Number !!!                                                            -->
                  <!-- Daher das obige q-input für aktiv vorübergehend deaktiviert, um die Warnungen loszuwerden                                      -->
                  <!-- Fehlerursache: aktiv war in baustoffmodel.js als String definiert, während aktiv hier in Baustoffliste Boolean war!!!          -->
                  <!-- (ACHTUNG: Die Methode toggleBautoffFieldAktiv, die testweise das Feld toggled, ist auch auf aktiv: String eingestellt!         -->
                  <!-- (Den "Aktivieren/Inaktivieren" Button, der sie aufruft, ebenfalls vorläufig mit dem q-input zusammen disabled                  -->
                  <!-- Bessere und funktionierende Alternative: q-input und q-btn zu q-toggle umdefinieren - unten hinzugefügt, aktiv überall Boolean -->
                  <!-- Daher deaktiviert:                                                                                                             -->
                  <!------------------------------------------------------------------------------------------------------------------------------------>
                  <!--
                  <q-input
                    outlined
                    v-model="selectedNode.aktiv"
                    label="Aktiv?"
                    hint="Aktiv oder inaktiv? 'true' oder 'false'"
                  />
                  <q-btn
                    color="grey"
                    text-color="black"
                    size="md"
                    push
                    @click="toggleBaustoffFieldAktiv()"
                    label="Aktivieren/Inaktivieren"
                  />
                  -->
                  <q-input
                    outlined
                    v-model="selectedNode.produkt"
                    @change="handleChange"
                    @input="handleInput"
                    label="Produkt:"
                    hint="Verweis auf Produkt: String (TBD)'"
                  />
                  <q-toggle v-model="selectedNode.aktiv" label="Aktiv" />
                  <!--------------------------------------------------------------------------------------------------------------------------------->
                  <!-- v-model="treeData[0].bezeichnung" funktioniert, referenziert aber immer den ersten Node in treeData!                        -->
                  <!-- v-model="selectedNode.bezeichnung" ist die korrekte Lösung zusammen mit handleSelectedNode Method Event Handler             -->
                  <!-- v-model="this.$refs.nodes.getNodeByKey(selectedKey).bezeichnung" funktioniert NICHT, nodes ist falsche Syntax!              -->
                  <!-- v-model="this.$refs.tree.getNodeByKey(selectedKey).bezeichnung" hat richtige Syntax, funktionniert aber auch NICHT,         -->
                  <!--          anscheinend weil man v-model, keine direkten Function Calls machen darf!                                           -->
                  <!--          Erlaubt sind nur einfache Funktionen mit get und set Funktionen,                                                   -->
                  <!--          siehe https://stackoverflow.com/questions/35210901/binding-method-result-to-v-model-with-vue-js                    -->
                  <!-- Weitere Hinweise zu $refs auf https://stackoverflow.com/questions/49923006/using-v-model-and-refs-in-a-slot-in-vue2         -->
                  <!-- und https://stackoverflow.com/questions/49040905/proper-use-of-vue-refs                                                     -->
                  <!-- HINWEIS: Mit dem QTree API getNodeByKey(selectedKey) kann auf den ausgewählten Node zugegriffen werden, returns <Object>    -->
                  <!-- Aktuelle Lösung: Mittels Method Event Handler handleSelectedNode(key) beim Select des Nodes in QTree dieses API aufrufen    -->
                  <!-- und alle weiteren Properties des Nodes in data () speichern - von dort kann sie dann das q-form für die Baustoffeienschaften-->
                  <!-- holen mit seinem v-model.                                                                                                   -->
                  <!-- Zunächst vergeblich versucht mit nativen Click Events:                                                                      -->
                  <!-- Siehe https://vuejs.org/v2/guide/events.html                                                                                -->
                  <!--    v-on:click="handleSelectedNode" (und unter methods: function handleSelectedNode (event) {})                              -->
                  <!-- Alternative: Siehe https://forum.vuejs.org/t/how-to-use-onselect-event-in-input/14062/4                                     -->
                  <!--   Native DOM Event @select: "@select.native="selectEvent""                                                                  -->
                  <!-- Richtiger Event von QTree: Siehe QTree API, Events: @update:selected (wird gefeuert, wenn der selektierte Node wechselt,    -->
                  <!-- liefert den aktuell selektierten Node Key als Parameter an handleSelectedNode(key) mit!!!!                                  -->
                  <!-- Mögliche noch bessere Alternative: computed: verwenden -                                                                    -->
                  <!-- dort können get und set Funktionen z.B. auf dem aktuellen Node, definiert werden                                            -->
                  <!--------------------------------------------------------------------------------------------------------------------------------->
                  <!-- Komponente q-separator als sichtbare Trennung zwischen q-tree und den Schaltflächen darunter (q-btns) -->
                  <q-separator spaced />

                  <div class="q-pa-md q-gutter-md">
                    <q-btn
                      color="green"
                      text-color="black"
                      type="submit"
                      size="md"
                      @click="submitBaustoff()"
                      label="Speichern"
                    />
                    <q-btn
                      color="yellow"
                      text-color="black"
                      size="md"
                      @click="cancelBaustoff()"
                      label="Abbrechen"
                    />
                    <q-btn
                      color="red"
                      text-color="white"
                      size="md"
                      @click="deleteBaustoff()"
                      label="Löschen"
                    />
                  </div>
                </div>
                <!-- /q-btns -->
              </q-form>
            </q-tab-panel>
            <!------------------------------------------------------------------------------------------------------------------>
            <!-- q-table für Materialeigenschaften des in q-tree ausgewählten Baustoffs                                       -->
            <!-- ACHTUNG: Für korrektes Funktionieren müssen diese im Baustoffcontroller natürlich geholt werden aus Mongoose!-->
            <!-- ACHTUNG: v-model ist notwendig, sonst reagiert die QTable nicht auf dessen Änderungen                        -->
            <!------------------------------------------------------------------------------------------------------------------>
            <!-- Diese q-table wird q-tab-panel 2 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!                            -->
            <!------------------------------------------------------------------------------------------------------------------>
            <q-tab-panel name="materialEigenschaften" v-if="selectedKey">
              <div class="q-gutter-sm" style="max-width: 1500px">
                <q-table
                  title="Materialeigenschaften"
                  dense
                  :data="selectedNode.materialEigenschaften"
                  :columns="tableColumnsMaterialEigenschaften"
                  row-key="_id"
                  :visible-columns="visibleColumnsMaterialEigenschaften"
                >
                  <!-- ACHTUNG: div mit v-if hier nicht erlaubt, <template v-slot< muss Root Level in der receiving Component sein!!! -->

                  <!-- Der folgende Teil inklusive v-model, das :visible-columns in q-table oben referenziert, ist für die Selektion der q-table Spalten per Toggles -->
                  <template v-slot:top="props">
                    <!------------------------------------------------------------------------------------------->
                    <!-- ACHTUNG: Erst neues div mit v-if="selectedKey" hier probiert, funktioniert aber nicht -->
                    <!-- für alle Teile der komplexen Tabelle mit eigenem v-model und q-select!!!              -->
                    <!-- v-if="selectedKey" an q-tab-panel oben scheint dagegen zu funktionieren!!!            -->
                    <!------------------------------------------------------------------------------------------->
                    <div class="col-2 q-table__title">Material-Eigenschaften</div>
                    <!-- <q-space /> -->
                    <div v-if="$q.screen.gt.xs" class="col">
                      <!----------------------------------------------------------------------------------------->
                      <!-- <q-toggle v-model="visibleColumnsMaterialEigenschaften" val="name" label="Name" />  -->
                      <!-- HINWEIS: Die Spalte mit dem Key kann/sollte nicht ausgeblendet werden!              -->
                      <!----------------------------------------------------------------------------------------->
                      <q-toggle
                        v-model="visibleColumnsMaterialEigenschaften"
                        val="symbol"
                        label="Symbol"
                      />
                      <q-toggle
                        v-model="visibleColumnsMaterialEigenschaften"
                        val="einheit"
                        label="Einheit"
                      />
                      <q-toggle
                        v-model="visibleColumnsMaterialEigenschaften"
                        val="bemerkung"
                        label="Bemerkung"
                      />
                      <q-toggle
                        v-model="visibleColumnsMaterialEigenschaften"
                        val="operator"
                        label="Operator"
                      />
                      <q-toggle
                        v-model="visibleColumnsMaterialEigenschaften"
                        val="technischeRegel"
                        label="Technische Regel"
                      />
                      <q-space />
                      <!-- TODO: Wie ginge ein gemeinsamer Toggle für alle bauphysikalische Schutzkategorien?-->
                      <q-toggle
                        v-model="visibleColumnsMaterialEigenschaften"
                        val="schallSchutz"
                        label="Schallschutz"
                      />
                      <q-toggle
                        v-model="visibleColumnsMaterialEigenschaften"
                        val="wärmeSchutz"
                        label="Wärmeschutz"
                      />
                      <q-toggle
                        v-model="visibleColumnsMaterialEigenschaften"
                        val="raumAkustik"
                        label="Raumakustik"
                      />
                      <q-toggle
                        v-model="visibleColumnsMaterialEigenschaften"
                        val="feuchteSchutz"
                        label="Feuchteschutz"
                      />
                      <q-space />
                      <q-toggle
                        v-model="visibleColumnsMaterialEigenschaften"
                        val="chemischerHolzSchutz"
                        label="Holzschutz"
                      />
                      <q-toggle
                        v-model="visibleColumnsMaterialEigenschaften"
                        val="abdichtungsTechnik"
                        label="Abdichtungstechnik"
                      />
                      <q-toggle
                        v-model="visibleColumnsMaterialEigenschaften"
                        val="korrosionsSchutz"
                        label="Korrosionsschutz"
                      />
                      <q-toggle
                        v-model="visibleColumnsMaterialEigenschaften"
                        val="schadstoffAnforderungen"
                        label="Schadstoffschutz"
                      />
                      <q-toggle
                        v-model="visibleColumnsMaterialEigenschaften"
                        val="ökoBilanz"
                        label="Ökobilanz"
                      />
                    </div>
                    <!------------------------------------------------------------------------------------------------------------------------------->
                    <!-- q-select, um abhängig von Toggles die Tabelle nur mit den ausgewählten Spalten anzuzeigen                                 -->
                    <!-- ACHTUNG: Funktionsweise von q-select muss noch genauer erforscht werden                                                   -->
                    <!-- Durch das v-else am Anfang scheint es ein unsichtbares Dropdown Select-Menü zu sein!                                      -->
                    <!-- Durch das emit-value und map-options scheinen die Toggle-Werte auf visibleColumnsMaterialEigenschaften gemapped zu werden -->
                    <!------------------------------------------------------------------------------------------------------------------------------->
                    <q-select
                      v-else
                      v-model="visibleColumnsMaterialEigenschaften"
                      multiple
                      borderless
                      dense
                      options-dense
                      :display-value="$q.lang.table.columns"
                      emit-value
                      map-options
                      :options="columns"
                      option-value="name"
                      style="min-width: 150px"
                    />
                    <!-- Toggle Button für Fullscreen-Darstellung von q-table -->
                    <q-btn
                      flat
                      round
                      dense
                      :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                      @click="props.toggleFullscreen"
                      class="q-ml-md"
                    />
                  </template>
                  <!----------------------------------------------------------------------------------------------------------------------------------------------->
                  <!-- /template v-slot                                                                                                                          -->
                  <!-- Vorschlag aus https://forum.quasar-framework.org/topic/4127/how-to-display-and-maybe-later-edit-checkboxes-for-boolean-values-in-qtable/2 -->
                  <!-- Nested q-checkbox Konponente in Boolean columns - bessere Lösung als simples format mit Unicode                                           -->
                  <!----------------------------------------------------------------------------------------------------------------------------------------------->
                  <template v-slot:body-cell-schallSchutz="props">
                    <q-td :props="props">
                      <q-checkbox v-model="props.row.schallSchutz" />
                    </q-td>
                  </template>
                  <template v-slot:body-cell-wärmeSchutz="props">
                    <q-td :props="props">
                      <q-checkbox v-model="props.row.wärmeSchutz" />
                    </q-td>
                  </template>
                  <template v-slot:body-cell-raumAkustik="props">
                    <q-td :props="props">
                      <q-checkbox v-model="props.row.raumAkustik" />
                    </q-td>
                  </template>
                  <template v-slot:body-cell-feuchteSchutz="props">
                    <q-td :props="props">
                      <q-checkbox v-model="props.row.feuchteSchutz" />
                    </q-td>
                  </template>
                  <template v-slot:body-cell-chemischerHolzSchutz="props">
                    <q-td :props="props">
                      <q-checkbox v-model="props.row.chemischerHolzSchutz" />
                    </q-td>
                  </template>
                  <template v-slot:body-cell-abdichtungsTechnik="props">
                    <q-td :props="props">
                      <q-checkbox v-model="props.row.abdichtungsTechnik" />
                    </q-td>
                  </template>
                  <template v-slot:body-cell-korrosionsSchutz="props">
                    <q-td :props="props">
                      <q-checkbox v-model="props.row.korrosionsSchutz" />
                    </q-td>
                  </template>
                  <template v-slot:body-cell-schadstoffAnforderungen="props">
                    <q-td :props="props">
                      <q-checkbox v-model="props.row.schadstoffAnforderungen" />
                    </q-td>
                  </template>
                  <template v-slot:body-cell-ökoBilanz="props">
                    <q-td :props="props">
                      <q-checkbox v-model="props.row.ökoBilanz" />
                    </q-td>
                  </template>
                </q-table>
              </div>
            </q-tab-panel>
            <!----------------------------------------------------------------------------------------------------------------------->
            <!-- q-table zur Darstellung der Kinder des selektierten Knotens, hier kann z.B. später "Einfügen" hinzugefügt werden  -->
            <!----------------------------------------------------------------------------------------------------------------------->
            <!-- Diese q-table wird q-tab-panel 3 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!                                  -->
            <!----------------------------------------------------------------------------------------------------------------------->
            <q-tab-panel name="abhängigeBaustoffe" v-if="selectedKey">
              <div class="q-gutter-sm" style="max-width: 1500px">
                <q-table
                  title="Abhängige Baustoffe"
                  dense
                  :data="selectedNode.kinder"
                  :columns="tableColumnsKinder"
                  row-key="_id"
                  :visible-columns="visibleColumnsKinder"
                >
                  <!--------------------------------------------------------------------------------------------------------------------------------------------------->
                  <!-- ACHTUNG: div mit v-if hier nicht erlaubt, <template v-slot> muss Root Level in der receiving Component sein!!!                                -->
                  <!-- ACHTUNG: _id für kinder per Mongoose/REST ist für Tabelle "Abhängige Baustoffe" unbedingt erforderlich, da Row Key für diese Tabelle!!!       -->
                  <!--                                                                                                                                               -->
                  <!-- Der folgende Teil inklusive v-model, das :visible-columns in q-table oben referenziert, ist für die Selektion der q-table Spalten per Toggles -->
                  <!--------------------------------------------------------------------------------------------------------------------------------------------------->
                  <template v-slot:top="props">
                    <!------------------------------------------------------------------------------------------->
                    <!-- ACHTUNG: Erst neues div mit v-if="selectedKey" hier probiert, funktioniert aber nicht -->
                    <!-- für alle Teile der komplexen Tabelle mit eigenem v-model und q-select!!!              -->
                    <!-- v-if="selectedKey" an q-tab-panel oben scheint dagegen zu funktionieren!!!            -->
                    <!------------------------------------------------------------------------------------------->
                    <div class="col-2 q-table__title">Abhängige Baustoffe</div>
                    <!-- <q-space /> -->
                    <div v-if="$q.screen.gt.xs">
                      <!----------------------------------------------------------------------------------------->
                      <!-- <q-toggle v-model="visibleColumnsKinder" val="name" label="Name" />                 -->
                      <!-- HINWEIS: Die Spalte mit dem Key kann/sollte nicht ausgeblendet werden!              -->
                      <!----------------------------------------------------------------------------------------->
                      <q-toggle
                        v-model="visibleColumnsKinder"
                        val="kurzBezeichnung"
                        label="Kurzbezeichnung"
                      />
                      <q-toggle
                        v-model="visibleColumnsKinder"
                        val="bezeichnung"
                        label="Bezeichnung"
                      />
                      <q-toggle
                        v-model="visibleColumnsKinder"
                        val="baumKnotenTyp"
                        label="Knotentyp"
                      />
                      <q-toggle
                        v-model="visibleColumnsKinder"
                        val="verzweigungsTyp"
                        label="Verzweigungstyp"
                      />
                      <q-toggle v-model="visibleColumnsKinder" val="produkt" label="Produkt" />
                      <q-toggle v-model="visibleColumnsKinder" val="aktiv" label="Aktiv" />
                    </div>
                    <!------------------------------------------------------------------------------------------------------------------------------->
                    <!-- q-select, um abhängig von Toggles die Tabelle nur mit den ausgewählten Spalten anzuzeigen                                 -->
                    <!-- ACHTUNG: Funktionsweise von q-select muss noch genauer erforscht werden                                                   -->
                    <!-- Durch das v-else am Anfang scheint es ein unsichtbares Dropdown Select-Menü zu sein!                                      -->
                    <!-- Durch das emit-value und map-options scheinen die Toggle-Werte auf visibleColumnsMaterialEigenschaften gemapped zu werden -->
                    <!------------------------------------------------------------------------------------------------------------------------------->
                    <q-select
                      v-else
                      v-model="visibleColumnsKinder"
                      multiple
                      borderless
                      dense
                      options-dense
                      :display-value="$q.lang.table.columns"
                      emit-value
                      map-options
                      :options="columns"
                      option-value="name"
                      style="min-width: 150px"
                    />
                    <!-- ACHTUNG: option-value="name" ist erforderlich, nicht option-value="kurzBezeichnung" o.ä.!!! -->
                    <!-- Toggle Button für Fullscreen-Darstellung von q-table -->
                    <q-btn
                      flat
                      round
                      dense
                      :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                      @click="props.toggleFullscreen"
                      class="q-ml-md"
                    />
                  </template>
                  <!-- Vorschlag aus https://forum.quasar-framework.org/topic/4127/how-to-display-and-maybe-later-edit-checkboxes-for-boolean-values-in-qtable/2 -->
                  <!-- Nested q-checkbox Konponente in Boolean columns - bessere Lösung als simples format mit Unicode -->
                  <template v-slot:body-cell-aktiv="props">
                    <q-td :props="props">
                      <q-checkbox v-model="props.row.aktiv" />
                    </q-td>
                  </template>
                </q-table>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </template>
      <!-- v-slot:after -->
    </q-splitter>
  </div>
  <!-- </div> -->
  <!-- v-if="selectedNode" (ALTE Version ohne q-splitter, hatte div mit v-if "außen" -->
    </template>
  </q-page>
</template>

<script>
/*===================================================================================================================================================//
Vue/Quasar Komponente BaustoffTree.vue (vorläufig noch: BaustoffListe.vue)

Erzeugt einen Baum von Baustoffen und erlaubt dessen Anzeige und später Manipulation
Abgeleitet aus erster BaustoffListe.vue - soll diese lineare Liste von Baustoffen ersetzen

HINWEIS: Bzgl. QTree oben in der Vue/Quasar Template-Option:
:nodes="treeData" muss matchen mit dem Array treeData [] in Data(), der die Repräsentation des Trees in Data() ist
Dieser kann opaq definiert sein ohne Struktur (treeData [], oder mit Struktur wie unten gewählt: treeData [ {} ])
Desweiteren müssen die in q-tree angegebene String-Werte für node-key und label-key genau matchen mit den in Data() dafür aufbereiteten
{Name: Value} Namen im ansonsten bzgl. seiner Struktur für QTree in der Vorlage ansonsten "opaquen" JSON Array treeData in Data()

Beispiel: label-key="bezeichnung" erwartet im JSON Array dann {"bezeichnung": "Mauerwerk"} und nimmt dann "Mauerwerk" als Label für den Knoten im QTree.
Wir nehmen hier für Baustoff die unique "_id" als node-key und "bezeichnung" als label.
Diese müssen per REST dann natürlich genau so übertragen werden an den Client.
D.h. es erfolgt ein Matching zwischen dem Array aus Baustoffen und dem QTree aufgrund dieser beiden Namen.
Die Kinder werden dann in onLazyLoad explizit zusätzlich auf den Array gepushed.

Ferner können noch zusätzliche Properties wie z.b. lazy eine Rolle spielen, die auch per lazy: true in den Array injiziert sein können
Beispiel: https://quasar.dev/vue-components/tree#Lazy-loading - dort SCRIPT, siehe die Array-Definition für Array lazy in data()

Anderes Code-Beispiel auf https://github.com/okamismo/pmt/blob/master/client/src/pages/edt.vue
zeigt aber doch, dass man auch mit einem strukturierten, nicht opaquen (in JS immer dynamischen Array) in Data() arbeiten kann:
Im Template:
    <q-tree
      ref="arbol"
      :nodes="nodos"
      node-key="id" :
      selected.sync="selection"
      default-expand-all
      :expanded.sync="expanded"
      @lazy-load="onLazyLoad"
    >
  1) Mit :nodes="nodos" wird q-tree :nodes an den Array "nodos" in Data() gebunden!
  2) Mit node-key="id" wird node-key an "id" in Data() gebunden!
  Dann weiß eine Variable im Skript, die auf nodos basiert, später von diesen Properties

  Code in data():
  nodos: [
    {
    id: 'root', // ist hier String!
    label: this.$store.getters['main/getProyectoActual'].nombre,
    lazy: true,
    children: [],
    id_padre: null,
    icon: null
    }
  ]
lazy und children sind hier ebenfalls explizit mit definiert
In onLazyLoad wird später auf diese Struktur zugegriffen, z.B. werden hier node.id_padre gesetzt und node.children
node ist dabei der erste der Parameter von onLazyLoad({ node, key, done, fail })
Dieser wird in onLazyLoad einfach verwendet ohne weitere Deklaration, implizit scheint er dann vom Typ nodos zu sein
Beispiel aus onLazyLoad dafür:
    request.postRequest(payload,this.$store).then( (res) =>{
    if(res.data.length !== undefined) {
      res.data.map( function(node,index,all) {
        if(node.id_padre === null) {
        node.id_padre = "root";
          }
        node.children = [];
      })
    }
//-------------------------------------------------------------------------------------------------------------------------------------*/

import http from "../http-common";

// import Vue from "vue"; /* ALT */
import Vue from "vue/dist/vue.js"; /* NEU - Muss ÜBERALL so importiert werden, auch in den anderen Vue Schwester-Komponenten
// ACHTUNG: In index.js funktioniert es so nicht, dort den obigen alten Import belassen !!!!!!!!!!!! */
/*---------------------------------------------------------------------------------------------------------------------------------------------//
Dies soll Vue Warning verhindern, die zuerst durch die (vorübergehende) Verwendung der template: Option für neu eingefügte Komponente in baustoff.vue kam:
[Vue warn]: You are using the runtime-only build of Vue where the template compiler is not available.
Either pre-compile the templates into render functions, or use the compiler-included build.
Ohne dieses Import auch andere Fehler, dass Baustoff in Liste nicht gefunden wird, also wo immer möglich den neuen Import verwenden!
//---------------------------------------------------------------------------------------------------------------------------------------------*/

export default {
  name: "baustoff-list",
  data() {
    return {
      splitterModel: 30, // Für q-splitter
      tab: "typEigenschaften", // Für q-tabs
      /*------------------------------------------------------------------------------------------------------------------//
      Daten für q-table für Kinder des ausgewählten Baustoffs
      NEU: Sichtbare Spalten werden per q-toggles gesteuert
      //------------------------------------------------------------------------------------------------------------------*/
      visibleColumnsKinder: [
        "kurzBezeichnung",
        "bezeichnung",
        "baumKnotenTyp",
        "verzweigungsTyp",
        "produkt",
        "aktiv"
      ],

      tableColumnsKinder: [
        // Spaltendefinitionen für q-table
        {
          name: "kurzBezeichnung",
          required: true,
          label: "Kurzbezeichnung",
          align: "left",
          field: row => row.kurzBezeichnung,
          format: val => `${val}`,
          /*------------------------------------------------------------------------------------------------------------------//
          Aus der QTable Doc:
          (optional) you can format the data with a function: format: (val, row) => `${val}%`
          Anderes Beispiel: format: val => date.formatDate(val, ‘DD-MM-YYYY’)
          Es können auch Funktionen (mit .this !!!) benutzt werden: format: (val) => this.displayCheckMark(val) mit val: Boolean
          //------------------------------------------------------------------------------------------------------------------*/
        },
        {
          name: "bezeichnung",
          align: "left",
          label: "Bezeichnung",
          field: "bezeichnung",
          sortable: true
        },
        {
          name: "baumKnotenTyp",
          align: "left",
          label: "Knotentyp",
          field: "baumKnotenTyp",
          sortable: true
        },
        {
          name: "verzweigungsTyp",
          align: "left",
          label: "Verzweigungstyp",
          field: "verzweigungsTyp",
          sortable: true
        },
        {
          name: "produkt",
          align: "left",
          label: "Produkt",
          field: "produkt",
          sortable: true
        },
        {
          name: "aktiv",
          align: "center",
          label: "Aktiv",
          field: "aktiv",
          // format: val => this.displayCheckMark(val),
          // Erste simple Lösung mit Unicode Checkmarks statt q-checkbox, wieder entfernt
          sortable: true
        }
      ],

      //*------------------------------------------------------------------------------------------------------------------//
      // Daten für q-table für Materialeigenschaften des ausgewählten Baustoffs
      // NEU: Sichtbare Spalten werden per q-toggles gesteuert
      //------------------------------------------------------------------------------------------------------------------*/
      visibleColumnsMaterialEigenschaften: [
        "name",
        "symbol",
        "einheit",
        "bemerkung",
        "operator",
        "technischeRegel",
        "schallSchutz",
        "wärmeSchutz",
        "raumAkustik",
        "feuchteSchutz",
        "chemischerHolzSchutz",
        "abdichtungsTechnik",
        "korrosionsSchutz",
        "schadstoffAnforderungen",
        "ökoBilanz"
      ],

      /*------------------------------------------------------------------------------------------------------------------//
      Helper function for Boolean val to display checkmarks instead of "true" or "false"
      Wird aktuell nicht mehr benötigt!
      //------------------------------------------------------------------------------------------------------------------*/
      displayCheckMark: function(val) {
        if (val) {
          return "\u2611"; // Unicode checkmark checked
        } else {
          return "\u2610"; // Unicode checkmark unchecked
        }
      },

      tableColumnsMaterialEigenschaften: [
        // Spaltendefinitionen für q-table
        {
          name: "name",
          required: true,
          label: "Name",
          align: "left",
          field: row => row.name,
          format: val => `${val}`,
          /*------------------------------------------------------------------------------------------------------------------//
          Aus der QTable Doc:
          (optional) you can format the data with a function: format: (val, row) => `${val}%`
          Anderes Beispiel: format: val => date.formatDate(val, ‘DD-MM-YYYY’)
          Es können auch Funktionen (mit .this !!!) benutzt werden: format: (val) => this.displayCheckMark(val) mit val: Boolean
          //------------------------------------------------------------------------------------------------------------------*/
          sortable: true
        },
        {
          name: "symbol",
          align: "center",
          label: "Symbol",
          field: "symbol",
          sortable: true
        },
        {
          name: "einheit",
          align: "center",
          label: "Einheit",
          field: "einheit",
          sortable: true
        },
        {
          name: "bemerkung",
          align: "center",
          label: "Bemerkung",
          field: "bemerkung",
          sortable: true
        },
        {
          name: "operator",
          align: "center",
          label: "Operator",
          field: "operator",
          sortable: true
        },
        {
          name: "technischeRegel",
          align: "center",
          label: "Technische Regel",
          field: "technischeRegel",
          sortable: true
        },
        {
          name: "schallSchutz",
          align: "center",
          label: "Schallschutz",
          field: "schallSchutz",
          // format: val => this.displayCheckMark(val),
          // Erste simple Lösung mit Unicode Checkmarks statt q-checkbox, wieder entfernt
          sortable: true
        },
        {
          name: "wärmeSchutz",
          align: "center",
          label: "Wärmeschutz",
          field: "wärmeSchutz",
          // format: val => this.displayCheckMark(val),
          sortable: true
        },
        {
          name: "raumAkustik",
          align: "center",
          label: "Raumakustik",
          field: "raumAkustik",
          // format: val => this.displayCheckMark(val),
          sortable: true
        },
        {
          name: "feuchteSchutz",
          align: "center",
          label: "Feuchteschutz",
          field: "feuchteSchutz",
          // format: val => this.displayCheckMark(val),
          sortable: true
        },
        {
          name: "chemischerHolzSchutz",
          align: "center",
          label: "Holzschutz",
          field: "chemischerHolzSchutz",
          // format: val => this.displayCheckMark(val),
          sortable: true
        },
        {
          name: "abdichtungsTechnik",
          align: "center",
          label: "Abdichtungstechnik",
          field: "abdichtungsTechnik",
          // format: val => this.displayCheckMark(val),
          sortable: true
        },
        {
          name: "korrosionsSchutz",
          align: "center",
          label: "Korrosionsschutz",
          field: "korrosionsSchutz",
          // format: val => this.displayCheckMark(val),
          sortable: true
        },
        {
          name: "schadstoffAnforderungen",
          align: "center",
          label: "Schadstoffschutz",
          field: "schadstoffAnforderungen",
          // format: val => this.displayCheckMark(val),
          sortable: true
        },
        {
          name: "ökoBilanz",
          align: "center",
          label: "Ökobilanz",
          field: "ökoBilanz",
          // format: val => this.displayCheckMark(val),
          sortable: true
        }
      ],

      // Daten für q-table (nur falls oben im Template :data="selectedNode.materialEigenschaften" nicht funktionieren würde)
      /*
      tableData: [
        {}
      ],
      */

      /*------------------------------------------------------------------------------------------------------------------//
      Daten für q-tree für Baustoffe
      NEU: selectedNodeObjekt in data(), um die Daten des selektierten Nodes zu halten
      Hier können später noch weitere Tree-Variablen angelegt werden zur Kontrolle des Trees
      //------------------------------------------------------------------------------------------------------------------*/

      treeChange: 0, // Aus der Vorlagen, unklar ob notwendig für erste Implementierung
      selectedKey: null, // NEU: Hält node-key (_id) des ausgewählten Knotens im Baum, angezogen mit :selected.sync="selectedKey" im q-tree Template

      // NEU: Daten des ausgewählten Knotens im Baum, werden befüllt durch handleSelectedNode(key)
      selectedNode: {
        _id: null,
        kurzBezeichnung: "Mutter aller Baustoffe",
        bezeichnung: "Baustoffe",
        baumKnotenTyp: "Wurzelknoten",
        verzweigungsTyp: "(ungeordnete) Selektion",
        produkt: "",
        aktiv: true,
        materialEigenschaften: [],
        kinder: []
      },

      // Nun der Array zur inhaltlichen Steuerung des q-tree Trees
      treeData: [
        {

          /*------------------------------------------------------------------------------------------------------------------//
          WICHTIG:
          a) In diesem Array werden die Strukturdaten des Baums für qTree gehalten - dies läuft über die Prop node-key=_id
             Dabei kennt qTree die Kinder nicht über die Prop kinder, sondern "lernt" sie indirekt über die Funktion done(node)
          b) und per Lazy Load schrittweise aufgebaut beim Expandieren von Knoten
          ALLE schon per lazy Load geholten Nodes im Tree gespeichert
          Bei jedem onLazyLoad Call werden neue Kinder per REST Calls vom Backend geholt und auf diesen Array gepushed
          Der im Baum selektierte Node selber kann identifiziert werden durch node-key (wird synchronisiert mit selectedKey)
          Der Array wurde so definiert, dass alle Props von baustoff enthalten sind!!
          Obwohl viele dieser Props der Kinder zunächst nicht selbst im Tree gebraucht werden, werden sie später durch
          den Event Handler HandleSelectedNode per QTree API Call (getNodeByKey) gefunden und nach selectedNode kopiert,
          von wo sie dann von dem Form rechts vom QTree verwendet werden
          treeData Müsste also eigentlich besser baustoffData: [...] oder baustoffTreeData: [...] heißen
          Im Hinblick auf eine spätere Verwendung des Codes für Bauteilbäume aber so gelassen

          HINWEIS: QTree wird NUR über die beiden "ausgezeichneten" Props node-key und label-key in diesem Array gesteuert, die
          gemapped sind auf _id und bezeichnung: [ { {_id: 1234}, ..., {bezeichnung: "xyz"} }]

          ACHTUNG: onLazyLoad wird aufgerufen beim EXPANDIEREN von Knoten im Baum, NICHT beim SELEKTIEREN!!!
          Beim SELEKTIEREN wird handleSelectedNode aufgerufen!!!
          Diese zwei sind also unabhängig und können nicht darauf vertrauen, dass z.B. die einer vor der anderen gerufen wurde!!!!
          //------------------------------------------------------------------------------------------------------------------*/
          _id: null, // Diese Prop wird als node-key im QTree verwendet
          // null als Anfangswert, alternativ "" (empty string), man könnte anfangs auch die _id des Root-Knotens im Baum setzen
          kurzBezeichnung: "Mutter aller Baustoffe", // NEU hinzugefügt
          bezeichnung: "Baustoffe", // Diese Prop wird als label-key im QTree verwendet
          baumKnotenTyp: "Wurzelknoten", // NEU hinzugefügt
          verzweigungsTyp: "(ungeordnete) Selektion", // NEU hinzugefügt
          produkt: "", // NEU hinzugefügt
          aktiv: true, // NEU hinzugefügt
          materialEigenschaften: [], // NEU hinzugefügt, dazu müssen diese auch im obigen REST Call (BaustoffController) mit Mongoose geholt werden!
          kinder: [], // NEU hinzugefügt, Array mit Kindern, die für qTree durch _id und bezeichnung identifiziert werden
          /*---------------------------------------------------------------------------------------------------------------------------------------//
          ACHTUNG - die weiteren kinder wurden ursprünglich noch nicht mit geholt in get /baustoffe/wurzel per BaustoffController, sondern
          sie kamen dann per get /baustoffe/kinder mit dem REST Call in onLazyLoad zusätzlich mit auf den Array
          ACHTUNG - Im aktuellen Code von get /baustoffe/kinder bzw. get /baustoffe/wurzel werden sie nun doch gleich geholt und sogar populiert!!!
          //---------------------------------------------------------------------------------------------------------------------------------------*/
          lazy: true, // !!!!! Aus Vorlage, wird vermutlich von Watch (noch nicht implementiert) gebraucht!
          parent_id: null // !!!!! Aus Vorlage, wird eventuell von QTree gebraucht !!!!
        }
      ] // /Array
    };
  },

  methods: {
    /* eslint-disable no-console */
    /*----------------------------------------------------------------------------------------------//
    Methods für q-tree für die Baustoffe
    //----------------------------------------------------------------------------------------------*/

    onLazyLoad({ node, key, done, fail }) {
      /*--------------------------------------------------------------------------------------------------------------------------------------------------//
      onlazyLoad Methode für Lazy Loading von Kindern eines Nodes node mit node-key key
      fail() ist Funktion, die im Fehlerfall augerufen wird ("if any error occurs")

      done(children) ist eine Funktion zum Rendern des Arrays der neuen Kinder, sie erhält als Argument die neuen Kinder als Array
      HINWEIS: Nur durch den Aufruf dieser Funktion "lernt" q-tree, welche Kinder ein Node hat!!!
      Die Kinder werden dabei von QTree zum bisherigen Array hinzugefügt (Push, dieser heisst nodes im QTree API)
      Laut einem Post des Quasar Autors nutzt QTree die automatische Array Change Detection von Vue, die bei Array-Änderungen View Updates triggered
      https:vuejs.org/v2/guide/list.html#Array-Change-Detection
      Die API Doc zeigt, dass es intern eine Node Property children kennt sowie eine Node Property lazy, mit der für einen Node eingestellt werden kann, ob
      seine kinder lazy loaded werden sollen (dann solte laut API Doc children empty sein - die Verwendung dieser Props müsste noch getestet werden!!!

      key ist der Key des aktuellen (Parent) Nodes, bei uns _id des baustoffs

      node ist der aktuelle Parent Node, mit node._id, node.kinder, node.lazy etc. kann man auf diesen zugreifen
      Dies ist unter "QTree API" auf https:quasar.dev/vue-components/tree#Lazy-loading auch dokumentiert!
      Dort ist unten eine Tabelle "Nodes model structure", wo noch mehr Properties von node angegeben werden, die im QTree v-model berücksichtigt werden
      node.id steht dort nicht explizit, dafür node.<nodeKey>: The key is picked from the key specified in nodeKey property.
      <nodeKey> kann dabei String oder Number sein.
      Das bedeutet, dass dann der richtige Code (bei Verwendung von _id statt id) deshalb node._id lautet, nicht node.id wie in der folgenden Code-Vorlage,
      die für den Baustoffbaum als Grundlage diente!!!

      Code-Vorlage von https:forum.quasar-framework.org/topic/4033/not-solved-by-quasar-but-manual-coding-auto-expand-for-lazy-qtree-node/3

      ACHTUNG: Die Code-Vorlage implementiert zusätzliche eine Watch-Methode, um bestimmte Restriktion von q-tree auszubügeln - hier noch nicht übernommen!
      ACHTUNG: Vorsicht beim Holen der (populierten) Kinder - dabei kommt es darauf an welches Format diese haben!!!
      Mongoose: Objekt mit gewrappetem Array, Quasar: Erwartet evtl. puren Array - siehe unten!!!
      //-----------------------------------------------------------------------------------------------------------------------------------------------------*/

      let parent_id = node._id; // Wird unten gebraucht, id des aktuellen (Parent) Nodes
      console.log("In onLazyLoad - parent_id: " + parent_id); // Displays _id correctly after code changes in mounted()
      console.log("In onLazyLoad - key:       " + key); // Displays key correctly after code changes in mounted()
      // ACHTUNG: parent_id und key sind dasselbe!!!

      // REST Call BaustoffKinder, um die Kinder zu holen
      http
        .get("/baustoff/kinder/" + parent_id)
        .then(response => {
          console.log("In onLazyLoad after GET children...");
          console.log(response.data); // Shows 3 children on test runs, they are an object {"kinder":  [...]}, array embedded, as expected
          // If no children tree return
          if (response.data == null) {
            done([]);
            return;
          }
          /*------------------------------------------------------------------------------------------------------------------------//
          Statt des folgenden Codes aus der Vorlage kann man eventuell auch gleich dieses versuchen - aber Fehler!!!
            this.treeData = response.data; // JSON are parsed automatically
            done(this.treeData);

          Varianten des Codes aus der Vorlage:
            let donvis = Object.values(response.data); -- Fehler, muss zusammen mit Object.keys eingesetzt werden?
            let donvis = JSON.parse(response.data); // tree node data, Array -- Fehler

          Code aus der Vorlage:
          Process to create tree
          //-------------------------------------------------------------------------------------------------------------------------*/
          let donvis = response.data; // The name of the temporary object donvis is tribute to my friend @maxxiris from Quasar forum!
          // console.log("In onLazyLoad after GET children - length: " + donvis.length); // undefined!!! Es stimmt also was nicht mit donvis

          let treeNodes = []; // temporärer Array, in dem die neuen Kinder für QTree aufgebaut werden
          /*------------------------------------------------------------------------------------------------------------------------//
          Diese haben z.T. dieselben Properties wie die Kinder in response.data: _id, bezeichnung
          Diese haben z.T. andere Properties als die Kinder in response.data: lazy: true, parent_id: parent_id

          HINWEIS: treeData in Data() wird in der Vorlage nicht direkt verwendet für onLazyLoad, nur für mounted
          onLazyLoad fügt aber indirekt über done(treeNodes) den Array treeNodes (der die Nodes für die Kinder enthält) zu treeData hinzu!!!

          Von https://stackoverflow.com/questions/57331677/how-to-map-json-coming-from-mongoose-to-vue-and-quasar
          Mongoose und damit das REST API liefert immer Objekt {"kinder": [ {}, .. {} } !!!
          Es liefert nicht einen Array [ {}, ... {} ] für die kinder direkt, wie es onLazyLoad im Parameter node zurückerwartet!
          Daher ist hier ein spezielles Push für die Kinder erforderlich, dass einen solchen Array [...] für die
          Child Nodes erzeugt, ohne { "kinder": [...] } drumherum
          //--------------------------------------------------------------------------------------------------------------------------*/
          donvis.kinder.forEach(child => {
            treeNodes.push({
              _id: child._id, // QTree node-key, unbedingt erforderlich für QTree
              kurzBezeichnung: child.kurzBezeichnung,
              bezeichnung: child.bezeichnung, // QTree label-key, unbedingt erforderlich für QTree
              baumKnotenTyp: child.baumKnotenTyp,
              verzweigungsTyp: child.verzweigungsTyp,
              produkt: child.produkt,
              aktiv: child.aktiv,
              materialEigenschaften: child.materialEigenschaften, // Array, wird in Tabelle "Materialeigenschaften" verwendet
              kinder: child.kinder, // Das ist der in ein Objekt gewrappte Array der Kindeskinder - diese sind aktuell NICHT populiert
              // und werden eigentlich auch nicht weiter verwendet. Sie werden dann später populiert durch
              // weitere Lazy Loads beim Expandieren ihrer Väter, die ja hier die Kinder in treeNodes sind!!!
              // Diese heißen hier Kinder, also nicht identisch mit der q-tree API Prop children
              lazy: true, // Aus Vorlage, bisher nicht verwendet - wahrscheinlich identisch mit q-tree API Prop lazy, über die Lazy Loading in q-tree gesteuert wird
              parent_id: parent_id // Aus Vorlage, bisher nicht verwendet - Variable parent_id wurde oben schon definiert!!!
            });
          });
          /*--------------------------------------------------------------------------------------------------------------------//
          // Falscher ursprünglicher Code:
              for (let i = 0; i < donvis.length; i++) {
              // Define Tree ARRAY for draw tree
                treeNodes[i] = {
                 bezeichnung: donvis[i].bezeichnung,
                 _id: donvis[i]._id,
                 lazy: true,
                 parent_id: parent_id, // ======> parent_id (rechts) wurde ganz oben schon initialisiert mit QTree node._id
                 // Die children im Parent node werden dabei automatisch von QTree gesetzt, aus den Children im Array
                 // Es passiert ein Push zu den bisherigen Children, under the Cover, plus Rerendering
               };
               console.log("In onLazyLoad after GET children - child _id[" + i + "]: " + treeNodes[i]._id);
              }
          //--------------------------------------------------------------------------------------------------------------------*/
          done(treeNodes); //Draw tree
          this.treeChange++; //Marking tree change
          return null;
        })
        .catch(e => {
          console.log(e);
        });
    }, // /onLazyLoad()

    handleSelectedNode(key) {
    /*---------------------------------------------------------------------------------------------------------------------------//
    handleSelectedNode()
    Event Handler für QTree @update:selected (d.h. bei Änderung des selektierten Nodes im Baum)
    Parameter key ist node-key (=_id) des neu selektierten Nodes
    Funktion, um beim Select eines Nodes im Baum dessen Properties zu speichern in Data

    ACHTUNG: Beim erneuten Klicken auf eine bereits selektierten Knoten passiert Deselektion des Knotens
    Dann wird handleSelectedKey trotzdem aufgerufen, aber mitkey=null - dies führt zu einem Fehler im Log
    Error in v-on handler: "TypeError: Cannot read property '_id' of undefined", der aber sont keine
    weiteren Auswirkungen hat. Außerdem werden dann trotzdem weiter (fälschlich) die Daten des vorher
    selektierten Knotens angezeigt. Abhilfe: Am Anfang eingefügt: if (key===null) { return };

    ACHTUNG: Nicht immer sind diese Properties schon im Baustoffbaum durch Lazy Load (get/baustoffe/kinder/_id) vorgeladen,
    da der Benutzer auch Knoten selektieren kann, die er nicht vorher expandiert hat.
    Nur beim Wurzelknoten kann man darauf vertrauen, dass er durch Mounted vorgeladen ist in treeData.

    ACHTUNG: Auch hier Vorsicht beim Holen der (populierten) Kinder - dabei kommt es darauf an welches Format diese haben!!!
    Mongoose: Objekt mit gewrappetem Array, Quasar: Erwartet evtl. puren Array
    //----------------------------------------------------------------------------------------------------------------------------*/
      console.log("In handleSelectedNode.  key: " + key); // key wird korrekt übergeben!
      if (key===null) { return }; // Siehe oben, Deselektion eines vorher selektierten Knotens im Baum
      // In Kürze könnte man es einfach so machen:
      // this.selectedNode = this.$refs.tree.getNodeByKey(key);
      // Aber ACHTUNG: Dies funktioniert nur für normale Props inkl. Materialeigenschaften, aber nicht für Kinder!!!
      // Diese müssen ggf. erst populiert geholt werden vom Backend!
      console.log(
        "In handleSelectedNode.  kinder: " + this.selectedNode.kinder
      ); // In früheren Versionen Fehler - diese haben evtl. nur Format: _id, falls unpopuliert !!!
      /*--------------------------------------------------------------------------------------------------------------------//
      D.h. diese kinder waren eventuell nicht populiert, je nachdem, ob der
      User einen schon expandierten Knoten (dann fand Lazy Loading statt) oder einen nicht expandierten Knoten
      selektiert, wo vorher gar kein onLazyLoad Call stattgeffunden haben muss!!!
      Abhilfe: Unten Die Kinder populiert holen wie in onLazyLoad und diese zusätzlich in selectedNode.kinder abspeichern!!!
      Damit funktioniert endlich die Anzeige der Tabelle "Abhängige Baustoffe", die vorher Fehler warf!!!
      Zuerst aber alle Props des ausgewählten Nodes (außer kinder) einzeln setzen aus den schon vorher
      gefüllten Werten im q-tree Array treeData, der indirekt über this.$refs.tree.getNodeByKey(key).propertyName
      angesprochen werden kann.
      Das Setzen dieser Felder erlaubt dann die Anzeige der "Baustoffeigenschaften" und der Tabelle "Materialeigenschaften"
      (noch nicht der Tabelle "Abhängige Baustoffe", die die populierten Kinder braucht - siehe unten)
      //---------------------------------------------------------------------------------------------------------------------*/
      this.selectedNode._id = this.$refs.tree.getNodeByKey(key)._id;
      this.selectedNode.kurzBezeichnung = this.$refs.tree.getNodeByKey(key).kurzBezeichnung;
      this.selectedNode.bezeichnung = this.$refs.tree.getNodeByKey(key).bezeichnung;
      this.selectedNode.baumKnotenTyp = this.$refs.tree.getNodeByKey(key).baumKnotenTyp;
      this.selectedNode.verzweigungsTyp = this.$refs.tree.getNodeByKey(key).verzweigungsTyp;
      this.selectedNode.produkt = this.$refs.tree.getNodeByKey(key).produkt;
      this.selectedNode.aktiv = this.$refs.tree.getNodeByKey(key).aktiv;
      this.selectedNode.materialEigenschaften = this.$refs.tree.getNodeByKey(key).materialEigenschaften;
      /*--------------------------------------------------------------------------------------------------------------------//
      Diese Calls warfen zuerst Errors "Cannot read property 'getNodebyKey' of undefined" !!!!!!!!!!!!!!!!!!
      Lösung hier: https://forum.quasar-framework.org/topic/3063/calling-q-tree-component-methods/2
      q-tree ref="tree" oben im Template-Teil für q-tree definieren und in diesen API Calls im Script-Teil darauf referenzieren

      Nun erst mal die Kinder populiert holen (weil evtl. noch kein Lazy Load stattfand,
      und daher die Kinder nicht unbedingt im Node populiert sein müssen!!!
      Dafür ähnlicher Code wie auch in onLazyLoad:
      //---------------------------------------------------------------------------------------------------------------------*/
      let parent_id = key; // Wird unten gebraucht, _id des aktuellen (Parent) Nodes
      console.log("In handleSelectedNode - parent_id: " + parent_id); // Displays _id correctly after code changes in mounted()
      // console.log("In handleSelectedNode - key:       " + key); // Displays key correctly after code changes in mounted()
      // ACHTUNG: parent_id und key sind dasselbe!!!

      // REST Call BaustoffKinder, um die populierten Kinder zu holen:
      http
        .get("/baustoff/kinder/" + parent_id)
        .then(response => {
          console.log("In handleSelectedNode after GET children...");
          console.log(response.data); // Shows the children on test runs, they are an object {"kinder":  [...]}, array embedded, as expected
          // If no children tree return
          if (response.data == null) {
            this.selectedNode.kinder = [];
            return;
          }
          // this.selectedNode.kinder=response.data.kinder; // FEHLER: Cannot read property 'kinder' of undefined - so einfach geht's also NICHT!!!
          // Also wieder Code aus der Vorlage nehmen um kinder einzeln zu pushen:
          let donvis = response.data; // The name of the temporary object donvis is tribute to my friend @maxxiris from Quasar forum!
          let treeNodes = []; // temporärer Array, in dem die neuen Kinder für QTree aufgebaut werden
          /*---------------------------------------------------------------------------------------------------------------------//
          Von https://stackoverflow.com/questions/57331677/how-to-map-json-coming-from-mongoose-to-vue-and-quasar
          Mongoose und damit das REST API liefert immer Objekt {"kinder": [ {}, .. {} } !!!
          Es liefert nicht einen Array [ {}, ... {} ] für die kinder direkt, wie es onLazyLoad im Parameter node zurückerwartet!
          Daher war in OnLazyLoad ein spezielles Push für die Kinder erforderlich, dass einen solchen Array [...] für die
          Child Nodes erzeugt, ohne { "kinder": [...] } drumherum
          Hier, für selectedNode, ist ein nested Objekt aber okay!
          //---------------------------------------------------------------------------------------------------------------------*/
          donvis.kinder.forEach(child => {
            // ACHTUNG: Dies befüllt den Array der Kinder, nicht die normalen Felder von selectedNode!!!
            treeNodes.push({
              _id: child._id, // QTable row-key, unbedingt erforderlich für QTable, obwohl nicht angezeigt!!!
              kurzBezeichnung: child.kurzBezeichnung,
              bezeichnung: child.bezeichnung,
              baumKnotenTyp: child.baumKnotenTyp,
              verzweigungsTyp: child.verzweigungsTyp,
              produkt: child.produkt,
              aktiv: child.aktiv,
              materialEigenschaften: child.materialEigenschaften,
              kinder: child.kinder // Das sind die Kindeskinder, diese sind aktuell NICHT populiert!!!
              // lazy: true, // Nicht für QTable
              // parent_id: parent_id // Nicht für QTable - Variable parent_id wurde oben schon definiert!!!
            });
          });
          this.selectedNode.kinder = treeNodes;
          console.log(
            "At end of handleSelectedNode - selectedNode.kinder: " +
              this.selectedNode.kinder
          );
        }) // /.then
        .catch(e => {
          console.log(e);
        });

      // this.selectedKey = key; // Macht QTree wahrscheinlich automatisch wegen :selected.sync = "selectedKey",
    }, // /handleSelectedNode

    /*----------------------------------------------------------------------------------------------//
    Methods für q-form/q-input für den Baustoff, emittieren Events an q-tree
    Change kann auch programmatisch ausgelöster Change von Werten sein
    Input ist normalerweise durch User Input ausgeöster Change von Werten
    //----------------------------------------------------------------------------------------------*/
    /* eslint-disable no-console */
    handleChange() {
      this.$emit("change", this.selectedNode);
      this.$emit("change", this.treeData[this.selectedKey]);
    },
    handleInput() {
      this.$emit("input", this.selectedNode);
      this.$emit("input", this.treeData[this.selectedKey]);
    },
    /* Hier überflüssig, da Komponente ohne Props:
       setCurrentValue(baustoff) {
         // Propagiert asynchrone Änderungen in den Props nach Data(), Callback Funktion für Watch ganz unten
         this.selectedNode = baustoff;
      },
    */
    submitBaustoff() {
      var data = {
        // Lokale Variable zur Aufbereitung des Objekts, das dem Put Request mitgegeben wird
        _id: this.selectedNode._id, // Kann nicht geändert worden sein, da kein q-input Feld!!!
        kurzBezeichnung: this.selectedNode.kurzBezeichnung,
        bezeichnung: this.selectedNode.bezeichnung,
        baumKnotenTyp: this.selectedNode.baumKnotenTyp,
        verzweigungsTyp: this.selectedNode.verzweigungsTyp,
        aktiv: this.selectedNode.aktiv,
        produkt: this.selectedNode.produkt,
        // kinder: this.selectedNode.kinder,
        // materialEigenschaften: this.selectedNode.materialEigenschaften,
        /*-----------------------------------------------------------------------------------------------------------//
          ACHTUNG: Tricky!!!
          1) Es gibt den Fall, dass ein Baustoff im q-tree selektiert wurde und hier updated wird, obwohl
             noch gar kein Lazy Load der Kinder dafür erfolgt ist, weil er vorher nie expandiert wurde.
             Dann sind seine in kinder null. Diese dürfen dann auf keinen Fall dem put mitgegeben werden. Daher diese
             beim put weggelassen.
          2) Im Backend muss zusätzlich sichergestellt sein, dass die kinder und die materialEigenschaften beim Update
             nicht mit leeren Werten überschrieben werden, wenn sie hier ausgelassen werden - MongoDB/Mongoose
             macht das so - daher im baustoffcontroller.js einstweilen diese beim findByIdAndUpdate entfernt!!!
        //-----------------------------------------------------------------------------------------------------------*/
      };
      console.log("Submit triggered");
      http
        .put("/baustoff/" + data._id, data) // _id originally taken from prop, see above!
        .then(response => {
          // ACHTUNG: data bleibt unverändert bei put-Requests, nur response kommt zurück!!!
          //=========================================================================================================
          // TODO: Änderungen in selectedNode.materialEigenschaften und kinder werden hier noch nicht unterstützt
          // Muss in den Tabellen dafür implementiert werden (Popup auf q-table, etc.)
          //=========================================================================================================
          console.log(response.data);

          // ACHTUNG: Die Daten in treeData müssen nun auch aktualisiert werden, speziell die bezeichnung, die
          // label-key ist für q-tree!!! Sie sind bisher nur in selectedNode aktuell aus dem q-form!!!
          // this.$refs.tree.getNodeByKey(data._id)._id=data._id; // Kann sich nicht geändert haben
          this.$refs.tree.getNodeByKey(data._id).kurzBezeichnung = data.kurzBezeichnung;
          this.$refs.tree.getNodeByKey(data._id).bezeichnung = data.bezeichnung;
          this.$refs.tree.getNodeByKey(data._id).baumKnotenTyp = data.baumKnotenTyp;
          this.$refs.tree.getNodeByKey(data._id).verzweigungsTyp = data.verzweigungsTyp;
          this.$refs.tree.getNodeByKey(data._id).produkt = data.produkt;
          this.$refs.tree.getNodeByKey(data._id).aktiv = data.aktiv;

          /*-----------------------------------------------------------------------------------------------------------//
          // Change Event auslösen, wird von q-tree wegen :nodes="treeData" und :selected.sync="selectedKey" gehändelt
          //-----------------------------------------------------------------------------------------------------------*/
          this.$emit("change", this.treeData[this.selectedKey]);

          // this.$router.push("/"); // TODO: Erst mal auskommentiert, Router-Sachen müssen überarbeitet werden
        })
        .catch(e => {
          console.log(e);
        });
    },

    toggleBaustoffFieldAktiv() {
    /*----------------------------------------------------------------------------------------------//
    Toggle function for field aktiv
    ACHTUNG: Der Code ist veraltet, für aktiv: String, nicht Boolean!!!
            Wird nicht mehr gebraucht, da qToggle es für Boolean von selbst macht
    //----------------------------------------------------------------------------------------------*/
      var data = {
        id: this.selectedNode._id,
        kurzBezeichnung: this.selectedNode.kurzBezeichnung,
        bezeichnung: this.selectedNode.bezeichnung,
        baumKnotenTyp: this.selectedNode.baumKnotenTyp,
        verzweigungsTyp: this.selectedNode.verzweigungsTyp,
        produkt: this.selectedNode.produkt,
        aktiv: this.selectedNode.aktiv // Toggled Attribut aktiv
        // Diese Daten werden anschließend per http Put an den Server geschickt
      };
      if (data.aktiv === "false") {
        data.aktiv = "true";
      } else {
        data.aktiv = "false";
      }
      this.selectedNode.aktiv = data.aktiv; // Nicht vergessen!

      http
        .put("/baustoff/" + this.selectedNode._id, data)
        .then(response => {
          this.selectedNode.aktiv = response.data.aktiv;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },

    cancelBaustoff() {
      //===========================================================================================================
      // TODO: Alle Felder auf Ausgangswerte setzen (neu laden aus Datenbank oder gibt es dafür eine Vue-Funktion?)
      // TODO: Folgende Logik überarbeiten
      //===========================================================================================================
      this.$emit("refresh"); // ????????? Scheint zumindest nicht zu schaden...setzt aber noch nicht die Eingabefelder zurück!!!
      // this.$router.push("/"); // TODO: Erst mal auskommentiert, Router-Sachen müssen überarbeitet werden
    },

    deleteBaustoff() {
      http
        .delete("/baustoff/" + this.selectedNode._id)
        .then(response => {
          console.log(response.data);
          //=========================================================================================================
          // TODO: Baustoff am Bildschirm entfernen
          // TODO: Baustoff aus selectedNode und treeData entfernen
          // TODO: Folgende Logik überarbeiten
          //=========================================================================================================
          this.selectedNode=null; // selectedNode zurücksetzen
          this.treeData[this.selectedKey] = null; // Gelöschten Node in treeData entfernen
          // TODO 1: Löscht nicht die Referenzen im Vaterknoten auf ihn!!!
          //  Diese werden beim nächsten handleSelectedNode bzw. Lazy Load also zu holen versucht, was zu Fehlern führt!!!
          // Man müsste dafür find mit der _id des gelöschten Knotens in den Kindern aller Väter machen, oder neues parent Feld dafür implementieren
          // TODO 2: Löschen aller seiner kinder und Kindeskinder - in der Datenbank ist es schon implementiert
          // Aber ist das hier in treeData überhaupt notwendig, oder kann man die einfach im Array hängen lassen bis Session Ende?
          // Vermutlich ist es bei Delete besser, gleich den ganzen Baum neu aus der Datenbank zu laden und lazy Loads von vorne beginnen zu lassen!!!
          // Dies kann ma ja schon simulieren, indem man den Refresh Knopf im Browser drückt, dann wird der neue Baum nach dem Löschen korrekt angezeigt
          // TODO!!!
          this.selectedKey=null; // selectedKey zurücksetzen
          this.$emit("change", this.selectedNode);
          this.$emit("change", this.selectedKey);
          this.$emit("change", this.treeData);
          // this.$emit("refresh"); // ????????? Scheint zumindest nicht zu schaden...setzt aber noch nicht die Eingabefelder zurück!!!
          // this.$router.push("/"); // TODO: Erst mal auskommentiert, Router-Sachen müssen überarbeitet werden
        })
        .catch(e => {
          console.log(e);
        });
    }
    /* eslint-enable no-console */
  }, // /methods:

  mounted: async function() {
  /*------------------------------------------------------------------------------------------------------------------------------------//
  ACHTUNG: Mounted: wird 2-mal aufgerufen neuerdings, wie man im Log sieht !!! Dann auch 2 Bäume!
  Siehe z.B. https://forum.vuejs.org/t/vuejs-vue-router-vue-component-mounts-multiple-times-sometimes-as-many-as-6-times/25373/3
  Anderswo wird empfohlen, nach multiple new(Vue) zu succhen, aber es gibt nur eines in dem alten main.js, das für
  Quasar wahrscheinlich irrelevant ist!!!
  index.js und vue.app enthalten kein new(Vue)!
  Es könnte daran liegen, dass die QTable neuerdings auch das v-model selectedNode hat! Dieses entfernt, q-tree
  funktioniert auch ohne, aber immer noch das Problem mit dem doppelten mounted
  Auch die diversen q-inputs haben v-models auf selectedNode - vermutlich nicht die Ursache
  https://forum.vuejs.org/t/vue-router-makes-multiple-components/25563 - Router ist die Ursache
  The mounted functions fires every time I navigate back to a component rendered in a view.
  This is normal as when you leave a route, the component is destroyed.

  Die Router-Logik ist aktuell verteilt auf index.js, app.vue und routeS.js (letzeres unverändert vs. Quasar Create)
  HINWEIS: routeR.js und main.js sind gemäß Tests IRRELEVANT für Quasar!
  TODO: Die Router-Logik ist sicher noch nicht okay so!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  //------------------------------------------------------------------------------------------------------------------------------------*/
  /*------------------------------------------------------------------------------------------------------------------------------------//
  Methode mounted:, um den q-tree zu initalisieren
  HINWEIS: In mounted: wird [treeData] (aus data()) direkt mit den Daten des Wurzelknotens aktualisiert
  In Methode onLazyLoad wird [treeData] nur indirekt updated, über den Return-Parameter nodes von done(nodes), welcher die Kinder nach [treeData] pushed.

  ACHTUNG: this.TreeChange++ könnte wichtig sein, um Quasar über die Änderung im Tree zu informieren, ist aber im der API Doku so nicht zu finden
  Wird offensichtlich vom Autor der Vorlage für eigene Zwecke (Watch()) verwendet

  ACHTUNG: mounted() muss nach https://forum.quasar-framework.org/topic/4033/not-solved-by-quasar-but-manual-coding-auto-expand-for-lazy-qtree-node/3
  eine async function sein, wahrscheinlich nur, weil dort ein await verwendet wird für den asynchronen Axios Call

  Hier zuerst neuer Baustoff/Wurzel REST Call, um den obersten Knoten im Baum zu retrieven
  Dafür neuen baumKnotenTyp WURZEL definiert, um diesen zu finden
  //------------------------------------------------------------------------------------------------------------------------------------*/
    http
      .get("/baustoffe/wurzel/")
      .then(response => {
        console.log(response.data);
        // If no data return
        if (response.data == null) {
          return;
        }
        /*------------------------------------------------------------------------------------------------------------------------------------//
         Code aus Vorlage (mit id: Int dort statt _id: String hier)
         this.rootId = parseInt(res.data.rootId) // get RootId, unnötig, weil _id: String
         this.treeData = [{label:res.data.rootName, id: this.rootId, lazy: true }]; // First node assign
         this.treeChange++; // Inform changing in tree

         Diesen Code aus Vorlage angepasst:
         this.treeData = [{ _id: response.data._id, bezeichnung: response.data.bezeichnung, lazy: true }]; // First node assign, noch keine Children

         ACHTUNG: Es kommen Square Brackets in dem response.data Objekt mit: [{key: value, ...}] (das ist die JSON-Repräsentation)
         Es ist also ein Javascript Array ([]) aus einem Element, Zugriff geht so: response.data[0] (= erstes Element im Array)

         ACHTUNG: Dieses response.data Objekt nicht einfach mit String-Funktionen als String behandeln, dann klappt es nicht!
         Siehe https:stackoverflow.com/questions/19699452/how-to-remove-square-bracket-from-json
         =====> Bessere Lösungen sind noch zu evaluieren, z.B.
         =====> Body Parser?
         =====> this.$http.get (Vue Befehl)
         =====> response.json(responseObject) in Express Route?
         =====> Axios einsetzen mit Vue?
         =====> https:stackoverflow.com/questions/38306569/what-does-body-parser-do-with-express
         =====> https:stackoverflow.com/questions/48598156/express-and-vue-with-axios-req-body-is-not-working - Reihenfolge ist wichtig!
         =====> https:stackoverflow.com/questions/40998888/how-to-setup-express-route-res-jsondata-object-and-display-the-response-in-vue
         =====> https:stackoverflow.com/questions/40882134/does-vue-js-work-with-ajax-http-calls/40882183#40882183 - empfiehlt Axios
         =====> https:stackoverflow.com/questions/54603426/axios-get-call-returning-response-data-map-is-not-a-function
                 Emppfiehlt responseData = JSON.parse(response.data);  Erzeugt ein JS Objekt aus der JSON response,
                 Funktioniert nur mit HTTP Header 'Content-type: application/json' (Axios spezifisch?)
                 Dieser kann mit der Get Response zusammen gesetzt werden
                 Müsste wahrscheinlich ohne Axios in baustoff.controller.js passieren
                 Dann kann .map function angewendet werden für Arrays, sieht Code Beispiel
                 Alternative: JSON.stringify
                 Alternative: Object.keys(response.data).forEach(function(key) {
                                   console.log(key, response.data[key]);
                              });
                              Object.values(response.data);
         ======> https:www.freecodecamp.org/forum/t/anybody-experienced-with-axios-convert-response-to-array/147639/8
                  Ähnliches Problem, gelöst mit JSON.parse und Axios, content-type "application/json"
         ======> https:stackoverflow.com/questions/52114182/map-nested-objects-in-react-that-are-parsed-with-axios -
                  Iteriert durch Arrays in der JSON mittels Axios und einer forEach-Schleife
        //------------------------------------------------------------------------------------------------------------------------------------*/

        let responseData = response.data[0]; // [0} ist unbedingt notwendig, da vom API ein Array-Objekt zurückkommt!!!

        /*------------------------------------------------------------------------------------------------------------------------------------//
        ACHTUNG: Auch im folgenden Statement muss ein Array an treeData assigned werden!!!
        Diese Varianten funktionieren alle NICHT:
        let treeDataWithoutBrackets = responseData.toString().substring(1, responseData.length - 1); -- klappt nicht!!!
        this.treeData = responseData; // JSON Parsing müsste jetzt _id und bezeichnung mappen - läuft scheinbar, aber in Wirklichkeit kein Array in treeData
        this.treeData = treeDataWithoutBrackets; // JSON Parsing müsste jetzt _id und bezeichnung mappen -- klappt nicht!!!
        //------------------------------------------------------------------------------------------------------------------------------------*/
        this.treeData = [
          {
            _id: responseData._id, // WICHTIG - Key für q-tree!!!
            kurzBezeichnung: responseData.kurzBezeichnung,
            bezeichnung: responseData.bezeichnung,
            baumKnotenTyp: responseData.baumKnotenTyp,
            verzweigungsTyp: responseData.verzweigungsTyp,
            produkt: responseData.produkt,
            aktiv: responseData.aktiv,
            materialEigenschaften: responseData.materialEigenschaften,
            kinder: responseData.kinder, // ACHTUNG: Enthält Objekt, Format "kinder": { [ {}, ...{} ] } von Mongooose, nicht reinen Array!!! Ist aber populiert, daher OK!
            lazy: true // Zusätzliches Attribut aus Vorlage, für später, vermutlich identisch it q-tree API Prop lazy, über die Lazy Loading in q-tree gesteuert wird
          }
        ];
        // HINWEIS: parent_id muss laut Vorlage beim Root Node nicht gesetzt werden

        this.treeChange++; // Inform changing in tree
        console.log(
          "After mounted: _id of root node: " +
            this.treeData[0]._id +
            " bezeichnung: " +
            this.treeData[0].bezeichnung +
            " kinder: " +
            this.treeData[0].kinder
        );
        // Works OK - console shows correct values for _id and bezeichnung from treeData
        // And the root node shows up correctly in QTree and displays correctly bezeichnung as label!
      })
      .catch(e => {
        console.log(e);
      });
  } // /mounted()

  /*------------------------------------------------------------------------------------------------------------------------------------//
  Watch Property Option - dies feuert einen Event, wenn sich etwas in den Properties ändert
  Die Callback-Funktion SetCurrentValue propagiert dann die Änderugen nach Data (baustoffData)
  Watch Tutorial: https://www.tutorialspoint.com/vuejs/vuejs_watch_property
  Hier überflüssig, da die Komponente nicht auf Props arbeitet, sondern auf selectedNode
  /*------------------------------------------------------------------------------------------------------------------------------------//
  /* watch: {
    value(val) {
      if (!val) return;
      this.setCurrentValue(val);
    }
  } // /watch:
  */
}; // /export default:
</script>

<style>
.list {
  text-align: left;
  max-width: 450px;
  margin: auto;
}
</style>