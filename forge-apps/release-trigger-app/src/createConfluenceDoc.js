import api, {route} from "@forge/api";
import ConfluenceDocObj from "./ConfluenceDocObj";
class CreateConfluenceDoc
{
    constructor({...props}) {
        this.docTitle = props.docTitle;
        this.docSummary = props.summary;
        this.childIssues = props.childIssues;
        this.members = props.members
        this.confluenceDocObj = new ConfluenceDocObj({docSummary: this.docSummary, childIssues: props.childIssues, members: props.members});

    }

    createDoc(){
        return new Promise(async (resolve) =>{
            this.confluenceDocObj.getDoc();

            let bodyData = `{
                "spaceId": ${process.env.CONFLUENCESPACEID},
                "status": "draft",
                "title": "${this.docTitle}",
                "body":{
                    "representation": "atlas_doc_format",
                    "value": ${JSON.stringify(JSON.stringify(this.confluenceDocObj.getDoc()))}
                }
            }`

            const response = await api.asUser().requestConfluence(route`/wiki/api/v2/pages`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    ContentType: 'application/json'
                },
                body: bodyData,
            });

            const payload = await response.json();

            //TODO: Add Error Handling
            if(response.status !== 200) {
                console.log(`Error: response status received was ${response.status} and response message is `)
                console.log(payload);
            }


            const data = {
                pageID: payload.id,
                pageTitle: payload.title,
                pageStatus: payload.status,
                spaceID: payload.spaceId,
                revisions: 1,
                numOfTasks: 3,
                tasksCompleted: 0,
                reviewers:this.members
            }

            resolve(data);
        })
    }

}

export default CreateConfluenceDoc;
