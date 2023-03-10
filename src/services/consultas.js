const pool = require("../dataBase/db");
const bcrypt = require('bcryptjs')

const verificarCredenciales = async (email, password) => {
    const values = [email]
    const consulta = "SELECT * FROM usuarios WHERE email = $1"
    const { rows: [usuario], rowCount } = await pool.query(consulta, values)
    const { password: passwordEncriptada } = usuario
    const passwordEsCorrecta = bcrypt.compareSync(password, passwordEncriptada)
    if (!passwordEsCorrecta || !rowCount)
        throw { code: 401, message: "Email o contraseña incorrecta" }
}

const registrarUsuario = async (usuario, res) => {
    const { email, password, rol, lenguage } = usuario
    if (![email, password, rol, lenguage].includes("")) {
        const passwordEncriptada = bcrypt.hashSync(password);
       // password = passwordEncriptada
        const values = [email, passwordEncriptada, rol, lenguage]
        const consulta = "INSERT INTO usuarios values (DEFAULT, $1, $2, $3, $4)"
        await pool.query(consulta, values)
        res.send("Usuario creado con éxito")
    } else {
        res.status(500).send("Debe ingresar todos los datos")
    }
}

const mostrarUsuarios = async (email) => {
    try {
        const consulta = "SELECT * FROM usuarios WHERE email = $1";
        const values = [email];
        const { rows } = await pool.query(consulta, values);
        const json = Object.assign({}, rows[0])
        return json;
    } catch (error) {
        res.status(500).send(error)
    }
};

module.exports = { verificarCredenciales, registrarUsuario, mostrarUsuarios };
