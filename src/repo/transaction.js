const postgreDb = require("../config/postgre"); //koneksi database

const postBooking = (body) => {
    return new Promise((resolve, reject) => {
        const {id_users,id_kontrakan,checkin,checkout,order_date,total_price} = body
        const timestamp = Date.now() / 1000;
        const query = "insert into transaction(id_users,id_kontrakan,checkin,checkout,status_booking,order_date,total_price,created_at,updated_at) values($1,$2,$3,$4,$5,$6,$7,to_timestamp($8),to_timestamp($9))"
        postgreDb.query(query, [id_users,id_kontrakan,checkin,checkout,"pending",order_date,total_price,timestamp,timestamp],(error,result)=> {
            if(error){
                console.log(error);
                reject({status:500, msg: 'internal server error'})
            }
            const queryUpdate = `update detail_kontrakan set status = 'booked' where id = $1` 
            postgreDb.query(queryUpdate,[id_kontrakan],(error,result)=> {
                if(error){
                    console.log(error)
                    reject({status:500, msg: 'internal server error'})
                }
                return resolve({status:201, msg:'kontrakan has book please continue to payment'})
            })
        })
    })
}

const transactionRepo = {
    postBooking
  };
  
  module.exports = transactionRepo;