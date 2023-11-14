import api from "@forge/api";
export function InsertIntoDB({...props}) {
    return new Promise(async (resolve) =>{
        const response = await api.fetch(`${process.env.MONGODBBASEAPI}/action/insertOne`,
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
                    "document": props.document
                })
            });

        resolve(response.status);
    });
}

export function FindInDB({...props}) {
    return new Promise(async resolve =>{
        const response = await api.fetch(`${process.env.MONGODBBASEAPI}/action/findOne`,
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
                    "filter":{
                        "releaseName": props.query
                    }
                })
            })

        const payload = response.json();

        resolve(payload)
    })
}

