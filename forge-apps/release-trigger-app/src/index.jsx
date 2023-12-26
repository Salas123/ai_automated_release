import ForgeUI, {render, Fragment, Text, IssuePanel, Button, useProductContext, useState} from '@forge/ui';
import api, {route} from "@forge/api";
import CreateConfluenceDoc from "./createConfluenceDoc";
import validateTicketStatus from "./utils/ValidateTicketStatus";
import GetIssueData from "./utils/GetIssueData";
import DBConn from "./utils/DBConn";
import GetGroupData from "./utils/GetGroupData";
import AIHelper from "./ai/AIHelper";
import {FindInDB} from "./utils/DB";
import {PackageContent} from "./utils/PackageContent";

async function triggerRelease({...props}){
    // TODO: Add timeout func after
    props.setReleaseStatus('...gathering story tickets...');

    const JQLResponse =  await api.asUser().requestJira(route`/rest/api/2/search?jql=project%20%3D%20${process.env.JIRAPROJCETKEY}%20and%20parent=${props.issueState.issueID}`, {
        headers:{
            'Accept':'application/json'
        }
    });

    const JQLPayload =  await JQLResponse.json();
    const issues = JQLPayload['issues'];

    // filter out required fields
    const childIssues = issues.map((entry) =>{
        const obj = {};
        obj.key = entry.key;
        obj.id = entry.id;
        obj.fields = entry.fields

        return obj;
    });

    if(childIssues.length === 0){
        console.log('No child issues found');
        // TODO: add error handling
    }

    // TODO: Add timeout func after
    props.setReleaseStatus('...validating statuses are marked complete...');

    // validate ticket statuses
    if(!validateTicketStatus({tickets: childIssues, statusToBe: 'Done'})){
        //TODO: add error handling for invalid status for child tickets
        console.log('Invalid status... all ticket statuses must be set to Done')
    }

    // Query members that will be assigned as reviewers
    const memberData = await GetGroupData({groupName: 'release-reviewers'});

    // Query current epic context
    const epicData = await GetIssueData({issueID: props.issueState.issueID});

    // TODO: Add timeout func after
    props.setReleaseStatus('...creating Confluence doc...');

    const ai = new AIHelper({
        apiKey: process.env.AIAPIKEY,
        setReleaseStatus: props.setReleaseStatus,
        aiAssistant: process.env.AIASSISTANTID
    });

    const summary = await ai.createSummary(PackageContent({
        epicDescription: epicData.fields.description.content[0].content[0].text,
        userStoryDescriptions: childIssues.map((issue) => {
            return issue.fields.description;
        })
    }));


    //instance to create a confluence doc
    const createConfluenceDocInstance = new CreateConfluenceDoc({
        docTitle: props.fixVersions[0],
        summary: summary,
        childIssues: childIssues,
        members: memberData
    });

    // TODO: Add timeout func after
    props.setReleaseStatus('...gathering release details to post to DB ...')
    const confluencePageDetails = await createConfluenceDocInstance.createDoc();


    const epicDetails = {
        epicID: epicData.id,
        epicKey: epicData.key,
        childIssues: childIssues
    }

    const DBInst = new DBConn({
      releaseName: props.fixVersions[0],
      confluenceDetails: confluencePageDetails,
      epicDetails: epicDetails
    });

    // TODO: Add timeout func after
    props.setReleaseStatus('...posting details to DB...')
    await DBInst.getDB();

    props.setReleaseState(true);
    props.setContextState(false);

    // TODO: Add timeout func after
    props.setReleaseStatus('...done...')

}

async function checkReleaseState({...props}){
    console.log('Checking if version has already been released...');
    const fixVersions = props.fixVersions;

    const res = await FindInDB({query: fixVersions[0]});
    console.log(res)

    const hasBeenReleased = res.document !== null;
    console.log(`Response from MongoDB: ${fixVersions[0]} has been released: ${hasBeenReleased}`)
    return hasBeenReleased;
}

async function getFixVersions({...props}){
    const response = await api.asUser().requestJira(route`/rest/api/3/issue/${props.issueState.issueID}`);
    const payload = await response.json();
    const fixVersionsObjs = payload['fields']['fixVersions'];
    let fixVersions = [];
    for(let i = 0; i < fixVersionsObjs.length; i++){
        fixVersions.push(fixVersionsObjs[i]['name']);
    }

    return fixVersions;
}

async function checkValidContext({...props}) {

    return !(props.releaseState || props.issueState.issueType !== "Epic");

}

function getFixVersionsString(fixVersionsArr){
    let fixVersionsStr = '';
    for (let i = 0; i < fixVersionsArr.length; i++) {
        fixVersionsStr += fixVersionsArr[i];
    }

    return fixVersionsStr;
}


const App = () => {


    const context = useProductContext();

    const [issueState, setissueState] = useState({
        issueType: context.platformContext.issueType,
        issueID: context.platformContext.issueId,
    });

    const [fixVersions] = useState(async () => await getFixVersions({issueState: issueState}));

    const [releaseState, setReleaseState] = useState(async () => await checkReleaseState({fixVersions: fixVersions}));

    const [contextState, setContextState] = useState(async () => await checkValidContext({
        issueState: issueState,
        releaseState: releaseState
    }));

    const [releaseStatus, setReleaseStatus] = useState(null);


  return (
    <Fragment>
        {contextState ?
            (<Fragment>
                <Text>This epic is ready for release, press below to start release process for the following version(s): {getFixVersionsString((fixVersions))}</Text>
                <Button text={'Start Release Process'}
                        onClick={async () => await triggerRelease({issueState: issueState,
                            fixVersions: fixVersions,
                            setReleaseState: setReleaseState,
                            setContextState: setContextState,
                            setReleaseStatus: setReleaseStatus
                        })}/>
            </Fragment>):
            (
                <Fragment>
                    <Text>Release has been initiated...{releaseStatus}</Text>
                    {
                        /*
                        * TODO: Add handling on checking either if this an incorrect ticket type or this feature has
                        *  already been released
                        * */
                    }
                </Fragment>
            )
        }
    </Fragment>
  );
};

export const run = render(
  <IssuePanel>
    <App />
  </IssuePanel>
);
