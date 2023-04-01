import express from 'express';
import ProductManager from "./ProductM.js";

const producto = new ProductManager('./data.json')
const app = express();

app.use(express.urlencoded({ extended: true }));

/*app.get ('/', (request, response)=> {
    response.send('Whats happend')

})*/

app.get('/products',  (req, res) => {

    const { limit } = req.query
    producto.getProducts().then(products => {
    if (!limit){
        res.send(products)
    } else{
        const limitProduts = products.slice(0, limit)
        res.send(limitProduts)
    }

    })
        .catch(err => res.status(500).send(err))

})

app.get('/products/:pid', (req, res) => {

    const id = parseInt(req.params.pid)
    producto.getProductById(id)
        .then(product =>{
            (res.send(product))
        })
        .catch(err => res.status(500).send(err))
})

app.listen(8090, () => {
    console.log('Estoy escuchando el puerto 8090...');
});
