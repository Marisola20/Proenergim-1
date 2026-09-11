import Producto from "../models/Producto.js"
import defaultProducts from "../data/defaultProducts.js"

let defaultsPromise = null

const ensureDefaultProducts = async () => {
  if (!defaultsPromise) {
    defaultsPromise = Producto.bulkWrite(defaultProducts.map(producto => ({
      updateOne: {
        filter: { codigo: producto.codigo },
        update: { $setOnInsert: producto },
        upsert: true,
      },
    })), { ordered: false }).catch(error => {
      if (error.code === 11000) return
      defaultsPromise = null
      throw error
    })
  }

  await defaultsPromise
}

const getProductos = async (req, res) => {
  try {
    await ensureDefaultProducts()
    const productos = await Producto.find().sort({ orden: 1 }).lean()
    res.set("Cache-Control", "no-store")
    res.json(productos)
  } catch (error) {
    console.error("Error al obtener productos:", error)
    res.status(500).json({ message: "Error al obtener productos" })
  }
}

export const getProductosPublicos = getProductos
export const getProductosAdmin = getProductos

export const actualizarProducto = async (req, res) => {
  const titulo = String(req.body?.titulo || "").trim()
  const marca = String(req.body?.marca || "").trim()
  const imagen = String(req.body?.imagen || "").trim()
  const categoria = req.body?.categoria
  const precio = Number(req.body?.precio)
  const garantiaAnos = Number(req.body?.garantiaAnos)

  if (!titulo || !marca || !imagen) {
    return res.status(400).json({ message: "Nombre, marca e imagen son obligatorios" })
  }
  if (!defaultProducts.some(producto => producto.categoria === categoria)) {
    return res.status(400).json({ message: "Categoría no válida" })
  }
  if (!Number.isFinite(precio) || precio < 0) {
    return res.status(400).json({ message: "El precio debe ser un número igual o mayor que cero" })
  }
  if (!Number.isFinite(garantiaAnos) || garantiaAnos < 0 || garantiaAnos > 20) {
    return res.status(400).json({ message: "La garantía debe estar entre 0 y 20 años" })
  }

  try {
    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      { titulo, marca, imagen, categoria, precio, garantiaAnos },
      { new: true, runValidators: true },
    )

    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" })
    }

    res.json(producto)
  } catch (error) {
    console.error("Error al actualizar producto:", error)
    res.status(500).json({ message: "Error al actualizar producto" })
  }
}

export const crearProducto = async (req, res) => {
  const titulo = String(req.body?.titulo || "").trim()
  const marca = String(req.body?.marca || "").trim()
  const imagen = String(req.body?.imagen || "").trim()
  const categoria = req.body?.categoria
  const precio = Number(req.body?.precio)
  const garantiaAnos = Number(req.body?.garantiaAnos)

  if (!titulo || !marca || !imagen) {
    return res.status(400).json({ message: "Nombre, marca e imagen son obligatorios" })
  }
  if (!["variadores", "accesorios"].includes(categoria)) {
    return res.status(400).json({ message: "Categoría no válida" })
  }
  if (!Number.isFinite(precio) || precio < 0) {
    return res.status(400).json({ message: "El precio debe ser un número igual o mayor que cero" })
  }
  if (!Number.isFinite(garantiaAnos) || garantiaAnos < 0 || garantiaAnos > 20) {
    return res.status(400).json({ message: "La garantía debe estar entre 0 y 20 años" })
  }

  try {
    const codigo = `PROD-${Date.now()}`
    const count = await Producto.countDocuments()
    
    const nuevoProducto = new Producto({
      codigo,
      titulo,
      marca,
      imagen,
      categoria,
      precio,
      garantiaAnos,
      orden: count + 1
    })

    await nuevoProducto.save()
    res.status(201).json(nuevoProducto)
  } catch (error) {
    console.error("Error al crear producto:", error)
    res.status(500).json({ message: "Error al crear producto" })
  }
}
