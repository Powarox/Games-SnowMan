<template>
    <h1>SnowMan Game</h1>

    <section class="grid">
        <div class="rows" v-for="elem in this.getGrid" v-bind:key="elem" >
            <div class="elem" :class="{ completed: grid.state }" v-for="e in elem" v-bind:key="e.id">

            </div>
        </div>
    </section>

    <div class="moove">
        <div id="top_btn">
            <button v-on:click="moove_player('isNorth', 'hasNorth')">
                <i class="fas fa-arrow-up"></i>  Haut  <i class="fas fa-arrow-up"></i>
            </button>
        </div>

        <div id="center_btn">
            <button v-on:click="moove_player('isWest', 'hasWest')">
                <i class="fas fa-arrow-left"></i>  Gauche  <i class="fas fa-arrow-left"></i>
            </button>

            <button @keyup.up="moove_player('isNorth', 'hasNorth')" @keyup.left="moove_player('isWest', 'hasWest')"
                @keyup.right="moove_player('isEast', 'hasEast')" @keyup.down="moove_player('isSouth', 'hasSouth')">Clavier
            </button>

            <button v-on:click="moove_player('isEast', 'hasEast')">
                <i class="fas fa-arrow-right"></i>  Droite  <i class="fas fa-arrow-right"></i>
            </button>
        </div>

        <div id="down_btn">
            <button v-on:click="moove_player('isSouth', 'hasSouth')">
                <i class="fas fa-arrow-down"></i>  Bas  <i class="fas fa-arrow-down"></i>
            </button>
        </div>
    </div>

    <br><br>

    <button @click="test_moove()">test</button>
    <button @click="build_grid()">Start Game</button>

    <!-- <button @click="create_grid()">Create Grid</button> -->
    <!-- <button @click="build_grid()">Build Grid</button> -->
    <!-- <button @click="updateCss()">Update Game</button> -->

</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    const { Connection, query } = require('stardog');
    const conn = new Connection({
        username: 'admin',
        password: 'admin',
        endpoint: 'http://localhost:5820',
    });

    export default {
        name: "Grille",
        beforeMount(){
            this.createGrid();
        },

        data() {
            return {
                elem: 1,
                grid: [],

                hasBall1: false,
                hasBall2: false,
                hasBall3: false,

                has_Ball1_On_Ball2: false,  // Fail 1
                has_Ball1_On_Ball3: false,  // Fail 2
                has_Ball2_On_Ball3: false,  // Step 1

                succes: false               // Succes
            }
        },

        methods: {
            ...mapActions([
                'createGrid', 'updateGrid', 'delPlayer', 'delBall1', 'delBall2', 'delBall3'
            ]),

            test_moove() {
                console.log(this.grid);
                let test = "grid:Cell_12";
                console.log(test.split('_'));
            },

            moove_player(side, direction) {
                let query_search = `
                    SELECT ?Cell ?X ?Y
                    WHERE {
                        ?Cell a grid:`+side+` .
                        ?Cell grid:X ?X .
                        ?Cell grid:Y ?Y .
                    }
                `;

                query.execute(conn, 'ontologie_db', query_search, 'application/sparql-results+json', {
                    limit: 10,
                    offset: 0,
                    reasoning: true
                }).then(({ body }) => {
                    if(body.results.bindings[0]) {
                        let cell_player = body.results.bindings[0].Cell.value.split('#')[1];
                        let player_XY = {'X': parseInt(body.results.bindings[0].X.value), 'Y': parseInt(body.results.bindings[0].Y.value)}
                        this.is_Some_Ball(player_XY, cell_player, direction, side);

                        console.log(cell_player);

                        // console.log(body.results.bindings[0].X.value);
                        // console.log(body.results.bindings[0].Y.value);
                        // console.log(body.results.bindings[0]);
                    }
                    else {
                        console.log('Action Impossible Wall' );
                    }
                });
            },

            is_Some_Ball(player_XY, cell_player, direction, side){
                let query_search = `
                    SELECT ?Ball1 ?Ball2 ?Ball3 ?X1 ?Y1 ?X2 ?Y2 ?X3 ?Y3
                    WHERE {
                        ?Ball1 a grid:Ball1 .
                        ?Ball2 a grid:Ball2 .
                        ?Ball3 a grid:Ball3 .
                        ?Ball1 grid:X ?X1 .
                        ?Ball1 grid:Y ?Y1 .
                        ?Ball2 grid:X ?X2 .
                        ?Ball2 grid:Y ?Y2 .
                        ?Ball3 grid:X ?X3 .
                        ?Ball3 grid:Y ?Y3 .
                    }
                `;

                query.execute(conn, 'ontologie_db', query_search, 'application/sparql-results+json', {
                    limit: 10,
                    offset: 0,
                    reasoning: true
                }).then(({ body }) => {
                    let cell_ball1 = body.results.bindings[0].Ball1.value.split('#')[1];
                    let cell_ball2 = body.results.bindings[0].Ball2.value.split('#')[1];
                    let cell_ball3 = body.results.bindings[0].Ball3.value.split('#')[1];

                    let ball1_XY = {'X': parseInt(body.results.bindings[0].X1.value), 'Y': parseInt(body.results.bindings[0].Y1.value)}
                    let ball2_XY = {'X': parseInt(body.results.bindings[0].X2.value), 'Y': parseInt(body.results.bindings[0].Y2.value)}
                    let ball3_XY = {'X': parseInt(body.results.bindings[0].X3.value), 'Y': parseInt(body.results.bindings[0].Y3.value)}

                    switch (cell_player) {
                        case cell_ball1:
                            console.log('Need to moove the ball1');
                            this.is_Some_Second_Ball('Ball1', 'Ball2', ball1_XY, ball2_XY, player_XY, direction, side);
                            // this.is_Some_Second_Ball('Ball1', 'Ball3', ball1_XY, ball3_XY, player_XY, direction, side);
                            break;

                        case cell_ball2:
                            console.log('Need to moove the ball2');
                            this.is_Some_Second_Ball('Ball2', 'Ball1', ball2_XY, ball1_XY, player_XY, direction, side);
                            // this.is_Some_Second_Ball('Ball2', 'Ball3', ball2_XY, ball3_XY, player_XY, direction, side);
                            break;

                        case cell_ball3:
                            console.log('Need to moove the ball3');
                            this.is_Some_Second_Ball('Ball3', 'Ball1', ball3_XY, ball1_XY, player_XY, direction, side);
                            // this.is_Some_Second_Ball('Ball3', 'Ball2', ball3_XY, ball2_XY, player_XY, direction, side);
                            break;

                        default:    // Pas de Ball, Player moove
                            this.delPlayer();
                            this.updateGrid(["PlayerCell", player_XY['X'], player_XY['Y']]);
                            this.update_Player(side);
                            this.forceRerender();
                    }
                });
            },

            is_Some_Second_Ball(ball, cible, ball_XY, cible_XY, player_XY, direction, side){
                let query_search = `
                    ASK WHERE {
                        ?Cible a grid:`+cible+` .
                        ?Ball rdf:type grid:`+ball+` .
                        ?Ball grid:`+direction+` ?Cible .
                    }
                `;

                query.execute(conn, 'ontologie_db', query_search, 'application/sparql-results+json', {
                    limit: 10,
                    offset: 0,
                    reasoning: true
                }).then(({ body }) => {
                    if(body.boolean){
                        console.log('Empilement : ' + ball + ' --> ' + cible);
                    }
                    else {
                        this.is_Some_Wall(ball, 'Wall', ball_XY, cible_XY, player_XY, direction, side);
                    }

                });
            },

            is_Some_Wall(ball, cible, ball_XY, cible_XY, player_XY, direction, side){
                let query_search = `
                    ASK WHERE {
                        ?Cible a grid:`+cible+` .
                        ?Ball rdf:type grid:`+ball+` .
                        ?Ball grid:`+direction+` ?Cible .
                    }
                `;

                query.execute(conn, 'ontologie_db', query_search, 'application/sparql-results+json', {
                    limit: 10,
                    offset: 0,
                    reasoning: true
                }).then(({ body }) => {
                    if(!body.boolean){
                        console.log('Pas de boule moove ' + side);

                        this.delPlayer();

                        if(ball === 'Ball1'){
                            this.delBall1();
                        }
                        if(ball === 'Ball2'){
                            this.delBall2();
                        }
                        if(ball === 'Ball3'){
                            this.delBall3();
                        }

                        this.updateGrid(["PlayerCell", player_XY['X'], player_XY['Y']]);

                        switch (direction) {
                            case "hasNorth":
                                this.updateGrid([ball, ball_XY['X'] - 1, ball_XY['Y']]);
                                break;
                            case "hasSouth":
                                this.updateGrid([ball, ball_XY['X'] + 1, ball_XY['Y']]);
                                break;
                            case "hasEast":
                                this.updateGrid([ball, ball_XY['X'], ball_XY['Y'] + 1]);
                                break;
                            case "hasWest":
                                this.updateGrid([ball, ball_XY['X'], ball_XY['Y'] - 1]);
                                break;
                            default:
                        }

                        this.update_Player(side);
                        this.update_Ball(ball, side);

                        this.forceRerender();
                    }
                    else {
                        console.log('Wall after ' + ball);
                    }
                });
            },

            update_Player(side){
                let query_search = `
                    DELETE {
                        ?c rdf:type grid:PlayerCell .
                    }
                    INSERT {
                        ?dir rdf:type grid:PlayerCell .
                    }
                    WHERE {
                        ?c rdf:type grid:PlayerCell .
                        ?dir rdf:type grid:`+side+` .
                    }
                `;

                query.execute(conn, 'ontologie_db', query_search, 'application/sparql-results+json', {
                    limit: 10,
                    offset: 0,
                    reasoning: true
                }).then(({ body }) => {
                    return body;
                });
            },

            update_Ball(ball, side){
                let query_search = `
                    DELETE {
                        ?c rdf:type grid:`+ball+` .
                    }
                    INSERT {
                        ?dir rdf:type grid:`+ball+` .
                    }
                    WHERE {
                        ?c rdf:type grid:`+ball+` .
                        ?dir rdf:type grid:`+side+` .
                    }
                `;

                query.execute(conn, 'ontologie_db', query_search, 'application/sparql-results+json', {
                    limit: 10,
                    offset: 0,
                    reasoning: true
                }).then(({ body }) => {
                    return body;
                });
            },

            build_grid() {
                this.stardog_build_query('PlayerCell');
                this.stardog_build_query('Ball1');
                this.stardog_build_query('Ball2');
                this.stardog_build_query('Ball3');
                setTimeout(() => { this.forceRerender(); }, 500);
            },

            stardog_build_query(find) {
                let query_search = `
                    SELECT ?Find ?X ?Y
                    WHERE{
                        ?Find a grid:`+find+` .
                        ?Find grid:X ?X .
                        ?Find grid:Y ?Y .
                    }
                `;

                query.execute(conn, 'ontologie_db', query_search, 'application/sparql-results+json', {
                    limit: 10,
                    offset: 0,
                    reasoning: true
                }).then(({ body }) => {
                    this.updateGrid([find, parseInt(body.results.bindings[0].X.value), parseInt(body.results.bindings[0].Y.value)]);
                });
            },

            forceRerender() {
                let all_rows = document.querySelectorAll('.rows');

                for(let i = 0; i < this.getGrid.length; i++){
                    let all_elem = all_rows[i].querySelectorAll('.elem');
                    for(let j = 0; j < this.getGrid.length; j++){
                        all_elem[j].classList.remove(all_elem[j].classList[1]);
                        all_elem[j].classList.add(this.getGrid[i][j].State);
                    }
                }
                this.elem += 1;
            }
        },

        computed: {
            ...mapGetters([
                'getGrid', 'getPlayer', 'getBall1', 'getBall2', 'getBall3'
            ]),

            // filterTodos(){
            //     if(this.filter === "todo"){
            //         return this.getallTodos.filter((todo) => !todo.completed);
            //     } else if(this.filter === "done"){
            //         return this.getallTodos.filter((todo) => todo.completed);
            //     }
            //     return this.getallTodos;
            // }

            // remplir_grid() {
            //     let rows_div = document.querySelector('.rows');
            //     let all_elem = rows_div.querySelectorAll('.elem');
            //
            //     for(let i = 0; i < rows_div.length; i++){
            //         for(let j = 0; j < all_elem.length; j++){
            //             all_elem[i].classList.add(this.grid[i].state);
            //         }
            //     }
            //
            //     return this.grid;
            // }
        }
    }
</script>

<style lang="css" scoped>
    .grid {
        display: grid;
        grid-template-columns: repeat(10, 1fr);
    }

    .rows {
      margin: 5px;
    }

    .elem {
        width: 100%;
        height: 60px;
        background: #6BB34D;
        border-radius: 5px;
        margin: 5px;
        background-image: url('../assets/nothing.png');
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        /* transition: 1s; */
    }

    .elem:hover {
        background: #BF4040;
    }

    .moove div button {
        width: 100px;
        padding: 5px;
        margin: 2px;
        background: #333;
        color: #DDD;
        border: 2px solid #333;
        border-radius: 2px;
        font-weight: bold;
        cursor: pointer;
    }

    button {
        width: 100px;
        padding: 5px;
        margin: 2px;
        background: #333;
        color: #DDD;
        border: 2px solid #333;
        border-radius: 2px;
        font-weight: bold;
        cursor: pointer;
    }

    /* .moove #top_btn {
        display: flex;
        justify-content: center;
    }

    .moove #bot_btn {
        display: flex;
        justify-content: center;
    } */

    .Ball1 {
        background-image: url('../assets/top.png');
    }

    .Ball2 {
        background-image: url('../assets/center.png');
    }

    .Ball3 {
        background-image: url('../assets/bottom.png');
    }

    .PlayerCell {
        background-image: url('../assets/player.png');
    }

    .succes {
        background-image: url('../assets/all.png');
    }

    .fail1 {
        background-image: url('../assets/fail1.png');
    }

    .fail2 {
        background-image: url('../assets/fail2.png');
    }

    .step1 {
        background-image: url('../assets/step1.png');
    }

</style>
