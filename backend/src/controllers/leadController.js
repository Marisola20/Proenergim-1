import Lead from "../models/Lead.js";

export const crearLead = async (req, res) => {

  try {

    const nuevoLead = new Lead(req.body);

    await nuevoLead.save();

    res.status(201).json({
      message: "Lead guardado correctamente"
    });

  } catch (error) {

    res.status(500).json({
      error: "Error al guardar el lead"
    });

  }

};