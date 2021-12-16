import { createStore } from "vuex"

export const store = createStore({
    state() {
        return {
            grid :[],
            PlayerCell: 'none',
            Ball1: [],
            Ball2: [],
            Ball3: []
        }
    },

    getters: {
        getGrid(state) {
            return state.grid;
        },

        getPlayer(state) {
            return state.PlayerCell;
        },

        getBall1(state) {
            return state.Ball1;
        },

        getBall2(state) {
            return state.Ball2;
        },

        getBall3(state) {
            return state.Ball3;
        }
    },

    actions: {
        createGrid({commit}) {
            commit('CREATEGRID');
        },

        updateGrid({commit}, list) {
            commit('UPDATEGRID', list);
        },

        delPlayer({commit}){
            commit('DELPLAYER');
        },

        delBall1({commit}){
            commit('DELBALL1');
        },

        delBall2({commit}){
            commit('DELBALL2');
        },

        delBall3({commit}){
            commit('DELBALL3');
        }
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

        UPDATEGRID(state, list) {
            state.grid[list[2]][list[1]].State = list[0];
            switch (list[0]) {
                case 'PlayerCell': state.PlayerCell = {
                    'X' : list[1],
                    'Y' : list[2]
                }
                    break;
                case 'Ball1': state.Ball1 = {
                    'X' : list[1],
                    'Y' : list[2]
                }
                    break;
                case 'Ball2': state.Ball2 = {
                    'X' : list[1],
                    'Y' : list[2]
                }
                    break;
                case 'Ball3': state.Ball3 = {
                    'X' : list[1],
                    'Y' : list[2]
                }
                    break;
                default:
            }
        },

        DELPLAYER(state) {
            state.grid[state.PlayerCell.Y][state.PlayerCell.X].State = 'none';
        },

        DELBALL1(state) {
            state.grid[state.Ball1.Y][state.Ball1.X].State = 'none';
        },

        DELBALL2(state) {
            state.grid[state.Ball2.Y][state.Ball2.X].State = 'none';
        },

        DELBALL3(state) {
            state.grid[state.Ball3.Y][state.Ball3.X].State = 'none';
        }
    }
});
