curl -s "https://us-west-2.aws.data.mongodb-api.com/app/data-vcont/endpoint/data/v1/action/findOne" \
  -X POST \
  -H "Content-Type: application/ejson" \
  -H "Accept: application/json" \
  -H "apiKey: sv4eOHv8jm2aAki48TsFTwLammPUy4Di6WEaGPUgU3tqBDNAnofe7MK0nCnDbX2p" \
  -d '{
    "dataSource": "TestReleaseCluster",
    "database": "sample_airbnb",
    "collection": "listingsAndReviews",
    "filter": {
        "listing_url": "https://www.airbnb.com/rooms/10051164"
      }
    }
  }'
