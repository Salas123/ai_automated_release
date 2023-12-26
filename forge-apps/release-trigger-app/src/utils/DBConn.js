import {InsertIntoDB} from "./DB";

class DBConn {
    constructor({...props}) {
        this.releaseName = props.releaseName;
        this.epicDetails = props.epicDetails;
        this.confluenceDetails = props.confluenceDetails;
        this.DBDoc = {};
    }

    addDetails({...props}){
        this.DBDoc[props.key] = props.data;
    }
    async getDB(){
        this.DBDoc ={
            releaseName : this.releaseName,
            epic: this.epicDetails,
            confluenceDoc: this.confluenceDetails,
        }

        const res = await InsertIntoDB({document: this.DBDoc});

        if(res.statusCode !== 201){
            //TODO: Add Error Handling
            console.log(`Error on doc submission to MongoDB: Status expected 200, instead got ${res.statusCode}`)
        }
        else{
            console.log('Successful doc submission to MongoDB!')
        }
    }
}

export default DBConn;
