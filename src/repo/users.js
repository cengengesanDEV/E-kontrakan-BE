const postgreDb = require("../config/postgre"); //koneksi database
const bcrypt = require("bcrypt"); // kon
const JWTR = require("jwt-redis").default;
const client = require("../config/redis");

const register = (body) => {
  return new Promise((resolve, reject) => {
    let query = `insert into users(role,phone_number,email,password,created_at,updated_at) values($1, $2, $3,$4, to_timestamp($5),to_timestamp($6)) returning * `;
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
            [role, phone_number, email, hashedPasswords, timestamp, timestamp],
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
    let query = "update profile set ";
    const values = [];
    Object.keys(body).forEach((key, idx, array) => {
      if (idx === array.length - 1) {
        query += `${key} = $${idx + 1} where users_id = $${
          idx + 2
        } returning *`;
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

const deleteUsers = (token, id) => {
  return new Promise((resolve, reject) => {
    const query = "update users set deleted_at = $1 where id = $2";
    const timestamp = Date.now() / 1000;
    postgreDb.query(query, [timestamp, id], (error, result) => {
      if (error) {
        console.log(error);
        return reject({ status: 500, msg: "internal server error" });
      }
      const jwtr = new JWTR(client);
      jwtr.destroy(token.jti).then((res) => {
        if (!res) reject({ status: 500, msg: "internal server error" });
        return resolve({ status: 200, msg: "logout success" });
      });
    });
  });
};

const getUsersById = (id) => {
  return new Promise((resolve, reject) => {
    const query =
      "select role,full_name,phone_number,email,image,gender,location,address from users where id = $1";
    postgreDb.query(query, [id], (error, result) => {
      if (error) {
        console.log(error);
        return reject({ status: 500, msg: "internal server error" });
      }
      return resolve({ status: 200, msg: "data found", data: result.rows });
    });
  });
};

const userRepo = {
  register,
  profile,
  deleteUsers,
  getUsersById
};

module.exports = userRepo;
