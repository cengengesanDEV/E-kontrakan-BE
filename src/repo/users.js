const postgreDb = require("../config/postgre"); //koneksi database
const bcrypt = require("bcrypt"); // kon
const JWTR = require("jwt-redis").default;
const client = require("../config/redis");

const register = (body) => {
  return new Promise((resolve, reject) => {
    let query = `insert into users(role,phone_number,email,status_acc,password,created_at,updated_at) values($1, $2,$3 ,$4,$5, to_timestamp($6),to_timestamp($7)) returning role,phone_number,email,status_acc `;
    const { role, email, passwords, phone_number } = body;
    const validasiEmail = `select email from users where email like $1`;
    const validasiPhone = `select phone_number from users where phone_number like $1`;
    let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
    if (regex.test(email) === false) {
      return reject({ status: 401, msg: "format email wrong" });
    }
    postgreDb.query(validasiEmail, [email], (error, resEmail) => {
      if (error) {
        console.log(error);
        return reject({ status: 500, msg: "Internal Server Error" });
      }
      if (resEmail.rows.length > 0) {
        return reject({ status: 401, msg: "email already used" });
      }
      postgreDb.query(validasiPhone, [phone_number], (error, resPhone) => {
        if (error) {
          console.log(error);
          return reject({ status: 500, msg: "Internal Server Error" });
        }
        if (resPhone.rows.length > 0) {
          return reject({ status: 401, msg: "number phone already use" });
        }

        // Hash Password
        bcrypt.hash(passwords, 10, (error, hashedPasswords) => {
          if (error) {
            console.log(error);
            return reject({ status: 500, msg: "Internal Server error" });
          }
          const timestamp = Date.now() / 1000;
          postgreDb.query(
            query,
            [
              role,
              phone_number,
              email,
              "active",
              hashedPasswords,
              timestamp,
              timestamp,
            ],
            (error, response) => {
              if (error) {
                console.log(error);
                return reject({
                  status: 500,
                  msg: "Internal Server Error",
                });
              }
              resolve({
                status: 200,
                msg: "register sucess",
                data: response.rows[0],
              });
            }
          );
        });
      });
    });
  });
};

const profile = (body, token) => {
  return new Promise((resolve, reject) => {
    let query = "update users set ";
    const values = [];
    Object.keys(body).forEach((key, idx, array) => {
      if (idx === array.length - 1) {
        query += `${key} = $${idx + 1} where id = $${
          idx + 2
        } returning full_name,location,role,email,address,id,phone_number,image,gender`;
        values.push(body[key], token);
        return;
      }
      query += `${key} = $${idx + 1},`;
      values.push(body[key]);
    });
    postgreDb
      .query(query, values)
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};

const deleteUsers = (id, msg) => {
  return new Promise((resolve, reject) => {
    const query = "update users set status_acc = $1 where id = $2";
    postgreDb.query(query, ["suspend", id], (error, result) => {
      if (error) {
        console.log(error);
        return reject({ status: 500, msg: "internal server error" });
      }
      const queryMsg =
        "insert into msg_suspend(id_users,msg) values($1,$2) returning msg";
      postgreDb.query(queryMsg, [id, msg], (err, result) => {
        if (err) {
          console.log(err);
          return reject({ status: 500, msg: "internal server error" });
        }
        return resolve({ status: 201, msg: result.rows[0].msg });
      });
    });
  });
};

const getUsersById = (id) => {
  return new Promise((resolve, reject) => {
    const query =
      "select id,role,full_name,phone_number,email,image,gender,location,address from users where id = $1";
    postgreDb.query(query, [id], (error, result) => {
      if (error) {
        console.log(error);
        return reject({ status: 500, msg: "internal server error" });
      }
      return resolve({ status: 200, msg: "data found", data: result.rows });
    });
  });
};

const getAllUsers = (users)=> {
  return new Promise((resolve,reject)=> {
    let query = 'select id,role,full_name,phone_number,email,image,gender,status_acc from users'
    if(users){
      query += ` where lower(full_name) like lower('%${users}%')` 
    }
    postgreDb.query(query,(err,result)=> {
      if(err){
        console.log(err);
        return reject({status:500,msg:'internal server error'})
      }
      return resolve({status:200,msg:'data found',data:result.rows})
    })
  })
}

const unsuspendUser = (id) => {
  return new Promise((resolve,reject)=> {
    const query = 'select id from msg_suspend where id_users = $1 and deleted_at is null';
    postgreDb.query(query, [id],(error,result)=> {
      if(error){
        console.log(error);
        return reject({ status: 500, msg: "internal server error" });
      }
      const idMsg = result.rows[0].id
      const timestamp = Date.now() / 1000;
      const queryDeleteMsg = 'update msg_suspend set deleted_at = to_timestamp($1) where id = $2'
      postgreDb.query(queryDeleteMsg,[timestamp,idMsg],(error,result)=> {
        if(error){
          console.log(error);
          return reject({ status: 500, msg: "internal server error" });
        }
        const queryDeleteSuspend = 'update users set status_acc = $1 where id = $2'
        postgreDb.query(queryDeleteSuspend,["active",id],(error,result)=> {
          if(error){
            console.log(error)
            return reject({ status: 500, msg: "internal server error" });
          }
          return resolve({ status: 200, msg: "users successfuly unsuspend" })
        })
      })
    })
  })
}

const userRepo = {
  register,
  profile,
  deleteUsers,
  getUsersById,
  unsuspendUser,
  getAllUsers
};

module.exports = userRepo;
