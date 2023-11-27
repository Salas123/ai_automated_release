import fetch from "node-fetch";
class QueryDB{
    constructor(featureQuery) {
        this.featureQuery = featureQuery
    }

    async queryFeature (){
        const response = await fetch('https://us-west-2.aws.data.mongodb-api.com/app/data-vcont/endpoint/data/v1/action/findOne', {
            method: 'POST',
            headers: {
                apiKey: "sv4eOHv8jm2aAki48TsFTwLammPUy4Di6WEaGPUgU3tqBDNAnofe7MK0nCnDbX2p",
                ContentType: "application/ejson",
                Accept: "application/json"
            },
            body: JSON.stringify({
                dataSource: "TestReleaseCluster",
                database: "sample_airbnb",
                collection: "listingsAndReviews",
                filter: {
                    "listing_url": this.featureQuery
                }
            })
        })

        console.log(await response.json())
    }

}

export default QueryDB;
