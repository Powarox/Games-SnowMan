import { createStore } from "vuex"

export const store = createStore({
    state() {
        return {
            filter: "all",
            todos :[
                { id: 1, name: "tache 1", completed: false},
                { id: 2, name: "tache 2", completed: false},
                { id: 3, name: "tache 3", completed: true}
            ]
        }
    },

    getters: {
        getallTodos(state) {
            return state.todos
        },
    },

    actions: {
        addTask({commit}, message) {
            commit('ADDTASK', message);
        },

        delTask({commit}, task) {
            commit('DELTASK', task);
        },

        checkTask({commit}, task) {
            commit('CHECKTASK', task);
        }
    },

    mutations: {
        ADDTASK(state, val) {
            if(val !== undefined && val.replace(/\s+/g, '') !== ""){
                state.todos.push({
                    id: state.todos.lenght,
                    name: val,
                    completed: false
                })
            }
        },

        DELTASK(state, key) {
            state.todos.splice(key, 1);
        },

        CHECKTASK(state, key) {
            console.log(key);
            // if(state.todos[key].completed){
            //     state.todos[key].completed = false;
            // } else {
            //     state.todos[key].completed = true;
            // }
        }
    }
});
