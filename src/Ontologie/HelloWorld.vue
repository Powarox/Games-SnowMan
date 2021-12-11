<template>
    <h3 @click="grilletest"> new game </h3>
    <div class='game'>
        <div class='grille' v-for="liste of grille" :key="liste">
            <div class='cell' v-for="cell of liste" :key="cell">
                {{cell[3]}}
            </div>
        </div>

        <button v-on:click="testForce()">testForce</button>

        <button v-on:click="gestion_deplacement('Haut')" >Déplacement Haut</button>
        <button v-on:click="gestion_deplacement('Bas')">Déplacement Bas</button>
        <button v-on:click="gestion_deplacement('Gauche')">Déplacement Gauche</button>
        <button v-on:click="gestion_deplacement('Droite')">Déplacement Droite</button>
        <button v-on:click="new_game()"> Nouvelle Partie</button>

<!-- background-image: url(index.png); -->

    </div>


</template>
<script>
const { Connection, query } = require('stardog');

const conn = new Connection({
  username: 'admin',
  password: 'admin',
  endpoint: 'http://localhost:5820',
});

export default {
  name: 'Grille',
  // perso:[],petit:[],moyen:[],grand:[],
  data(){
     return {
       grille:[],
        East:false,
        West:false,
        North:false,
        South:false,

        hasEastPetiteBoule:false,
        hasWestPetiteBoule:false,
        hasNorthPetiteBoule:false,
        hasSouthPetiteBoule:false,

        hasEastMoyenneBoule:false,
        hasWestMoyenneBoule:false,
        hasNorthMoyenneBoule:false,
        hasSouthMoyenneBoule:false,

        hasEastGrandeBoule:false,
        hasWestGrandeBoule:false,
        hasNorthGrandeBoule:false,
        hasSouthGrandeBoule:false,

        assemblage_petitemoyenne_North:false,
        assemblage_petitemoyenne_South:false,
        assemblage_petitemoyenne_East:false,
        assemblage_petitemoyenne_West:false,

        assemblage_petitegrande_North:false,
        assemblage_petitegrande_South:false,
        assemblage_petitegrande_East:false,
        assemblage_petitegrande_West:false,

        assemblage_moyennegrande_North:false,
        assemblage_moyennegrande_South:false,
        assemblage_moyennegrande_East:false,
        assemblage_moyennegrande_West:false,

        assmblage_MoyenneGrande_North:false,
        assmblage_MoyenneGrande_South:false,
        assmblage_MoyenneGrande_East:false,
        assmblage_MoyenneGrande_West:false,

        assemblage_grandemoyenne:false,
        assemblage_grandepetite:false,
        assemblage_moyennepetite:false,
        assmblage_PetiteMoyenne:false,
        assmblage_PetiteGrande:false,

        elem: 1
      }
  },
  methods:{
      testForce(){
          let all_rows = document.querySelectorAll('.grille');
          console.log(all_rows);

              for(let i = 0; i < 10; i++){
                  let all_elem = all_rows[i].querySelectorAll('.cell');

                  for(let j = 0; j < 10; j++){
                      console.log(all_elem[j]);
                      // all_elem[j].classList.remove(all_elem[j].classList[1]);

                      if(i === 0){
                          if(j === 3){
                              all_elem[j].classList.add('PlayerCell');
                          }
                          if(j === 0 || j === 5|| j === 9){
                              all_elem[j].classList.add('Ball1');
                          }
                      }
                  }
              }
      },


     query_cellule(cellule){
        query.execute(conn, 'test', 'SELECT ?x ?y WHERE { ?'+cellule+' rdf:type :'+cellule+' . ?'+cellule+' :x ?x. ?'+cellule+' :y ?y  }', 'application/sparql-results+json', {
          limit: 10,
          reasoning: true,
          offset: 0,
        }).then(({ body }) => {
          let x1 = JSON.stringify(body.results.bindings[0].x.value).replace(/"([^"]+(?="))"/g, '$1');
          let y1 = JSON.stringify(body.results.bindings[0].y.value).replace(/"([^"]+(?="))"/g, '$1');
          this.test(cellule,x1,y1)
          // return x1,y1
        });
      },
      test_dir(direction){
         query.execute(conn, 'test', 'ASK WHERE { ?boule rdf:type :Boulle'+direction+' . }', 'application/sparql-results+json', {
           limit: 10,
           reasoning: true,
           offset: 0,
         }).then(({ body }) => {
          if(direction == "East"){
            this.East = body.boolean
          }
          if(direction == "West"){
            this.West = body.boolean
          }
          if(direction == "North"){
            this.North = body.boolean
          }
          if(direction == "South"){
            this.South = body.boolean
          }
         });
         return 0
       },
       test_boule(boule,direction){
         query.execute(conn, 'test', 'ASK WHERE { ?player rdf:type :Cellule_joueur . ?boule rdf:type :'+boule+' . ?boule :'+direction+' ?player . }', 'application/sparql-results+json', {
           limit: 10,
           reasoning: true,
           offset: 0,
         }).then(({ body }) => {

          if(boule == "petiteBoule" && direction == "hasEast"){
            this.hasEastPetiteBoule = body.boolean
          }
          if(boule == "petiteBoule" && direction == "hasWest"){
            this.hasWestPetiteBoule = body.boolean
          }
          if(boule == "petiteBoule" && direction == "hasNorth"){
            this.hasNorthPetiteBoule = body.boolean
          }
          if(boule == "petiteBoule" && direction == "hasSouth"){
            this.hasSouthPetiteBoule = body.boolean
          }

          if(boule == "moyenneBoule" && direction == "hasEast"){
            this.hasEastMoyenneBoule = body.boolean
          }
          if(boule == "moyenneBoule" && direction == "hasWest"){
            this.hasWestMoyenneBoule = body.boolean
          }
          if(boule == "moyenneBoule" && direction == "hasNorth"){
            this.hasNorthMoyenneBoule = body.boolean
          }
          if(boule == "moyenneBoule" && direction == "hasSouth"){
            this.hasSouthMoyenneBoule = body.boolean
          }

          if(boule == "grandeBoule" && direction == "hasEast"){
            this.hasEastGrandeBoule = body.boolean
          }
          if(boule == "grandeBoule" && direction == "hasWest"){
            this.hasWestGrandeBoule = body.boolean
          }
          if(boule == "grandeBoule" && direction == "hasNorth"){
            this.hasNorthGrandeBoule = body.boolean
          }
          if(boule == "grandeBoule" && direction == "hasSouth"){
            this.hasSouthGrandeBoule = body.boolean
          }

         });
         return 0
       },


       test_assemblage(boule1,boule2,direction){
         query.execute(conn, 'test', 'ASK WHERE { ?boule1 rdf:type :'+boule1+'. ?boule2 rdf:type :'+boule2+' . ?boule2 '+direction+' ?boule1 . }', 'application/sparql-results+json', {
           limit: 10,
           reasoning: true,
           offset: 0,
         }).then(({ body }) => {

           //LUI
           if(boule1 == "moyenneBoule" && boule2 == "petiteBoule" && direction ==":hasNorth"){
             this.assemblage_petitemoyenne_North = body.boolean
           }else if (boule1 == "moyenneBoule" && boule2 == "petiteBoule" && direction ==":hasSouth") {
             this.assemblage_petitemoyenne_South = body.boolean
           }else if (boule1 == "moyenneBoule" && boule2 == "petiteBoule" && direction ==":hasWest") {
             this.assemblage_petitemoyenne_West = body.boolean
           }else if (boule1 == "moyenneBoule" && boule2 == "petiteBoule" && direction ==":hasEast") {
             this.assemblage_petitemoyenne_East = body.boolean
           }
           //LUI
           if(boule1 == "grandeBoule" && boule2 == "petiteBoule" && direction ==":hasNorth"){
             this.assemblage_petitegrande_North = body.boolean
           }else if (boule1 == "grandeBoule" && boule2 == "petiteBoule" && direction ==":hasSouth") {
             this.assemblage_petitegrande_South = body.boolean
           }else if (boule1 == "grandeBoule" && boule2 == "petiteBoule" && direction ==":hasWest") {
             this.assemblage_petitegrande_West = body.boolean
           }else if (boule1 == "grandeBoule" && boule2 == "petiteBoule" && direction ==":hasEast") {
             this.assemblage_petitegrande_East = body.boolean
           }
           //LUI
           if(boule1 == "grandeBoule" && boule2 == "moyenneBoule" && direction ==":hasNorth"){
             this.assemblage_moyennegrande_North = body.boolean
           }else if (boule1 == "grandeBoule" && boule2 == "moyenneBoule" && direction ==":hasSouth") {
             this.assemblage_moyennegrande_South = body.boolean
           }else if (boule1 == "grandeBoule" && boule2 == "moyenneBoule" && direction ==":hasWest") {
             this.assemblage_moyennegrande_West = body.boolean
           }else if (boule1 == "grandeBoule" && boule2 == "moyenneBoule" && direction ==":hasEast") {
             this.assemblage_moyennegrande_East = body.boolean
           }
           //LUI
           if(boule1 == "MoyenneGrande" && boule2 == "petiteBoule" && direction ==":hasNorth"){
             this.assmblage_MoyenneGrande_North = body.boolean
           }else if (boule1 == "MoyenneGrande" && boule2 == "petiteBoule" && direction ==":hasSouth") {
             this.assmblage_MoyenneGrande_South = body.boolean
           }else if (boule1 == "MoyenneGrande" && boule2 == "petiteBoule" && direction ==":hasWest") {
             this.assmblage_MoyenneGrande_West = body.boolean
           }else if (boule1 == "MoyenneGrande" && boule2 == "petiteBoule" && direction ==":hasEast") {
             this.assmblage_MoyenneGrande_East = body.boolean
           }
           //:hasWest|:hasEast|:hasNorth|:hasSouth
           if(boule1 == "moyenneBoule" && boule2 == "grandeBoule" && direction == ":hasWest|:hasEast|:hasNorth|:hasSouth"){
             this.assemblage_grandemoyenne = body.boolean
           }
           if(boule1 == "petiteBoule" && boule2 == "grandeBoule"  && direction == ":hasWest|:hasEast|:hasNorth|:hasSouth"){
             this.assemblage_grandepetite = body.boolean
           }
           if(boule1 == "petiteBoule" && boule2 == "moyenneBoule"  && direction == ":hasWest|:hasEast|:hasNorth|:hasSouth"){
             this.assemblage_moyennepetite = body.boolean
           }
           if(boule1 == "PetiteMoyenne" && boule2 == "grandeBoule"  && direction == ":hasWest|:hasEast|:hasNorth|:hasSouth"){
             this.assmblage_PetiteMoyenne = body.boolean
           }
           if(boule1 == "PetiteGrande" && boule2 == "moyenneBoule"  && direction == ":hasWest|:hasEast|:hasNorth|:hasSouth"){
             this.assmblage_PetiteGrande = body.boolean
           }
         });
         return 0
       },

       gestion_deplacement(direction){

         if(direction == 'Droite'){
           if(this.East == true && this.hasWestPetiteBoule){
             if(this.assemblage_petitemoyenne_East==false && this.assemblage_petitegrande_East==false && this.assmblage_MoyenneGrande_East==false){
               console.log("mais merde alors")
               this.deplacement_boules("petiteBoule","IsEast","hasWest")
             }else if(this.assemblage_petitemoyenne_East==true){
               console.log("moyenneBoule")
               this.deplacement_aaaaaa("petiteBoule","moyenneBoule","PetiteMoyenne","hasWest","IsEast")
             }else if (this.assemblage_petitegrande_East==true) {
               console.log("PetiteGrande")
               this.deplacement_aaaaaa("petiteBoule","grandeBoule","PetiteGrande","hasWest","IsEast")
             }else if (this.assmblage_MoyenneGrande_East==true) {
               console.log("fin du game")
               this.deplacement_aaaaaa("petiteBoule","MoyenneGrande","fin","hasWest","IsEast")
             }
           }else if(this.East == true && this.hasWestGrandeBoule) {
             if(this.assemblage_grandemoyenne == true || this.assemblage_grandepetite || this.assmblage_PetiteMoyenne || this.assmblage_PetiteGrande){
                 console.log("pas possible1")
             }else{
                this.deplacement_boules("grandeBoule","IsEast","hasWest")
             }
           }else if(this.East == true && this.hasWestMoyenneBoule) {
             if(this.assemblage_moyennegrande_East == true){
                 this.deplacement_aaaaaa("moyenneBoule","grandeBoule","MoyenneGrande","hasWest","IsEast")
             }else if(this.assemblage_moyennepetite == true){
                  console.log("pas possible2")
             }else{
                 this.deplacement_boules("moyenneBoule","IsEast","hasWest")
             }
           }else {
              this.deplacement('IsEast')
           }
         }

         if(direction == 'Gauche'){
           if(this.West == true && this.hasEastPetiteBoule){
             if(this.assemblage_petitemoyenne_West==false && this.assemblage_petitegrande_West==false && this.assmblage_MoyenneGrande_West==false ){
               console.log("mais merde alors")
               this.deplacement_boules("petiteBoule","IsWeast","hasEast")
             }else if(this.assemblage_petitemoyenne_West==true){
               console.log("moyenneBoule")
               this.deplacement_aaaaaa("petiteBoule","moyenneBoule","PetiteMoyenne","hasEast","IsWeast")
             }else if (this.assemblage_petitegrande_West==true) {
               console.log("PetiteGrande")
               this.deplacement_aaaaaa("petiteBoule","grandeBoule","PetiteGrande","hasEast","IsWeast")
             }else if (this.assmblage_MoyenneGrande_West==true) {
               console.log("fin du game")
               this.deplacement_aaaaaa("petiteBoule","MoyenneGrande","fin","hasEast","IsWeast")
             }
           }else if(this.West == true && this.hasEastGrandeBoule) {
             if(this.assemblage_grandemoyenne == true || this.assemblage_grandepetite || this.assmblage_PetiteMoyenne || this.assmblage_PetiteGrande){
                 console.log("pas possible")
             }else{
                this.deplacement_boules("grandeBoule","IsWeast","hasEast")
             }
           }else if(this.West == true && this.hasEastMoyenneBoule) {
             if(this.assemblage_moyennegrande_West == true){
                 this. deplacement_aaaaaa("moyenneBoule","grandeBoule","MoyenneGrande","hasEast","IsWeast")
             }else if(this.assemblage_moyennepetite == true){
                  console.log("pas possible")
             }else{
                 this.deplacement_boules("moyenneBoule","IsWeast","hasEast")
             }
           }else{
             console.log("aaaaaaas")
             this.deplacement('IsWeast')
           }
         }

         if(direction == 'Haut'){
           if(this.North == true && this.hasSouthPetiteBoule){
             if(this.assemblage_petitemoyenne_North==false && this.assemblage_petitegrande_North==false && this.assmblage_MoyenneGrande_North==false){
               console.log("mais merde alors")
               this.deplacement_boules("petiteBoule","IsNorth","hasSouth")
             }else if(this.assemblage_petitemoyenne_North==true){
               console.log("moyenneBoule")
               this.deplacement_aaaaaa("petiteBoule","moyenneBoule","PetiteMoyenne","hasSouth","IsNorth")
             }else if (this.assemblage_petitegrande_North==true) {
               console.log("PetiteGrande")
               this.deplacement_aaaaaa("petiteBoule","grandeBoule","PetiteGrande","hasSouth","IsNorth")
             }else if (this.assmblage_MoyenneGrande_North==true) {
               console.log("fin du game")
               this.deplacement_aaaaaa("petiteBoule","MoyenneGrande","fin","hasSouth","IsNorth")
             }
           }else if(this.North == true && this.hasSouthGrandeBoule) {
             if(this.assemblage_grandemoyenne == true || this.assemblage_grandepetite || this.assmblage_PetiteMoyenne || this.assmblage_PetiteGrande){
                 console.log("pas possible")
             }else{
               console.log("alors la")
                this.deplacement_boules("grandeBoule","IsNorth","hasSouth")
             }
           }else if(this.North == true && this.hasSouthMoyenneBoule) {
             if(this.assemblage_moyennegrande_North == true){
                 console.log("éééé")
                 this. deplacement_aaaaaa("moyenneBoule","grandeBoule","MoyenneGrande","hasSouth","IsNorth")
             }else if(this.assemblage_moyennepetite == true){
                  console.log("pas possible")
             }else{
                this.deplacement_boules("moyenneBoule","IsNorth","hasSouth")
             }
           }else {
             console.log("dzazd")
             this.deplacement('IsNorth')
           }
         }

         if(direction == 'Bas'){
            if(this.South == true && this.hasNorthPetiteBoule){
              // console.log("bas")
              if(this.assemblage_petitemoyenne_South==false && this.assemblage_petitegrande_South==false && this.assmblage_MoyenneGrande_South==false ){
                console.log("mais merde alors")
                this.deplacement_boules("petiteBoule","IsSouth","hasNorth")
              }else if(this.assemblage_petitemoyenne_South==true){
                console.log("moyenneBoule")
                this.deplacement_aaaaaa("petiteBoule","moyenneBoule","PetiteMoyenne","hasNorth","IsSouth")
              }else if (this.assemblage_petitegrande_South==true) {
                console.log("PetiteGrande")
                this.deplacement_aaaaaa("petiteBoule","grandeBoule","PetiteGrande","hasNorth","IsSouth")
              }else if (this.assmblage_MoyenneGrande_South==true) {
                console.log("fin du game")
                this.deplacement_aaaaaa("petiteBoule","MoyenneGrande","fin","hasSouth","IsNorth")
              }
            }else if(this.South == true && this.hasNorthGrandeBoule) {
              if(this.assemblage_grandemoyenne == true || this.assemblage_grandepetite || this.assmblage_PetiteMoyenne || this.assmblage_PetiteGrande){
                  console.log("pas possible")
              }else{
                 this.deplacement_boules("grandeBoule","IsSouth","hasNorth")
              }
            }else if(this.South == true && this.hasNorthMoyenneBoule) {
              if(this.assemblage_moyennegrande_South == true){
                  this. deplacement_aaaaaa("moyenneBoule","grandeBoule","MoyenneGrande","hasNorth","IsSouth")
              }else if(this.assemblage_moyennepetite == true){
                   console.log("pas possible")
              }else{
                  this.deplacement_boules("moyenneBoule","IsSouth","hasNorth")
              }
            }else {
               this.deplacement('IsSouth')
            }
         }
       },

      deplacement(direction){
          query.execute(conn, 'test', 'DELETE { ?c rdf:type :Cellule_joueur}  INSERT {  ?a rdf:type :Cellule_joueur }  WHERE{  ?c rdf:type :Cellule_joueur .  ?a rdf:type :'+direction+' }', 'application/sparql-results+json', {
            limit: 10,
            offset: 0,
            reasoning: true,
          }).then(({ body }) => {
            body;

          for(let i=0;i<10;i++){
              for(let j=0;j<10;j++){
              if(this.grille[i][j][3] == "Cellule_joueur"){
                 this.grille[i][j][3] = " "
              }
            }
          }
            this.query_cellule('Cellule_joueur');

            this.test_dir('North');
            this.test_dir('South');
            this.test_dir('West');
            this.test_dir('East');

            this.test_boule("petiteBoule","hasEast")
            this.test_boule("petiteBoule","hasWest");
            this.test_boule("petiteBoule","hasNorth");
            this.test_boule("petiteBoule","hasSouth");

            this.test_boule("moyenneBoule","hasEast");
            this.test_boule("moyenneBoule","hasWest");
            this.test_boule("moyenneBoule","hasNorth");
            this.test_boule("moyenneBoule","hasSouth");

            this.test_boule("grandeBoule","hasEast");
            this.test_boule("grandeBoule","hasWest");
            this.test_boule("grandeBoule","hasNorth");
            this.test_boule("grandeBoule","hasSouth");

          });
        },

         deplacement_boules(boule,directionJoueur,localisationBoule){
            query.execute(conn, 'test', 'DELETE { ?z rdf:type :'+boule+' . ?c rdf:type :Cellule_joueur } INSERT { ?e rdf:type :'+boule+' . ?a rdf:type :Cellule_joueur }WHERE { ?z rdf:type :'+boule+' .  ?e rdf:type :NotBoulle . ?e :'+localisationBoule+' ?z . ?c rdf:type :Cellule_joueur . ?a rdf:type :'+directionJoueur+' }', 'application/sparql-results+json', {
              limit: 10,
              offset: 0,
              reasoning: true,
            }).then(({ body }) => {
              body;

              for(let i=0;i<10;i++){
                for(let j=0;j<10;j++){

                if(this.grille[i][j][3] == "Cellule_joueur"){
                   this.grille[i][j][3] = " "
                }
              }
            }
              for(let i=0;i<10;i++){
                for(let j=0;j<10;j++){
                if(this.grille[i][j][3] == "petiteBoule"){
                   this.grille[i][j][3] = " "
                }
              }
            }
            for(let i=0;i<10;i++){
              for(let j=0;j<10;j++){
              if(this.grille[i][j][3] == "grandeBoule"){
                 this.grille[i][j][3] = " "
              }
            }
          }
            for(let i=0;i<10;i++){
              for(let j=0;j<10;j++){
              if(this.grille[i][j][3] == "moyenneBoule"){
                 this.grille[i][j][3] = " "
              }
            }
          }

         this.test_assemblage("moyenneBoule","petiteBoule",":hasNorth");
         this.test_assemblage("moyenneBoule","petiteBoule",":hasSouth");
         this.test_assemblage("moyenneBoule","petiteBoule",":hasWest");
         this.test_assemblage("moyenneBoule","petiteBoule",":hasEast");

         this.test_assemblage("grandeBoule","petiteBoule",":hasNorth");
         this.test_assemblage("grandeBoule","petiteBoule",":hasSouth");
         this.test_assemblage("grandeBoule","petiteBoule",":hasWest");
         this.test_assemblage("grandeBoule","petiteBoule",":hasEast");

         this.test_assemblage("grandeBoule","moyenneBoule",":hasNorth");
         this.test_assemblage("grandeBoule","moyenneBoule",":hasSouth");
         this.test_assemblage("grandeBoule","moyenneBoule",":hasWest");
         this.test_assemblage("grandeBoule","moyenneBoule",":hasEast");

         this.test_assemblage("MoyenneGrande","petiteBoule",":hasNorth");
         this.test_assemblage("MoyenneGrande","petiteBoule",":hasSouth");
         this.test_assemblage("MoyenneGrande","petiteBoule",":hasWest");
         this.test_assemblage("MoyenneGrande","petiteBoule",":hasEast");

         this.test_assemblage("moyenneBoule","grandeBoule",":hasWest|:hasEast|:hasNorth|:hasSouth");
         this.test_assemblage("petiteBoule","grandeBoule",":hasWest|:hasEast|:hasNorth|:hasSouth");
         this.test_assemblage("petiteBoule","moyenneBoule",":hasWest|:hasEast|:hasNorth|:hasSouth");
         this.test_assemblage("PetiteMoyenne","grandeBoule",":hasWest|:hasEast|:hasNorth|:hasSouth");
         this.test_assemblage("PetiteGrande","moyenneBoule",":hasWest|:hasEast|:hasNorth|:hasSouth");

         this.query_cellule('grandeBoule');
         this.query_cellule('moyenneBoule');
         this.query_cellule('petiteBoule');
         this.query_cellule('Cellule_joueur');

            });
          },

          deplacement_aaaaaa(boule1,boule2,boule_assemblage,hasDirection,IsDirection){
             query.execute(conn, 'test', '  DELETE { ?z rdf:type :'+boule1+' . ?p rdf:type :'+boule2+' . ?c rdf:type :Cellule_joueur } INSERT {   ?e rdf:type :'+boule_assemblage+' . ?a rdf:type :Cellule_joueur  } WHERE { ?z rdf:type :'+boule1+' . ?p rdf:type :'+boule2+' . ?e rdf:type :NotBoulle . ?e :'+hasDirection+' ?z . ?c rdf:type :Cellule_joueur . ?a rdf:type :'+IsDirection+' }', 'application/sparql-results+json', {
               limit: 10,
               offset: 0,
               reasoning: true,
             }).then(({ body }) => {
               body;

             for(let i=0;i<10;i++){
                 for(let j=0;j<10;j++){

                 if(this.grille[i][j][3] == "Cellule_joueur"){
                    this.grille[i][j][3] = " "
                 }
               }
             }

             if(boule1=="petiteBoule" && boule2=="grandeBoule"){
               for(let i=0;i<10;i++){
                   for(let j=0;j<10;j++){
                   if(this.grille[i][j][3] == "petiteBoule"){
                        this.grille[i][j][3] = " "
                   }
                 }
               }
                 for(let i=0;i<10;i++){
                   for(let j=0;j<10;j++){
                   if(this.grille[i][j][3] == "grandeBoule"){
                      this.grille[i][j][3] = " "
                   }
                 }
               }
               this.query_cellule('PetiteGrande');
             }

             if(boule1=="petiteBoule" && boule2=="moyenneBoule"){
                for(let i=0;i<10;i++){
                     for(let j=0;j<10;j++){
                     if(this.grille[i][j][3] == "petiteBoule"){
                          this.grille[i][j][3] = " "
                     }
                   }
                 }
                 for(let i=0;i<10;i++){
                     for(let j=0;j<10;j++){
                     if(this.grille[i][j][3] == "moyenneBoule"){
                        this.grille[i][j][3] = " "
                     }
                   }
                 }
                 this.query_cellule('PetiteMoyenne');
             }

             if(boule1=="moyenneBoule" && boule2=="grandeBoule"){
               for(let i=0;i<10;i++){
                   for(let j=0;j<10;j++){
                   if(this.grille[i][j][3] == "grandeBoule"){
                      this.grille[i][j][3] = " "
                   }
                 }
               }
               for(let i=0;i<10;i++){
                   for(let j=0;j<10;j++){
                   if(this.grille[i][j][3] == "moyenneBoule"){
                      this.grille[i][j][3] = " "
                   }
                 }
               }
                 this.query_cellule('MoyenneGrande');
             }

             if(boule1=="petiteBoule" && boule2=="MoyenneGrande"){
               for(let i=0;i<10;i++){
                   for(let j=0;j<10;j++){
                   if(this.grille[i][j][3] == "petiteBoule"){
                      this.grille[i][j][3] = " "
                   }
                 }
               }
               for(let i=0;i<10;i++){
                   for(let j=0;j<10;j++){
                   if(this.grille[i][j][3] == "MoyenneGrande"){
                      this.grille[i][j][3] = " "
                   }
                 }
               }
                 this.query_cellule('fin');
             }

             this.query_cellule('Cellule_joueur');
           });
       },



      grilletest(){
          this.grille=[];
          for(let i=0;i<10;i++){
              let listCel=[];
              for(let j=0;j<10;j++){
                  listCel.push([ i+""+j]);
              }
              this.grille.push(listCel);
          }

          this.query_cellule('Cellule_joueur');
          this.query_cellule('petiteBoule');
          this.query_cellule('moyenneBoule');
          this.query_cellule('grandeBoule');
          //CA C'EST UN SOUCIS Bug DANS LE CONSOLE
          this.query_cellule('PetiteMoyenne');
          this.query_cellule('PetiteGrande');
          this.query_cellule('MoyenneGrande');
          this.query_cellule('fin');

        },

        test(cellule,x,y){
          this.grille[x][y][3]=cellule;

          // console.log(document.getElementById("test").innerHTML)
          // if(document.getElementById("test").innerHTML=="Cellule_joueur"){
          //   console.log("aaaaa")
          // }
          // if(cellule == "Cellule_joueur"){
          //   this.grille[x][y][3]=cellule;
          //   // console.log(document.styleSheets[0].cssRules[0].style[0]);
          //    // console.log(document.styleSheets[0].cssRules[2].style[3])
          //    document.styleSheets[0].cssRules[3].style.color = "red";
          //   // console.log(michel)
          //   // this.grille[x][y][3] = cellule;
          // }
          // if(cellule == "petiteBoule"){
          //   this.grille[x][y][3]=cellule;
          //   // console.log(document.styleSheets[0].cssRules[0].style[0]);
          //    // console.log(document.styleSheets[0].cssRules[2].style[3])
          //    document.styleSheets[0].cssRules[3].style.color = "red";
          //   // console.log(michel)
          //   // this.grille[x][y][3] = cellule;
          // }
          // if(cellule == "moyenneBoule"){
          //   this.grille[x][y][3]=cellule;
          //   // console.log(document.styleSheets[0].cssRules[0].style[0]);
          //    // console.log(document.styleSheets[0].cssRules[2].style[3])
          //    document.styleSheets[0].cssRules[3].style.color = "red";
          //   // console.log(michel)
          //   // this.grille[x][y][3] = cellule;
          // }
          // if(cellule == "grandeBoule"){
          //   this.grille[x][y][3]=cellule;
          //   // console.log(document.styleSheets[0].cssRules[0].style[0]);
          //    // console.log(document.styleSheets[0].cssRules[2].style[3])
          //    document.styleSheets[0].cssRules[3].style.color = "red";
          //   // console.log(michel)
          //   // this.grille[x][y][3] = cellule;
          // }
          // if(cellule == "PetiteMoyenne" || cellule == "PetiteGrande" || cellule == "MoyenneGrande" || cellule == "fin"){
          //   this.grille[x][y][3]=cellule;
          //   // console.log(document.styleSheets[0].cssRules[0].style[0]);
          //    // console.log(document.styleSheets[0].cssRules[2].style[3])
          //    document.styleSheets[0].cssRules[3].style.color = "red";
          //   // console.log(michel)
          //   // this.grille[x][y][3] = cellule;
          // }

        },

/////////////////////////////////////////////////////
      //RESET GAME
      suppr_boules(boule){
        query.execute(conn, 'test', 'DELETE { ?c rdf:type :'+boule+' } WHERE { ?c rdf:type :'+boule+' }', 'application/sparql-results+json', {
          limit: 10,
          reasoning: true,
          offset: 0,
        }).then(({ body }) => {
           body
        });
      },

      reset_boules(instance,cellule){
        query.execute(conn, 'test', 'INSERT DATA { :'+cellule+' rdf:type :'+instance+' . }  ', 'application/sparql-results+json', {
          limit: 10,
          reasoning: true,
          offset: 0,
        }).then(({ body }) => {
           body
        });
      },

      appel_suppr(){
        for(let i=0;i<10;i++){
            for(let j=0;j<10;j++){
            if(this.grille[i][j][3] == "Cellule_joueur"){
               this.suppr_boules("Cellule_joueur")
               this.suppr_boules("petiteBoule")
               this.suppr_boules("moyenneBoule")
               this.suppr_boules("grandeBoule")
             }
           }
         }
         for(let i=0;i<10;i++){
             for(let j=0;j<10;j++){
               if(this.grille[i][j][3] == "fin"){
                  this.suppr_boules("fin")
                }else if (this.grille[i][j][3] == "PetiteMoyenne") {
                  this.suppr_boules("PetiteMoyenne")
                }else if (this.grille[i][j][3] == "PetiteGrande") {
                  this.suppr_boules("PetiteGrande")
                }else if (this.grille[i][j][3] == "MoyenneGrande") {
                  this.suppr_boules("MoyenneGrande")
              }
            }
          }
      },

      new_position(){
        for(let i=0;i<10;i++){
            for(let j=0;j<10;j++){
              if(this.grille[i][j][3] !== "Cellule_joueur") {
                this.reset_boules("grandeBoule","cell_17")
                this.reset_boules("moyenneBoule","cell_64")
                this.reset_boules("petiteBoule","cell_57")
                this.reset_boules("Cellule_joueur","cell_00")
              }
          }
        }
      },

      new_game(){
          this.appel_suppr();
          this.new_position();
          this.grilletest();
          window.location.reload(true)
          // Location.reload();
      },
  }
}
</script>

<style scoped>


/* .image {
  Background-image: url(index.png) ;
} */

.grille{
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    grid-column-gap: 5px;
}

.cell{
    background-color: green;
    height: 80px;
    margin-top: 5px;
    color : white;

    width: 100%;
    height: 60px;
    background: #6BB34D;
    border-radius: 5px;
    margin: 5px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
}

.color{
  color: white ;
}

.none {
    background-image: url('../assets/nothing.png');
}

.PlayerCell {
    background-image: url('../assets/player.png');
}

.Ball1 {
    background-image: url('../assets/top.png');
}

.Ball2 {
    background-image: url('../assets/center.png');
}

.Ball3 {
    background-image: url('../assets/bottom.png');
}

/* .grandeBoule{
    background-color: blue;
    height: 50px;
    margin-top: 5px;
    color: blue;
} */

</style>
