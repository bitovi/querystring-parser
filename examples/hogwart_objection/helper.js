const lib = require("../../packages/objection/index");

// function handleQuery(query, data) {
//   for (let d of data) {
//     if (d.isNested) {
//       query[d.fx](function () {
//         for (let para of d.parameters) {
//           console.log(para);
//           // this[para.fx](...para.parameters);

//         }
//       });
//     } else {
//       query[d.fx](...d.parameters);
//     }
//   }
//   return query;
// };

const fetchQuery = async (queryString, model) => {
  const query = model.query();
  if (queryString) {
    const { data, errors } = lib.parse(queryString);
    if (errors.length > 0) {
      throw new Error(errors[0]);
    }
    console.log(data);
    for (let d of data) {
      if (d.isNested) {
        query[d.fx](function () {
          for (let para of d.parameters) {
            console.log(para);
            this[para.fx](...para.parameters);
          }
        });
      } else {
        query[d.fx](...d.parameters);
      }
    }
  }
  const queryData = await query;
  return queryData;
};

module.exports = {
  fetchQuery,
};
