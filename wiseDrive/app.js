const express = require('express')
const app = express();
const logger = require('./utils/logger');
const csv = require('csv-parser');
const fs = require('fs');
const port = 8081;

let csvData = []
fs.createReadStream('vehicle_type.csv')
    .pipe(csv())
    .on('data', (rows) => {
      csvData.push(rows)
    })
    .on('end', () => {
      logger.info('CSV file successfully processed');
    });

app.get("/ids_by_vehicle_type", (req, res) => {
  let typeName = req.query.typeName;
  if (typeName){
    let typeMatched = false
    let ids = []
    for (const csvDatum of csvData){
      if (csvDatum.typeName == typeName){
        ids.push(csvDatum.carId)
        typeMatched = true
      }
    }
    if (typeMatched){
      res.json({status: 200, data: { message: "Car ids", value: ids } })
    }else{
      res.json({status: 500, data: { message: "Data doesn't match" } })
    }
  }else{
    res.json({status: 500, data: { message: "Please provide the correct type name" } })
  }

})

app.listen(port, () => {
  logger.info(`Recorder listening at PORT :${port}`)
});
