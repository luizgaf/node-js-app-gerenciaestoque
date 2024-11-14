const mysql = require("mysql2");
const bcrypt = require("bcrypt");

const connectionData = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: '3306',
    password: '',
    database: 'gerenciaestoque'
});

function auth( login, senha, connection, bcrypt){
    return new Promise((resolve, reject) => {
        const sqlCommand = "SELECT * FROM users WHERE user = ?";

        connection.query( sqlCommand, [login], async (error, results) =>{
            if (error){
                console.error(error);
                return reject(error);
            }
            if(results.length > 0){
                const user = results[0];
                try{
                    const validPass = await bcrypt.compare(senha, user.password);
                if(validPass){
                    return  resolve(login);
                }
                else{
                    return reject(new Error("Senha incorreta"));
                }
                } catch(err){
                    return reject(err);
                }
            }
            else {
                return reject(new Error("Usuário não encontrado"));
            }
        });
    });
}




function login(){
    const connection = connectionData;

    connection.connect((error) => {
        if (error) {
          console.error('Erro ao conectar ao banco de dados:', error);
          return;
        }
        console.log('Conexão ao banco de dados bem-sucedida');
    });

    const login = document.getElementById("input-login").value
    const pass = document.getElementById("input-password").value

    auth(login, pass, connection, bcrypt)
        .then(user => {
            console.log("Sucess")
            window.location.replace("home.html");
        })
        .catch(error => {
            console.error("Error", error.message)
        })
}

async function salvarUsuario(login, senha) {
    const connection = connectionData;
    try {
        const hash = await bcrypt.hash(senha, 10); 
        const sqlCommand = "INSERT INTO users (user, password) VALUES (?, ?)";

        connection.query(sqlCommand, [login, hash], (error, results) => {
            if (error) {
                console.error("Erro ao inserir usuário:", error);
            } else {
                console.log("Usuário salvo com sucesso!");
            }
        });
    } catch (error) {
        console.error("Erro ao criptografar a senha:", error);
    }
}

bcrypt.compare(senhaTexto, hashSalvoNoBanco)
    .then(isMatch => {
        console.log("Comparação bem-sucedida:", isMatch);
    })
    .catch(err => {
        console.error("Erro na comparação:", err);
    });