const { Connection, query } = require('stardog');

const conn = new Connection({
    username: 'admin',
    password: 'admin',
    endpoint: 'http://localhost:5820',
});

query.execute(conn, 'ab', 'select ?o where { :ab a ?o }', 'application/sparql-results+json', {
    limit: 10,
    offset: 0,
    reasoning: true
}).then(({ body }) => {
    console.log(body.results.bindings);
});


var input = d.map(d => {return {"id": d.c.value, "concept": d.p.value}});
var data = d3.nest()
    .key(d => { return d.id })
    .rollup(v => { return v.map(d => { return d.concept })})
    .map(input);
