const postgreDb = require("../config/postgre"); //koneksi database

// all get
const getAllCategory = (province) => {
  return new Promise((resolve, reject) => {
    const query =
      "select id,kontrakan_name,description,province,detail_address,image from category_kontrakan ";
    if (province !== "") {
      query += `where province = ${province}`;
    }
    postgreDb.query(query, (error, result) => {
      if (error) {
        console.log(error);
        return reject({ status: 500, msg: "internal server error" });
      }
      return resolve({ status: 200, msg: "data found", data: result.rows });
    });
  });
};

const getcategoryById = (id) => {
  return new Promise((resolve, reject) => {
    const query =
      "select id,kontrakan_name,description,province,detail_address,image from category_kontrakan where id_user = $1";
    postgreDb.query(query, [id], (error, result) => {
      if (error) {
        console.log(error);
        return reject({ status: 500, msg: "internal server error" });
      }
      return resolve({ status: 200, msg: "data found", data: result });
    });
  });
};
const getDetailById = (id) => {
  return new Promise((resolve, reject) => {
    const query =
      "select id,tipe_kontrakan,fasilitas,price,deskripsi,image1,image2,image3,image4,image5 from detail_kontrakan where id_kontrakan = $1";
    postgreDb.query(query, [id], (error, result) => {
      if (error) {
        console.log(error);
        return reject({ status: 500, msg: "internal server error" });
      }
      return resolve({ status: 200, msg: "data found", data: result });
    });
  });
};

//all post
const postCategory = (id, body, image) => {
  return new Promise((resolve, reject) => {
    const { kontrakan_name, province, detail_address } =
      body;
    const query =
      "insert into category_kontrakan(id_user,kontrakan_name,province,detail_address,image,created_at,updated_at) values($1,$2,$3,$4,$5,$6,to_timestamp($7),to_timestamp($8))";
    const timestamp = Date.now() / 1000;
    postgreDb.query(
      query,
      [
        id,
        kontrakan_name,
        province,
        detail_address,
        image,
        timestamp,
        timestamp,
      ],
      (error, result) => {
        if (error) {
          console.log(error);
          return reject({ status: 500, msg: "internal server error" });
        }
        return resolve({
          status: 201,
          msg: "category kontrakan created",
          result,
        });
      }
    );
  });
};
const kontrakanRepo = {
  getAllCategory,
  getcategoryById,
  getDetailById,
  postCategory
};

module.exports = kontrakanRepo;
