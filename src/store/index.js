import { createStore } from "vuex"

export const store = createStore({
    state() {
        return {
            filter: "all",
            grid :[]
        }
    },

    getters: {
        getGrid(state) {
            return state.grid
        },
    },

    actions: {
        createGrid({commit}) {
            commit('CREATEGRID');
        },

        updateGrid({commit}, list) {
            commit('UPDATEGRID', list);
        },
    },

    mutations: {
        CREATEGRID(state) {
            let rows = 10;

            for(let i = 0; i < rows; i++){
                state.grid.push([]);
                state.grid[i].push([rows])
                for(let j = 0; j < rows; j++){
                    state.grid[i][j] = {
                        'Cell' : 'cell_' + i + j,
                        'State' : 'none'
                    };
                }
            }
        },

        UPDATEGRID(state, list){
            console.log(list);
            state.grid[list[1]][list[2]].State = list[0];
        }
    }
});
