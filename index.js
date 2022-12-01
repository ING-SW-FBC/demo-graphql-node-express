const { query } = require("express");
var express = require("express");
const { graphqlHTTP } = require('express-graphql'); 
var { buildSchema } = require("graphql");

var schema = buildSchema(`
    type Cliente{
        id:Int
        nombre:String
        telefono:String
    }
    type Query{
        clientes:[Cliente]
        cliente(id:Int):Cliente
    }
    type Mutation{
        addCliente(nombre:String,telefono:String):Cliente
    }
`);
var clientes = [];
var contador = 1;

var root = {
    clientes: () => { return clientes },
    cliente: (data) => {
        for (let index = 0; index < clientes.length; index++) {
            if (clientes[index].id == data.id) {
                return clientes[index];
            }
        }
        return null;
    },
    addCliente:(data)=>{
        var nuevoCliente={id:contador,nombre:data.nombre,telefono:data.telefono};
        console.log("cliente es "+nuevoCliente);
        clientes.push(nuevoCliente);
        contador++;
        return nuevoCliente;
    }
}

var app=express();
app.use("/graphql",graphqlHTTP({
    schema:schema,
    rootValue:root,
    graphql:true
}))
app.listen(4000);
console.log("Corriendo en http://localhost:4000/graphql")