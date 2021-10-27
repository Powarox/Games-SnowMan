<template>
    <h1>SnowMan Game</h1>

    <div class="grid">
        <div class="elem" v-for="elem in grid" v-bind:key="elem.id">
        </div>
    </div>

    <div class="moove">
        <div id="top_btn">
            <button v-on:click="moove_player('up')">
                <i class="fas fa-arrow-up"></i>  Haut  <i class="fas fa-arrow-up"></i>
            </button>
        </div>
        <div id="bot_btn">
            <button v-on:click="moove_player('left')">
                <i class="fas fa-arrow-left"></i>  Gauche  <i class="fas fa-arrow-left"></i>
            </button>
            <button v-on:click="moove_player('down')">
                <i class="fas fa-arrow-down"></i>  Bas  <i class="fas fa-arrow-down"></i>
            </button>
            <button v-on:click="moove_player('right')">
                <i class="fas fa-arrow-right"></i>  Droite  <i class="fas fa-arrow-right"></i>
            </button>
        </div>
    </div>

    <button @keyup.left="moove_player('left')" @keyup.up="moove_player('up')" @keyup.down="moove_player('down')" @keyup.right="moove_player('right')">clavier</button>

    <button @click="test_moove()">test</button>

    <button @click="stardog()">Stardog</button>
</template>

<script>
    export default {
        name: "Grille",
        methods: {
            moove_player(side) {
                console.log(side);
            },

            test_moove() {
                this.grid[0].state = 'player';
                this.grid[3].state = 'none';
                console.log(this.grid);
                this.build_grid;
            },

            stardog(){
              const { Connection, query } = require('stardog');

              const conn = new Connection({
                  username: 'admin',
                  password: 'admin',
                  endpoint: 'http://localhost:5820',
              });

              let request = 'SELECT ?Cell WHERE {?Cell rdf:type grid:PlayerCell.}';

              query.execute(conn, 'stardog', request, 'application/sparql-results+json', {
                  limit: 10,
                  offset: 0,
                  reasoning: true
              }).then(({ body }) => {
                  // console.log(body.results.bindings);
                  console.log(body.results.bindings[0].Cell.value);
              });
            }
        },
        computed: {
            build_grid() {
                let grid_div = document.querySelector('.grid');
                let all_elem = grid_div.querySelectorAll('.elem');

                for(let i = 0; i < all_elem.length; i++){
                    all_elem[i].classList.add(this.grid[i].state);
                }
                return this.grid;
            }
        },
        data() {
            return {
                test: "ici",
                grid: [{
                        id: 0,
                        state: 'none'
                    },
                    {
                        id: 1,
                        state: 'top'
                    },
                    {
                        id: 2,
                        state: 'none'
                    },
                    {
                        id: 3,
                        state: 'player'
                    },
                    {
                        id: 4,
                        state: 'center'
                    },
                    {
                        id: 5,
                        state: 'none'
                    },
                    {
                        id: 6,
                        state: 'none'
                    },
                    {
                        id: 7,
                        state: 'bottom'
                    },
                    {
                        id: 8,
                        state: 'none'
                    }
                ]
            }
        }
    }
</script>

<style lang="css" scoped>
    .grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        /* margin: 0 300px; */
    }

    .elem {
        width: 200px;
        height: 200px;
        background: #777;
        border-radius: 5px;
        margin: 5px;
        background-image: url('../assets/nothing.png');
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
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

    /* .moove #top_btn {
        display: flex;
        justify-content: center;
    }

    .moove #bot_btn {
        display: flex;
        justify-content: center;
    } */

    .top {
        background-image: url('../assets/top.png');
    }

    .center {
        background-image: url('../assets/center.png');
    }

    .bottom {
        background-image: url('../assets/bottom.png');
    }

    .player {
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

    .fail3 {
        background-image: url('../assets/fail3.png');
    }

</style>
