var express = require('express');
var router = express.Router();
var elasticsearch = require('elasticsearch')

var client = elasticsearch.Client({
  host: '10.115.0.134:9200',
  //log: 'trace'
})

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('search', {
    title: 'SEARCH',
    keyword: '',
    result: ''
  });
});

router.post('/', function (req, res, next) {
  client.search({
    index: 'dfsearch',
    type: 'web',
    body: {
      'query': {
        'bool': {
          'should': [
            {
              'multi_match': {
                'query': req.body.searchedit,
                'type': 'phrase',
                'fields': [
                  'info',
                  'info.chinese'
                ],
                'boost': 1000
              }
            },
            {
              'multi_match': {
                'query': req.body.searchedit,
                'type': 'best_fields',
                'fields': [
                  'info',
                  'info.chinese'
                ],
                'analyzer': 'ik_max_word'
              }
            }
          ]
        }
      },
      "highlight": {
        "fields": {
          "info": {"fragment_size": 20, "number_of_fragments": 3}
        }
      }
    }
  }, function (err, resSearch) {
    if (err) {
      throw err;
    }
    res.render('search', {
      title: 'SEARCH',
      keyword: req.body.searchedit,
      result: resSearch.hits.hits
    });
  });
});


module.exports = router;
