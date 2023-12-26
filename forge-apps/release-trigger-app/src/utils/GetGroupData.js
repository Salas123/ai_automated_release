import api, {route} from "@forge/api";

function GetGroupData({...props}){
    return new Promise(async resolve => {
        const groupsResponse = await api.asUser().requestJira(route`/rest/api/2/groups/picker?query=${props.groupName}`, {
            headers: {
                'Accept': 'application/json'
            }
        });

        console.log(`Querying Group for Reviewers - Response: ${groupsResponse.status} ${groupsResponse.statusText}`);
        const groupPayload = await groupsResponse.json();
        /*
        * TODO: Add error handling on making sure only one group is returned
        * */
        const groupID = groupPayload.groups[0].groupId;


        const membersResponse = await api.asUser().requestJira(route`/rest/api/2/group/member?groupId=${groupID}`);
        const membersPayload = await membersResponse.json()
        /*
        * TODO: Add error handling on making sure there are users in the group and they're "active"
        * */
        const members = membersPayload.values.map(mems =>{
            let obj = {};
            obj.accountId = mems.accountId;
            obj.name = mems.displayName;

            return obj;
        })

        resolve(members);
    });
}

export default GetGroupData;
