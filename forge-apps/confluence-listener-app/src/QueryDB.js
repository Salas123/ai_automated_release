import api from "@forge/api";

const GetReleaseByPageId = async ({...props}) => {
    const response = await api.fetch(`${process.env.MONGODBBASEAPI}/action/aggregate`,
        {
            method: 'POST',
            headers: {
                ContentType: 'application/json',
                AccessControlRequestHeaders: '*',
                apiKey: process.env.DBAPIKEY,
            },
            body: JSON.stringify({
                "collection": process.env.COLLECTIONDB,
                "database": process.env.DBNAME,
                "dataSource": process.env.DATASOURCE,
                "pipeline":[
                    {
                        "$search": {
                            index: "pageID",
                            text: {
                                query: `pageID=${props.pageID}`,
                                path: {
                                    wildcard: "*"
                                }
                            }
                        }
                    }
                ]


            })
        });

    console.log(`MongoDB -- Response from Aggregate Query: Status Code ${response.status} -- ${response.statusText}`)

    const payload = await response.json()

    // if(response.status !== 200 || payload.documents.length < 1)
    //     throw Error('Invalid response returned from MongoDB or no documents were returned from MongoDB');

    return payload.documents[0]
};


const UpdateDocTaskObjByID = async ({...props}) =>{
    const response = await api.fetch(`${process.env.MONGODBBASEAPI}/action/updateOne`,
        {
            method: "POST",
            headers: {
                    ContentType: 'application/json',
                    AccessControlRequestHeaders: '*',
                    apiKey: process.env.DBAPIKEY,
                },
            body: JSON.stringify({
                "collection": process.env.COLLECTIONDB,
                "database": process.env.DBNAME,
                "dataSource": process.env.DATASOURCE,
                "filter":{
                    "$oid": props.docID
                },
                "update":{
                    "$push": {
                        "confluenceDoc.tasks.taskObjs": props.data
                    },
                    "$inc":{
                        "confluenceDoc.tasks.numOfTasks": 1
                    }

                }
            })
        });



    console.log(`MongoDB -- Response from Update Query: Status Code ${response.status} -- ${response.statusText}`)

    const payload = await response.json()

    if(response.status !== 200)
        throw Error('Invalid response returned from MongoDB or no documents were updated from MongoDB');

}

const UpdateDocRevisionByID = async ({...props}) =>{
    const response = await api.fetch(`${process.env.MONGODBBASEAPI}/action/updateOne`, {
        method: "POST",
        headers: {
            ContentType: 'application/json',
            AccessControlRequestHeaders: '*',
            apiKey: process.env.DBAPIKEY,
        },
        body: JSON.stringify({
            "collection": process.env.COLLECTIONDB,
            "database": process.env.DBNAME,
            "dataSource": process.env.DATASOURCE,
            "filter":{
                "$oid": props.docID
            },
            "update":{
                "$inc":{
                    "confluenceDoc.revisions": 1
                }
            }
        })
    });

    console.log(`MongoDB -- Response from Update Query: Status Code ${response.status} -- ${response.statusText}`)

    const payload = await response.json();

    if(response.status !== 200)
        throw Error('Invalid response returned from MongoDB or no documents were updated from MongoDB');



}


const UpdateDocPageStatusByID = async ({...props}) =>{
    const response = await api.fetch(`${process.env.MONGODBBASEAPI}/action/updateOne`, {
        method: "POST",
        headers: {
            ContentType: 'application/json',
            AccessControlRequestHeaders: '*',
            apiKey: process.env.DBAPIKEY,
        },
        body: JSON.stringify({
            "collection": process.env.COLLECTIONDB,
            "database": process.env.DBNAME,
            "dataSource": process.env.DATASOURCE,
            "filter":{
                "$oid": props.docID
            },
            "update":{
                "$set":{
                    "confluenceDoc.pageStatus": props.data
                }
            }
        })
    });

    console.log(`MongoDB -- Response from Update Query: Status Code ${response.status} -- ${response.statusText}`)

    const payload = await response.json();

    if(response.status !== 200)
        throw Error('Invalid response returned from MongoDB or no documents were updated from MongoDB');


    console.log(payload);
};



const UpdateDocTaskStatusCompleteByID = async ({...props}) => {

    const taskPath = `confluenceDoc.tasks.taskObjs.${props.taskID}`
    let setObj = {};
    setObj[taskPath] = props.data;


    const response = await api.fetch(`${process.env.MONGODBBASEAPI}/action/updateOne`, {
        method: "POST",
        headers: {
            ContentType: 'application/json',
            AccessControlRequestHeaders: '*',
            apiKey: process.env.DBAPIKEY,
        },
        body: JSON.stringify({
            "collection": process.env.COLLECTIONDB,
            "database": process.env.DBNAME,
            "dataSource": process.env.DATASOURCE,
            "filter":{
                "$oid": props.docID
            },
            "update":{
                "$set":{
                    ...setObj
                }
            }
        })
    });

    console.log(`MongoDB -- Response from Update Query: Status Code ${response.status} -- ${response.statusText}`)

    const payload = await response.json();
    console.log(payload);

    if(response.status !== 200)
        throw Error('Invalid response returned from MongoDB or no documents were updated from MongoDB');


}

const GetAllTasksFromDocByID = async ({...props}) => {

    const response = await api.fetch(`${process.env.MONGODBBASEAPI}/action/findOne`, {
        method: "POST",
        headers: {
            ContentType: 'application/json',
            AccessControlRequestHeaders: '*',
            apiKey: process.env.DBAPIKEY,
        },
        body: JSON.stringify({
            "collection": process.env.COLLECTIONDB,
            "database": process.env.DBNAME,
            "dataSource": process.env.DATASOURCE,
            "filter":{
                "oid": props.docID
            }
        })
    });

    console.log(`MongoDB -- Response from Update Query: Status Code ${response.status} -- ${response.statusText}`)

    const payload = await response.json();

    if(response.status !== 200)
        throw Error('Invalid response returned from MongoDB or no documents were updated from MongoDB');

    return payload.document.confluenceDoc.tasks.taskObjs;
}

export default {
    GetReleaseByPageId,
    GetAllTasksFromDocByID,
    UpdateDocTaskObjByID,
    UpdateDocRevisionByID,
    UpdateDocPageStatusByID,
    UpdateDocTaskStatusCompleteByID
}
