import fsx from "fs";
import { promises as fs } from "fs";

export default class ProductManager {
    constructor(ruta) {
        this.path = ruta;
    }

    crearArchivoSiNoExiste = async ()=>{
        try {
            if(!fsx.existsSync(this.path)) {
                await fs.writeFile(this.path,"[]");
            }
          } catch (e) {
            console.log(e);
          }
    }

    static id = 1


    leerArchivo = async () => {
        try {
            let listaProductos = await fs.readFile(this.path, 'utf-8');
            const products = JSON.parse(listaProductos);
            return products ;
        } catch (e) {
            console.log('No se pudo leer el archivo:', e);
            return [];
        }
     }

    escribirArchivo = async (listaActualizada)=>{
        try {
            await fs.writeFile(this.path, JSON.stringify(listaActualizada), 'utf-8');
            console.log("Se actualizó el archivo data");
        } catch (e) {
            console.log ('Error de código', e);
        }
    }


    addProducts = async (Nuevoproducto) => {
        await this.crearArchivoSiNoExiste();

        const productos = await this.leerArchivo()
        const code = productos.find (p => p.code === Nuevoproducto.code)
        if(code === undefined) {
            if(
                Nuevoproducto.title && 
                Nuevoproducto.description && 
                Nuevoproducto.price && 
                Nuevoproducto.thumbnail && 
                Nuevoproducto.code && 
                Nuevoproducto.stock
                ){
                    Nuevoproducto.id = ProductManager.id++
                    productos.push (Nuevoproducto)
                    await this.escribirArchivo(productos)
                    console.log("Producto agregado exitosamente");
            } else {
                console.log("Uno o mas campos obligatorios requeridos");
            }
        } else {
            console.log("El código del producto ya existe");
        }
    }

    
    updateProduct = async (idModificar,campo, valor)=>{

        const productos = await this.leerArchivo()
        let listaProductosActualizada = [];
        productos.forEach((productoAModificar)=>{
            if(productoAModificar.id === idModificar){
                //modificar
                switch(campo){
                    case 'title': productoAModificar.title = valor; break;
                    case 'description': productoAModificar.description = valor; break;
                    case 'price': productoAModificar.price = valor; break;
                    case 'thumbnail': productoAModificar.thumbnail = valor; break;
                    case 'code': productoAModificar.code = valor; break;
                    case 'stock': productoAModificar.stock = valor; break;
                    default: console.log('El campo que intenta modificar, no existe.');
                }
            }
            listaProductosActualizada.push(productoAModificar);
        });
        await this.escribirArchivo(listaProductosActualizada)
        console.log("se modifico el archivo");
    }
    


    deleteProduct = async(idABorrar) =>{
        const productos = await this.leerArchivo()
        const idproducto = productos.find (p => p.id === idABorrar)
        if(idproducto === undefined) {
            console.log("Producto no encontrado, no se puede borrar");
        } else {
            let indiceABorrar = null;
            productos.forEach((elemento,indice)=>{
                if(elemento.id === idABorrar) indiceABorrar = indice;
            });
            if(indiceABorrar !== null){
                productos.splice(indiceABorrar, 1);
                console.log("Borramos el producto");
                this.escribirArchivo(productos);
            }else{
                console.log("no encontramos el indice");
            }
        }
        
    }

    //Buscar dentro del arreglo por su id
    getProductById = async(id) =>{
        const productos = await this.leerArchivo()
        const product = productos.find (p => p.id === id)
        if (!product) { return 'NOT FOUND'}
        return product
    }

    getProducts = async ()=>{
        const products = await this.leerArchivo();
        return products
    }

}

let producto = new ProductManager('./data.json');
await producto.addProducts({title:'nuevo producto agregado',description:'Set agujas 05 RL', price: 25.60, thumbnail:'imag por definir', code:2945, stock: 8})
await producto.addProducts({title:'objeto 2', description:'Taburete ajustable', price: 31.25, thumbnail:'imag por definir', code:20063, stock: 1})
await producto.addProducts({title:'objeto 3', description:'Set tintas Intenze', price: 98.99, thumbnail:'imag por definir', code:18273, stock: 3})
let producto_consultado_inicial = await producto.getProductById(1);
console.log(producto_consultado_inicial);
await producto.updateProduct(1,'title','Se modifico el nuevo producto');
let producto_consultado_final = await producto.getProductById(1);
console.log(producto_consultado_final);
await producto.deleteProduct(1);
