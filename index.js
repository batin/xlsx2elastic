'use strict';

// docker run -d -p 5044:5044/tcp -p 5601:5601/tcp -p 9200:9200/tcp -p 9300:9300/tcp sebp/elk:latest
const convert = (path) => {
  const xlsxj = require('xlsx-to-json');
  xlsxj(
    {
      input: path,
      output: 'output.json',
    },
    function (err, result) {
      if (err) {
        console.error(err);
      } else {
        console.log(result);
      }
    },
  );
};

// convert('./input.xlsx');

const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });

async function indexItems(indexName) {
  const output = require('./output.json');
  await output.forEach(async (item) => {
    await client.index({
      index: indexName,
      body: item,
    });
  });
  await console.log(`${output.length} item indexed.`);
}

async function searchItems(query) {
  const { body } = await client.search({
    index: 'deneme',
    body: {
      query: {
        match: query,
      },
    },
  });

  await console.log(body.hits.hits);
  await console.log(`${body.hits.hits.length} items found.`);
}

// indexItems('deneme').catch((err) => console.log(err));

searchItems({ ALARMHEADER: 'rtr.BfdSessionDown' }).catch((err) =>
  console.log(err),
);
