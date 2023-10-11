import ForgeUI, {render, Fragment, Text, IssuePanel, Button, useProductContext, useState} from '@forge/ui';
import api, {route} from "@forge/api";

// how to implement...
// 1. check context
// 2. check release
// 3. if not of the above, then
// display button (if button pressed then trigger flag)

async function getAPI(...props){
    const project = 'JSII'
    console.log(`Issue ID: ${props[0].issueID}`)
    const JQLResponse =  await api.asUser().requestJira(route`/rest/api/2/search?jql=project%20%3D%20${project}%20and%20parent=${props[0].issueID}`, {
        headers:{
            'Accept':'application/json'
        }
    });

    const JQLPayload =  await JQLResponse.json();
    const childIssues = JQLPayload['issues'];

    if(childIssues.length === 0){
        console.log('No child issues found');
        // TODO: add error handling
    }

    const issueResponse = await api.asUser().requestJira(route`/rest/api/2/issue/${props[0].issueID}`, {
        headers:{
            'Accept':'application/json'
        }
    });

    const issuePayload = await issueResponse.json();
    console.log(issuePayload['fields']['fixVersions']);

}
function checkValidContext(...props) {

    if (props[0].releaseFlag || props[0].issueType !== "Epic"){
        // TODO: query fix versions and see if they have already been released
        return false;
    }
    else
        return true;

}

const App = () => {


    const context = useProductContext();
    const [appState, setAppState] = useState({
        releaseFlag: false,
        issueType: context.platformContext.issueType,
        issueID: context.platformContext.issueId,
    });
    const [contextState] = useState(checkValidContext(appState));

  return (
    <Fragment>
        {contextState ?
            (<Fragment>
                <Text>This epic is ready for release, press below to start release process </Text>
                <Button text={'Start'} onClick={async () => await getAPI(appState)}/>
            </Fragment>):
            (
                <Fragment>
                    <Text>This is not a valid issue or this epic has already been released</Text>
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
