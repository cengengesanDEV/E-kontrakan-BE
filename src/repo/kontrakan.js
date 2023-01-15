const postgreDb = require("../config/postgre"); //koneksi database

// all get
const getAllCategory = (param, hostAPI) => {
  return new Promise((resolve, reject) => {
    let query =
      "select de.id,de.tipe_kontrakan,de.price,ca.province,ca.detail_address,(select image from image_kontrakan where id_detail_kontrakan = de.id limit 1) as image from detail_kontrakan as de inner join category_kontrakan as ca on ca.id = de.id_kontrakan where de.deleted_at is null and ca.deleted_at is null ";
    let link = `${hostAPI}/api/kontrakan?`;
    if (param.province) {
      query += `and ca.province = '${param.province}' `;
      link += `province=${param.province}`;
    }
    if (param.sort === "cheapest") {
      if (param.province) {
        link += `&`;
      }
      query += `order by de.price asc`;
      link += `sort=cheapest`;
    }
    if (param.sort === "expensive") {
      if (param.province) {
        link += `&`;
      }
      query += "order by de.price desc";
      link += `sort=expensive`;
    }

    let queryLimit = "";
    let values = [];
    if (param.page && param.limit) {
      let page = parseInt(param.page);
      let limit = parseInt(param.limit);
      let offset = (page - 1) * limit;
      queryLimit = query + ` limit $1 offset $2`;
      values.push(limit, offset);
    } else {
      queryLimit = query;
    }
    postgreDb.query(query, (err, result) => {
      if (err) {
        console.log(err);
        return reject({ msg: "internal server error", status: 500 });
      }
      postgreDb.query(queryLimit, values, (err, queryresult) => {
        if (err) {
          console.log(err);
          return reject({ msg: "internal server error", status: 500 });
        }
        if (queryresult.rows.length == 0)
          return reject({ msg: "data not found", status: 404 });
        let resNext = null;
        let resPrev = null;
        if (param.page && param.limit) {
          let page = parseInt(param.page);
          let limit = parseInt(param.limit);
          let start = (page - 1) * limit;
          let end = page * limit;
          let next = "";
          let prev = "";
          const dataNext = Math.ceil(result.rowCount / limit);
          if (start <= queryresult.rowCount) {
            next = page + 1;
          }
          if (end > 0) {
            prev = page - 1;
          }
          if (parseInt(next) <= parseInt(dataNext)) {
            resNext = `${link}&page=${next}&limit=${limit}`;
          }
          if (parseInt(prev) !== 0) {
            resPrev = `${link}&page=${prev}&limit=${limit}`;
          }
          let sendResponse = {
            dataCount: queryresult.rowCount,
            next: resNext,
            prev: resPrev,
            totalPage: Math.ceil(result.rowCount / limit),
          };
          return resolve({
            msg: "data found",
            data: queryresult.rows,
            meta: sendResponse,
            status: 200,
          });
        }
        let sendResponse = {
          dataCount: result.rowCount,
          next: resNext,
          prev: resPrev,
          totalPage: null,
        };
        return resolve({
          msg: "data found",
          data: queryresult.rows,
          meta: sendResponse,
          status: 200,
        });
      });
    });
  });
};

const getcategoryById = (id) => {
  return new Promise((resolve, reject) => {
    const query =
      "select id,kontrakan_name,province,detail_address,image from category_kontrakan where id_user = $1 and deleted_at is null order by id desc";
    postgreDb.query(query, [id], (error, result) => {
      if (error) {
        console.log(error);
        return reject({ status: 500, msg: "internal server error" });
      }
      return resolve({ status: 200, msg: "data found", data: result.rows });
    });
  });
};

const getCategoryId = (id) => {
  return new Promise((resolve, reject) => {
    const query =
      "select id,kontrakan_name,province,detail_address,image from category_kontrakan where id = $1 and deleted_at is null";
    postgreDb.query(query, [id], (error, result) => {
      if (error) {
        console.log(error);
        return reject({ status: 500, msg: "internal server error" });
      }
      const imagearray = [result.rows[0].image]
      return resolve({ status: 200, msg: "data found", data: {...result.rows,image:imagearray} });
    });
  });
};

const getDetailById = (id) => {
  return new Promise((resolve, reject) => {
    const query =
      "select de.id,de.tipe_kontrakan,de.fasilitas,de.price,de.deskripsi,(select image from image_kontrakan where id_detail_kontrakan = de.id limit 1) as image from detail_kontrakan as de where de.id_kontrakan = $1 and de.deleted_at is null";
    postgreDb.query(query, [id], (error, result) => {
      if (error) {
        console.log(error);
        return reject({ status: 500, msg: "internal server error" });
      }
      return resolve({ status: 200, msg: "data found", data: result.rows });
    });
  });
};

const getKontrakanDetails = (id) => {
  return new Promise((resolve, reject) => {
    console.log(id);
    const query =
      "select de.id,ca.kontrakan_name,de.tipe_kontrakan,de.fasilitas,de.price,de.deskripsi,ca.province,ca.detail_address from detail_kontrakan as de inner join category_kontrakan as ca on de.id_kontrakan = ca.id where de.id = $1 and de.deleted_at is null";
    postgreDb.query(query, [id], (error, result) => {
      if (error) {
        console.log(error);
        return reject({ status: 500, msg: "internal server error" });
      }
      let Data = { ...result.rows[0] };
      console.log(result.rows);
      const queryImage =
        "select image from image_kontrakan where id_detail_kontrakan = $1";
      postgreDb.query(queryImage, [id], (error, result) => {
        if (error) {
          console.log(error);
          return reject({ status: 500, msg: "internal server error" });
        }
        const image = [];
        result.rows.forEach((e) => image.push(e.image));
        Data = { ...Data, image: image };
        return resolve({ status: 200, msg: "data found", data: Data });
      });
    });
  });
};

//all post
const postCategory = (id, body, image) => {
  return new Promise((resolve, reject) => {
    const { kontrakan_name, province, detail_address } = body;
    const query =
      "insert into category_kontrakan(id_user,kontrakan_name,province,detail_address,image,created_at,updated_at) values($1,$2,$3,$4,$5,to_timestamp($6),to_timestamp($7))";
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

const postDetail = (req) => {
  return new Promise((resolve, reject) => {
    const { id_kontrakan, tipe_kontrakan, fasilitas, price, deskripsi } =
      req.body;
    const timeStamp = Date.now() / 1000;
    const images = req.file;
    const query = `insert into detail_kontrakan(id_kontrakan,tipe_kontrakan,fasilitas,price,deskripsi,created_at,updated_at) values($1,$2,ARRAY${fasilitas},$3,$4,to_timestamp($5),to_timestamp($6)) returning *`;
    postgreDb.query(
      query,
      [id_kontrakan, tipe_kontrakan, price, deskripsi, timeStamp, timeStamp],
      (error, result) => {
        if (error) {
          console.log(error);
          console.log(query);
          return reject({ status: 500, msg: "internal server error" });
        }
        let resultSuccess = { ...result.rows[0] };
        const kontrakan_id = result.rows[0].id;
        let imageValues = "values";
        let preapreImage = [];
        images.forEach((image, index) => {
          if (index !== images.length - 1) {
            imageValues += `($${1 + index * 2}, $${2 + index * 2}), `;
          } else {
            imageValues += `($${1 + index * 2}, $${2 + index * 2})`;
          }
          preapreImage.push(kontrakan_id, image);
        });
        console.log("first");
        const addImageQuery = `insert into image_kontrakan(id_detail_kontrakan, image) ${imageValues} returning *`;
        postgreDb.query(addImageQuery, preapreImage, (err, result) => {
          if (err) {
            console.log(err);
            return reject({ status: 500, msg: "internal server error" });
          }
          const imageResult = [];
          result.rows.forEach((image) => imageResult.push(image.image));
          resultSuccess = { ...resultSuccess, imageResult };
          return resolve({
            status: 201,
            msg: "kontrakan created",
            data: resultSuccess,
          });
        });
      }
    );
  });
};

// patch
const patchCategory = (body, id) => {
  return new Promise((resolve, reject) => {
    let query = "update category_kontrakan set ";
    const values = [];
    Object.keys(body).forEach((key, idx, array) => {
      if (idx === array.length - 1) {
        query += `${key} = $${idx + 1} where id = $${idx + 2} returning *`;
        values.push(body[key], id);
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

//delete
const deleteCategory = (id) => {
  return new Promise((resolve, reject) => {
    const query = "update category_kontrakan set deleted_at = to_timestamp($1) where id = $2";
    const timeStamp = Date.now() / 1000;
    postgreDb.query(query, [timeStamp, id], (err, response) => {
      if (err) {
        console.log(err);
        return reject({ status: 500, msg: "internal server error" });
      }
      return resolve({
        status: 200,
        msg: "category kontrakan deleted",
        response
      });
    });
  });
};
const deleteDetail = (id) => {
  return new Promise((resolve, reject) => {
    const query = "update detail_kontrakan set deleted_at = to_timestamp($1) where id = $2";
    const timeStamp = Date.now() / 1000;
    postgreDb.query(query, [timeStamp, id], (err, response) => {
      if (err) {
        console.log(err);
        return reject({ status: 500, msg: "internal server error" });
      }
      return resolve({
        status: 200,
        msg: "tipe kontrakan deleted",
        response
      });
    });
  });
};

const kontrakanRepo = {
  getAllCategory,
  getcategoryById,
  getDetailById,
  getCategoryId,
  getKontrakanDetails,
  postCategory,
  postDetail,
  patchCategory,
  deleteCategory,
  deleteDetail
};

module.exports = kontrakanRepo;
