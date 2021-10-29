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
            <button v-on:click="moove_player('up')">
                <i class="fas fa-arrow-up"></i>  Haut  <i class="fas fa-arrow-up"></i>
            </button>
        </div>

        <div id="center_btn">
            <button v-on:click="moove_player('left')">
                <i class="fas fa-arrow-left"></i>  Gauche  <i class="fas fa-arrow-left"></i>
            </button>

            <button @keyup.left="moove_player('left')" @keyup.up="moove_player('up')"
                @keyup.down="moove_player('down')" @keyup.right="moove_player('right')">Clavier
            </button>

            <button v-on:click="moove_player('right')">
                <i class="fas fa-arrow-right"></i>  Droite  <i class="fas fa-arrow-right"></i>
            </button>
        </div>

        <div id="down_btn">
            <button v-on:click="moove_player('down')">
                <i class="fas fa-arrow-down"></i>  Bas  <i class="fas fa-arrow-down"></i>
            </button>
        </div>
    </div>

    <br><br>

    <button @click="test_moove()">test</button>

    <!-- <button @click="create_grid()">Create Grid</button> -->

    <button @click="build_grid()">Build Grid</button>

    <button @click="build_grid()">Start Game</button>

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
        methods: {
            ...mapActions([
                'createGrid', 'updateGrid'
            ]),

            moove_player(side) {
                console.log(side);
            },

            test_moove() {
                console.log(this.grid);
            },

            build_grid(){
              this.stardog_query('PlayerCell');
              this.stardog_query('Ball1');
              this.stardog_query('Ball2');
              this.stardog_query('Ball3');
              this.forceRerender();
            },

            stardog_query(find){
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
                  this.updateGrid([find, body.results.bindings[0].X.value, body.results.bindings[0].Y.value]);
              });
            },

            forceRerender(){
                let all_rows = document.querySelectorAll('.rows');

                for(let i = 0; i < this.getGrid.length; i++){
                    let all_elem = all_rows[i].querySelectorAll('.elem');
                    for(let j = 0; j < this.getGrid.length; j++){
                        all_elem[j].classList.add(this.getGrid[i][j].State)
                    }
                }

                this.elem += 1;
            }
        },
        computed: {
            ...mapGetters([
                'getGrid'
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
        },
        data() {
            return {
                elem: 0,
                grid: []
            }
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
        transition: 1s;
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

    .fail3 {
        background-image: url('../assets/fail3.png');
    }

</style>
