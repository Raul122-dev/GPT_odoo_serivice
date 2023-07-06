import Odoo from 'odoo-xmlrpc';

class OdooConnection {
  constructor() {
    this.odoo = null;
    this.timeout = null;
    this.connectionDuration = 60 * 60 * 1000; // 1 hour in milliseconds
  }

  connect() {
    return new Promise((resolve, reject) => {

      if (this.odoo) {
        // If the connection is already open, just reset the timer
        console.log('Odoo connection already open. Resetting timer.')
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.odoo = null;
          console.log('Odoo connection closed due to inactivity.');
        }, this.connectionDuration);
        resolve();
      } else {
        this.odoo = new Odoo({
          url: process.env.URL_ODOO,
          port: process.env.PORT_ODOO,
          db: process.env.DB_ODOO,
          username: process.env.USER_ODOO,
          password: process.env.PASSWORD_ODOO,
        });

        this.odoo.connect((err) => {
          if (err) {
            console.log(err);
            reject(err);
            return;
          }

          console.log('Connected to Odoo server.');

          this.timeout = setTimeout(() => {
            this.odoo = null;
            console.log('Odoo connection closed due to inactivity.');
          }, this.connectionDuration);
          resolve();
        });
      } 
    });
  }

  get_messages({ chat_id, prompt }) {
    return new Promise((resolve, reject) => {
      this.connect()
        .then(() => {
          let inParams = [];
          inParams.push(chat_id);
          inParams.push(prompt);
          let params = [];
          params.push(inParams);
          this.odoo.execute_kw('gpt.chat', 'generate_chat_lines', params, function (err, value) {
            if (err) {
              console.log(err);
              reject(err);
              return;
            }
            console.log('Result: ', value);
            resolve(value);
          });
        })
        .catch((err) => reject(err));
    });
  }

  save_message({ is_user, chat_id, message, data = false, function_call = false }) {
    return new Promise((resolve, reject) => {
      this.connect()
        .then(() => {
          let inParams = [];
          inParams.push(is_user);
          inParams.push(chat_id);
          inParams.push(message);
          inParams.push(data);
          inParams.push(function_call);
          let params = [];
          params.push(inParams);
          this.odoo.execute_kw('gpt.chat', 'save_message', params, function (err, value) {
            if (err) {
              console.log(err);
              reject(err);
              return;
            }
            console.log('Result: ', value);
            resolve(value);
          });
        })
        .catch((err) => reject(err));
    });
  }

  search_in_google({ function_args }) {
    return new Promise((resolve, reject) => {
      this.connect()
        .then(() => {
          let inParams = [];
          inParams.push(function_args);
          let params = [];
          params.push(inParams);
          this.odoo.execute_kw('gpt.chat', 'search_in_google_node', params, function (err, value) {
            if (err) {
              console.log(err);
              reject(err);
              return;
            }
            console.log('Result: ', value);
            resolve(value);
          });
        })
        .catch((err) => reject(err));
    });
  }

  consult_odoo_database({ function_args }) {
    return new Promise((resolve, reject) => {
      this.connect()
        .then(() => {
          let inParams = [];
          inParams.push(function_args);
          let params = [];
          params.push(inParams);
          this.odoo.execute_kw('gpt.chat', 'consult_odoo_database_node', params, function (err, value) {
            if (err) {
              console.log(err);
              reject(err);
              return;
            }
            console.log('Result: ', value);
            resolve(value);
          });
        })
        .catch((err) => {
          console.log(err)
          reject(err)
        });
    });
  }

  count_odoo_records({ function_args }) {
    return new Promise((resolve, reject) => {
      this.connect()
        .then(() => {
          let inParams = [];
          inParams.push(function_args);
          let params = [];
          params.push(inParams);
          this.odoo.execute_kw('gpt.chat', 'count_odoo_records_node', params, function (err, value) {
            if (err) {
              console.log(err);

              reject(err);
              return;
            }
            console.log('Result: ', value);
            resolve(value);
          });
        })
        .catch((err) => reject(err));
    });
  }

  create_odoo_record({ function_args }) {
    return new Promise((resolve, reject) => {
      this.connect()
        .then(() => {
          let inParams = [];
          inParams.push(function_args);
          let params = [];
          params.push(inParams);
          this.odoo.execute_kw('gpt.chat', 'create_odoo_record_node', params, function (err, value) {
            if (err) {
              console.log(err);
              reject(err);
              return;
            }
            console.log('Result: ', value);
            resolve(value);
          });
        })
        .catch((err) => reject(err));
    });
  }
}

export const odooConnection = new OdooConnection();


// export function get_messages({chat_id, prompt}) {
//     return new Promise((resolve, reject) => {
//       odoo.connect(function (err) {
//         if (err) {
//           console.log(err);
//           reject(err);
//           return;
//         }
//         console.log('Connected to Odoo server.');
//         let inParams = [];
//         inParams.push(chat_id);
//         inParams.push(prompt);
//         let params = [];
//         params.push(inParams);
//         odoo.execute_kw('gpt.chat', 'generate_chat_lines', params, function (err, value) {
//           if (err) {
//             console.log(err);
//             reject(err);
//             return;
//           }
//         //   console.log('Result: ', value);
//           resolve(value);
//         });
//       });
//     });
// }

// export function save_message({is_user, chat_id, message, data=false, function_call=false}) {
//   return new Promise((resolve, reject) => {
//     odoo.connect(function (err) {
//       if (err) {
//         console.log(err);
//         reject(err);
//         return;
//       }
//       console.log('Connected to Odoo server.');
//       let inParams = [];
//       inParams.push(is_user);
//       inParams.push(chat_id);
//       inParams.push(message);
//       inParams.push(data);
//       inParams.push(function_call);
//       let params = [];
//       params.push(inParams);
//       odoo.execute_kw('gpt.chat', 'save_message', params, function (err, value) {
//         if (err) {
//           console.log(err);
//           reject(err);
//           return;
//         }
//         console.log('Result: ', value);
//         resolve(value);
//       });
//     });
//   });
// }

// export function search_in_google({search_query}) {
//   return new Promise((resolve, reject) => {
//     odoo.connect(function (err) {
//       if (err) {
//         console.log(err);
//         reject(err);
//         return;
//       }
//       console.log('Connected to Odoo server.');
//       let inParams = [];
//       inParams.push(search_query);
//       let params = [];
//       params.push(inParams);
//       odoo.execute_kw('gpt.chat', 'search_in_google_node', params, function (err, value) {
//         if (err) {
//           console.log(err);
//           reject(err);
//           return;
//         }
//         console.log('Result: ', value);
//         resolve(value);
//       });
//     });
//   });
// }

// export function consult_odoo_database({function_args}){
//   return new Promise((resolve, reject) => {
//       odoo.connect(function (err) {
//         if (err) {
//           console.log(err);
//           reject(err);
//           return;
//         }
//         console.log('Connected to Odoo server.');
//         let inParams = [];
//         inParams.push(function_args);
//         let params = [];
//         params.push(inParams);
//         odoo.execute_kw('gpt.chat', 'consult_odoo_database_node', params, function (err, value) {
//           if (err) {
//             console.log(err);
//             reject(err);
//             return;
//           }
//           console.log('Result: ', value);
//           resolve(value);
//         });
//       });
//   });
// }

// export function count_odoo_records({function_args}){
//   return new Promise((resolve, reject) => {
//       odoo.connect(function (err) {
//         if (err) {
//           console.log(err);
//           reject(err);
//           return;
//         }
//         console.log('Connected to Odoo server.');
//         let inParams = [];
//         inParams.push(function_args);
//         let params = [];
//         params.push(inParams);
//         odoo.execute_kw('gpt.chat', 'count_odoo_records_node', params, function (err, value) {
//           if (err) {
//             console.log(err);
//             reject(err);
//             return;
//           }
//           console.log('Result: ', value);
//           resolve(value);
//         });
//       });
//   });
// }

// export function create_odoo_record({function_args}){
//   return new Promise((resolve, reject) => {
//       odoo.connect(function (err) {
//         if (err) {
//           console.log(err);
//           reject(err);
//           return;
//         }
//         console.log('Connected to Odoo server.');
//         let inParams = [];
//         inParams.push(function_args);
//         let params = [];
//         params.push(inParams);
//         odoo.execute_kw('gpt.chat', 'create_odoo_record_node', params, function (err, value) {
//           if (err) {
//             console.log(err);
//             reject(err);
//             return;
//           }
//           console.log('Result: ', value);
//           resolve(value);
//         });
//       });
//   });
// }

