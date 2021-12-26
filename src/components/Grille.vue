<template>
    <h1>SnowMan Game</h1>

    <section class="grid">
        <div class="rows" v-for="elem in this.getGrid" v-bind:key="elem" >
            <div class="elem" :class="{ completed: grid.state }" v-for="e in elem" v-bind:key="e.id">

            </div>
        </div>
    </section>

    <div class="win_display hidden">
        <h2>Bravo vous avez gagné !</h2>
        <div>
            <i class="fas fa-trophy"></i>
            <button @click="reset_game(); win_display()">Reset Game</button>
            <button @click="win_display()">Close</button>
            <i class="fas fa-trophy"></i>
        </div>
    </div>

    <section class="moove">
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
    </section>

    <!-- <br><br> -->

    <button @click="reset_game()">Reset Game</button>
    <button @click="prepare_grid()">Start Game</button>
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

                fail_1: false,
                fail_2: false,
                step_1: false,
                succes: false,
            }
        },

        methods: {
            ...mapActions([
                'createGrid', 'updateGrid', 'delPlayer', 'delBall1', 'delBall2', 'delBall3'
            ]),

            prepare_grid() {
                this.build_grid('PlayerCell');
                this.build_grid('Ball1');
                this.build_grid('Ball2');
                this.build_grid('Ball3');
                setTimeout(() => { this.forceRerender(); }, 500);
            },

            build_grid(find) {
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

            reset_game() {
                let query_search = `
                    DELETE {
                        ?Ball1 rdf:type grid:Ball1 .
                        ?Ball2 rdf:type grid:Ball2 .
                        ?Ball3 rdf:type grid:Ball3 .
                    }
                    INSERT {
                        ?dir1 rdf:type grid:Ball1 .
                        ?dir2 rdf:type grid:Ball2 .
                        ?dir3 rdf:type grid:Ball3 .
                    }
                    WHERE {
                        ?Ball1 rdf:type grid:Ball1 .
                        ?Ball2 rdf:type grid:Ball2 .
                        ?Ball3 rdf:type grid:Ball3 .

                        ?dir1 rdf:type grid:isEast .
                        ?dir2 rdf:type grid:isNorth .
                        ?dir3 rdf:type grid:isSouth .
                    }
                `;
                query.execute(conn, 'ontologie_db', query_search, 'application/sparql-results+json', {
                    limit: 10,
                    offset: 0,
                    reasoning: true
                }).then(({ body }) => {
                    this.fail_1 = false;
                    this.fail_2 = false;
                    this.step_1 = false;
                    this.succes = false;

                    this.delBall1();
                    this.delBall2();
                    this.delBall3();
                    this.prepare_grid()
                    return body;
                });

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
                            if(this.fail_1 === true || this.fail_2 === true || this.succes === true){
                                break;
                            }
                            this.is_Some_Second_Ball('Ball1', 'Ball2', 'Ball3', ball1_XY, player_XY, direction, side);
                            break;

                        case cell_ball2:
                            if(this.fail_1 === true || this.step_1 === true || this.succes === true){
                                break;
                            }
                            this.is_Some_Second_Ball('Ball2', 'Ball1', 'Ball3', ball2_XY, player_XY, direction, side);
                            break;

                        case cell_ball3:
                            if(this.fail_2 === true || this.step_1 === true || this.succes === true){
                                break;
                            }
                            this.is_Some_Second_Ball('Ball3', 'Ball1', 'Ball2', ball3_XY, player_XY, direction, side);
                            break;

                        default:
                            this.delPlayer();
                            this.updateGrid(["PlayerCell", player_XY['X'], player_XY['Y']]);
                            this.update_Player(side);
                            this.forceRerender();
                    }
                });
            },

            is_Some_Second_Ball(ball, cible1, cible2, ball_XY, player_XY, direction, side){
                let query_search = `
                    ASK WHERE {
                        ?BallA a grid:`+cible1+` .
                        ?BallB a grid:`+cible2+` .
                        ?NotWall a grid:NotWall .

                        ?Ball rdf:type grid:`+ball+` .
                        ?Ball grid:`+direction+` ?c .

                        FILTER (?c = ?NotWall && (?c = ?BallA || ?c = ?BallB))
                    }
                `;
                query.execute(conn, 'ontologie_db', query_search, 'application/sparql-results+json', {
                    limit: 10,
                    offset: 0,
                    reasoning: true
                }).then(({ body }) => {
                    if(body.boolean){
                        switch (ball) {
                            case 'Ball1':
                                this.is_Empilement(ball, cible1, cible2, ball_XY, player_XY, direction, side);
                                break;

                            case 'Ball2':
                                this.is_Empilement(ball, cible1, cible2, ball_XY, player_XY, direction, side);
                                break;

                            default:
                                console.log('Empilement impossible !');
                        }
                    }
                    else {
                        this.is_Wall_Behind(ball, ball_XY, player_XY, direction, side);
                    }

                });
            },

            is_Wall_Behind(ball, ball_XY, player_XY, direction, side){
                let query_search = `
                    ASK WHERE {
                        ?NotWall a grid:NotWall .
                        ?Ball rdf:type grid:`+ball+` .
                        ?Ball grid:`+direction+` ?NotWall .
                    }
                `;
                query.execute(conn, 'ontologie_db', query_search, 'application/sparql-results+json', {
                    limit: 10,
                    offset: 0,
                    reasoning: true
                }).then(({ body }) => {
                    if(body.boolean){
                        this.moove_Player_And_Ball(ball, ball, ball_XY, player_XY, direction, side);
                    }
                });
            },

            is_Empilement(ball, cible1, cible2, ball_XY, player_XY, direction, side){
                let query_search = `
                    ASK WHERE {
                        ?cible a grid:`+cible1+` .
                        ?NotWall a grid:NotWall .

                        ?Ball rdf:type grid:`+ball+` .
                        ?Ball grid:`+direction+` ?c .

                        FILTER (?c = ?NotWall && ?c = ?cible)
                    }
                `;
                query.execute(conn, 'ontologie_db', query_search, 'application/sparql-results+json', {
                    limit: 10,
                    offset: 0,
                    reasoning: true
                }).then(({ body }) => {
                    if(body.boolean){
                        if(ball === 'Ball1'){
                            if(this.step_1 === true){
                                this.succes = true;
                                this.moove_Player_And_Ball(ball, 'succes', ball_XY, player_XY, direction, side);
                                setTimeout(() => {this.win_display(); }, 100);
                            }
                            else {
                                this.fail_1 = true;
                                this.moove_Player_And_Ball(ball, 'fail1', ball_XY, player_XY, direction, side);
                            }
                        }
                        else {
                            console.log('Empilement Impossible !');
                        }
                    }
                    else {
                        if(ball === 'Ball1'){
                            this.fail_2 = true;
                            this.moove_Player_And_Ball(ball, 'fail2', ball_XY, player_XY, direction, side);
                        }
                        else {
                            this.step_1 = true;
                            this.moove_Player_And_Ball(ball, 'step1', ball_XY, player_XY, direction, side);
                        }
                    }
                });
            },

            moove_Player_And_Ball(ball, stage, ball_XY, player_XY, direction, side){
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
                        this.updateGrid([stage, ball_XY['X'] - 1, ball_XY['Y']]);
                        break;

                    case "hasSouth":
                        this.updateGrid([stage, ball_XY['X'] + 1, ball_XY['Y']]);
                        break;

                    case "hasEast":
                        this.updateGrid([stage, ball_XY['X'], ball_XY['Y'] + 1]);
                        break;

                    case "hasWest":
                        this.updateGrid([stage, ball_XY['X'], ball_XY['Y'] - 1]);
                        break;

                    default:
                }

                this.update_Player(side);
                setTimeout(() => {this.update_Ball(ball, side); }, 500);

                this.forceRerender();
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
            },

            win_display(){
                let win_div = document.querySelector('.win_display');
                win_div.classList.toggle('hidden');
            }
        },

        computed: {
            ...mapGetters([
                'getGrid', 'getPlayer', 'getBall1', 'getBall2', 'getBall3'
            ]),
        }
    }
</script>

<style lang="css" scoped>
    h1 {
        margin: 0;
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(10, 1fr);
    }

    .rows {
      margin: 5px;
    }

    .elem {
        width: 100%;
        height: 70px;
        max-width: 85px;
        background: #6BB34D;
        border-radius: 5px;
        margin: 5px;
        background-image: url('../assets/nothing.png');
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
    }

    .elem:hover {
        background: #BF4040;
    }

    .hidden {
        display: none;
    }

    .win_display {
        width: 30%;
        height: 150px;
        padding: 10px;
        position: fixed;
        top: 35%;
        right: 35%;
        background: #999;
        border-radius: 20px;
        box-shadow: 0 0 10em #BF4040;
    }

    .win_display div {
        display: flex;
        justify-content: space-around;
    }

    .win_display i {
        font-size: 40px;
    }

    button {
        width: 130px;
        padding: 6px;
        margin: 2px;
        background: #333;
        color: #DDD;
        border: 2px solid #333;
        border-radius: 5px;
        font-weight: bold;
        font-size: 17px;
        transition: 0.6s;
        cursor: pointer;
    }

    button:hover {
        color: #333;
        background: #6BB34D;
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

    .PlayerCell {
        background-image: url('../assets/player.png');
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

    .succes {
        background-image: url('../assets/all.png');
    }

    @media (max-width: 1150px){
        .win_screen {
            width: 35%;
            right: 32.5%;
        }
    }

    @media (max-width: 1000px){
        .win_screen {
            width: 40%;
            right: 30%;
        }
    }

    @media (max-width: 950px){
        .win_screen {
            width: 45%;
            right: 27.5%;
        }
    }

    @media (max-width: 730px){
        .win_screen {
            width: 50%;
            right: 25%;
        }
    }

    @media (min-width: 1000px){
        .grid {
            margin: 0 5%;
        }
    }

    @media (min-width: 1200px){
        .grid {
            margin: 0 10%;
        }
    }

    @media (min-width: 1400px){
        .grid {
            margin: 0 15%;
        }
    }

    @media (min-width: 1600px){
        .grid {
            margin: 0 20%;
        }
    }

    @media (min-width: 1800px){
        .grid {
            margin: 0 25%;
        }
    }

</style>
