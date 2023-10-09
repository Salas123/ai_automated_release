import ForgeUI, { render, Fragment, Text, IssuePanel, Button, useProductContext} from '@forge/ui';
import api, {route} from "@forge/api";


async function startReleaseProcess (issueID) {

    const response = await api.asUser().requestJira(route`/rest/api/2/issue/${issueID}`, {
        headers:{
            'Accept':'application/json'
        }
    });


    const response2 = await api.asUser().requestJira(route `/rest/api/3/issueLinkType`, {
        headers:{
            'Accept': 'application/json'
        }
    });


    const payload = await response.json();
    console.log('Sub tasks Properties:')
    console.log(payload['fields']['issuelinks']);
    const fixVersionsArr = payload["fields"]["fixVersions"]


    let fixVersions = '';

    for (let i = 0; i < fixVersionsArr.length; i++) {
        let versionObj = fixVersionsArr[i];
        fixVersions += versionObj["name"]
    }

}

const checkValidContext = (context) => {
    if (context.platformContext.issueType !== "Epic")
        return(
            <Fragment>
                <Text>This is not a valid issue to add this app, must be an "Epic"..</Text>
                <Button text={"Start"} onClick={() => startReleaseProcess(context.platformContext.issueId)}/>
            </Fragment>
        );
    else
        return(
            <Fragment>
                <Text>Release is ready to start deploy, press to start release process</Text>
                <Button text={"Start"} onClick={() => startReleaseProcess(context.platformContext.issueId)}/>
            </Fragment>
        );

}


const App = () => {
    const context = useProductContext();

  return (
    <Fragment>
        {checkValidContext(context)}
    </Fragment>
  );
};

export const run = render(
  <IssuePanel>
    <App />
  </IssuePanel>
);
