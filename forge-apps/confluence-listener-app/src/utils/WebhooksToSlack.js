import api from "@forge/api";

const PostTasksComplete = async (releaseObj) => {
    const response = await api.fetch(process.env.SLACK_WEBHOOK_URL,
        {
            method: "POST",
            headers: {
                ContentType: "application/json"
            },
            body: JSON.stringify({
                "blocks": [
                    {
                        "type": "header",
                        "text": {
                            "type": "plain_text",
                            "text": ":robot_face: Release Bot :robot_face:",
                            "emoji": true
                        }
                    },
                    {
                        "type": "rich_text",
                        "elements": [
                            {
                                "type": "rich_text_section",
                                "elements": [
                                    {
                                        "type": "text",
                                        "text": "Release: "
                                    },
                                    {
                                        "type": "text",
                                        "text": releaseObj.releaseName,
                                        "style": {
                                            "bold": true
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "rich_text",
                        "elements":[{
                            "type": "rich_text_section",
                            "elements":[
                                {
                                    "type": "text",
                                    "text": "Update Message: "
                                },
                                {
                                    "type": "text",
                                    "text": "All tasks have been completed! ",
                                    "style":{
                                        "bold": true
                                    }
                                },
                                {
                                    "type": "emoji",
                                    "name": "ballot_box_with_check"
                                }
                            ]
                        }]
                    },
                    {
                        "type": "rich_text",
                        "elements":[
                            {
                                "type": "rich_text_section",
                                "elements":[
                                    {
                                        "type": "text",
                                        "text": "Link: "
                                    },
                                    {
                                        "type": "link",
                                        "url": `${process.env.ATLASSIAN_SPACE}/wiki/spaces/${process.env.SPACE_NAME}/pages/${releaseObj.pageID}/${encodeURI(releaseObj.releaseName)}`
                                    }
                                ]
                            }
                        ]
                    }
                ]
            })
        });

    console.log(`Posting to slack webhook...Response status: ${response.status} ${response.statusText}`);

}


const PostPageCreated = async (releaseObj) =>{
    const response = await api.fetch(process.env.SLACK_WEBHOOK_URL,
        {
            method: "POST",
            headers: {
                ContentType: "application/json"
            },
            body: JSON.stringify({
                "blocks": [
                    {
                        "type": "header",
                        "text": {
                            "type": "plain_text",
                            "text": ":robot_face: Release Bot :robot_face:",
                            "emoji": true
                        }
                    },
                    {
                        "type": "rich_text",
                        "elements": [
                            {
                                "type": "rich_text_section",
                                "elements": [
                                    {
                                        "type": "text",
                                        "text": "Release: "
                                    },
                                    {
                                        "type": "text",
                                        "text": releaseObj.releaseName,
                                        "style": {
                                            "bold": true
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "rich_text",
                        "elements":[{
                            "type": "rich_text_section",
                            "elements":[
                                {
                                    "type": "text",
                                    "text": "Update Message: "
                                },
                                {
                                    "type": "text",
                                    "text": "A release page has been published to Confluence! ",
                                    "style":{
                                        "bold": true
                                    }
                                },
                                {
                                    "type": "emoji",
                                    "name": "writing_hand"
                                }
                            ]
                        }]
                    },
                    {
                        "type": "rich_text",
                        "elements":[
                            {
                                "type": "rich_text_section",
                                "elements":[
                                    {
                                        "type": "text",
                                        "text": "Link: "
                                    },
                                    {
                                        "type": "link",
                                        "url": `${process.env.ATLASSIAN_SPACE}/wiki/spaces/${process.env.SPACE_NAME}/pages/${releaseObj.pageID}/${encodeURI(releaseObj.releaseName)}`
                                    }
                                ]
                            }
                        ]
                    }
                ]
            })
        });

    console.log(`Posting to slack webhook...Response status: ${response.status} ${response.statusText}`);
}

export default {PostTasksComplete, PostPageCreated};
