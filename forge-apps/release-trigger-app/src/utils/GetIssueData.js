
import api, { route } from "@forge/api";
function GetIssueData({...props}){
    return new Promise(async (resolve) => {

        const response = await api.asUser().requestJira(route`/rest/api/3/issue/${props.issueID}`, {
            headers: {
                'Accept': 'application/json'
            }
        });

        const payload = await response.json()

        resolve(payload);
    })
}

export default GetIssueData;
