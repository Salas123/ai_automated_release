class ConfluenceDocObj{
    constructor({...props}) {

        this.childIssues = props.childIssues;
        this.docSummary = props.docSummary;
        this.members = props.members;
        this.content = this.addToTable(this.childIssues);
        this.memberReviewers = this.addReviewers(this.members)
        /*
        *  TODO: Add tasks for each reviewer assigned to release
        * */

        /*
        *  Doc obj created from ADF Builder on Atlassian:
        *  https://developer.atlassian.com/cloud/jira/platform/apis/document/playground/#adf-builder
        * */
        this.docObj = {
            "version": 1,
            "type": "doc",
            "content": [
                {
                    "type": "heading",
                    "attrs": {
                        "level": 2
                    },
                    content: [{
                        "type": "text",
                        "text": "Reviewers"
                    }]
                },
                {
                    "type": "taskList",
                    "attrs": {
                        "localId": "48e25296-4e2f-41d9-86e7-9dcb20cf5773"
                    },
                    "content": this.memberReviewers
                },
                {
                    "type": "heading",
                    "attrs": {
                        "level": 2
                    },
                    "content": [
                        {
                            "type": "text",
                            "text": "Overview"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": this.docSummary
                        }
                    ]
                },
                {
                    "type": "table",
                    "attrs": {
                        "isNumberColumnEnabled": false,
                        "layout": "default",
                        "localId": "25eb81eb-c603-4038-ab83-78efaf7a64f0"
                    },
                    "content": this.content
                },
                {
                    "type": "heading",
                    "attrs": {
                        "level": 2
                    },
                    "content": [
                        {
                            "type": "text",
                            "text": "Test Reports"
                        }
                    ]
                },
                {
                    "type": "heading",
                    "attrs": {
                        "level": 3
                    },
                    "content": [
                        {
                            "type": "text",
                            "text": "QA Checklist"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "Enter here link…"
                        }
                    ]
                },
                {
                    "type": "heading",
                    "attrs": {
                        "level": 3
                    },
                    "content": [
                        {
                            "type": "text",
                            "text": "Test Plan and Results"
                        }
                    ]
                },
                {
                    "type": "table",
                    "attrs": {
                        "isNumberColumnEnabled": false,
                        "layout": "default",
                        "localId": "e7ba4314-6c2d-412b-b06c-693c20b04d2b"
                    },
                    "content": [
                        {
                            "type": "tableRow",
                            "content": [
                                {
                                    "type": "tableHeader",
                                    "attrs": {},
                                    "content": [
                                        {
                                            "type": "paragraph",
                                            "content": [
                                                {
                                                    "type": "text",
                                                    "text": "QA Tests",
                                                    "marks": [
                                                        {
                                                            "type": "strong"
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "type": "tableHeader",
                                    "attrs": {},
                                    "content": [
                                        {
                                            "type": "paragraph",
                                            "content": [
                                                {
                                                    "type": "text",
                                                    "text": "Testing Area",
                                                    "marks": [
                                                        {
                                                            "type": "strong"
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "type": "tableHeader",
                                    "attrs": {},
                                    "content": [
                                        {
                                            "type": "paragraph",
                                            "content": [
                                                {
                                                    "type": "text",
                                                    "text": "Pass/Fail",
                                                    "marks": [
                                                        {
                                                            "type": "strong"
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "tableRow",
                            "content": [
                                {
                                    "type": "tableCell",
                                    "attrs": {},
                                    "content": [
                                        {
                                            "type": "paragraph",
                                            "content": []
                                        }
                                    ]
                                },
                                {
                                    "type": "tableCell",
                                    "attrs": {},
                                    "content": [
                                        {
                                            "type": "paragraph",
                                            "content": []
                                        }
                                    ]
                                },
                                {
                                    "type": "tableCell",
                                    "attrs": {},
                                    "content": [
                                        {
                                            "type": "paragraph",
                                            "content": []
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "tableRow",
                            "content": [
                                {
                                    "type": "tableCell",
                                    "attrs": {},
                                    "content": [
                                        {
                                            "type": "paragraph",
                                            "content": []
                                        }
                                    ]
                                },
                                {
                                    "type": "tableCell",
                                    "attrs": {},
                                    "content": [
                                        {
                                            "type": "paragraph",
                                            "content": []
                                        }
                                    ]
                                },
                                {
                                    "type": "tableCell",
                                    "attrs": {},
                                    "content": [
                                        {
                                            "type": "paragraph",
                                            "content": []
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "heading",
                    "attrs": {
                        "level": 3
                    },
                    "content": [
                        {
                            "type": "text",
                            "text": "Automation Test Results"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "Enter automation tests here…"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": []
                },
                {
                    "type": "heading",
                    "attrs": {
                        "level": 2
                    },
                    "content": [
                        {
                            "type": "text",
                            "text": "Conclusion"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "Enter conclusion consensus here…"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": []
                }
            ]
        }

    }

    addToTable(issues){

        // Header info description
       let contentArr = [{
           "type": "tableRow",
           "content": [
               {
                   "type": "tableHeader",
                   "attrs": {},
                   "content": [
                       {
                           "type": "paragraph",
                           "content": [
                               {
                                   "type": "text",
                                   "text": "Features",
                                   "marks": [
                                       {
                                           "type": "strong"
                                       }
                                   ]
                               }
                           ]
                       }
                   ]
               },
               {
                   "type": "tableHeader",
                   "attrs": {},
                   "content": [
                       {
                           "type": "paragraph",
                           "content": [
                               {
                                   "type": "text",
                                   "text": "Descriptions",
                                   "marks": [
                                       {
                                           "type": "strong"
                                       }
                                   ]
                               }
                           ]
                       }
                   ]
               },
               {
                   "type": "tableHeader",
                   "attrs": {},
                   "content": [
                       {
                           "type": "paragraph",
                           "content": [
                               {
                                   "type": "text",
                                   "text": "Status",
                                   "marks": [
                                       {
                                           "type": "strong"
                                       }
                                   ]
                               }
                           ]
                       }
                   ]
               }
           ]
       }]

        // for each child issue add it as its own row to the content array
       issues.forEach((issue) => {
           contentArr.push({
               "type": "tableRow",
               "content": [
                   {
                       "type": "tableCell",
                       "attrs": {},
                       "content": [
                           {
                               "type": "paragraph",
                               "content": [
                                   {
                                       "type": "text",
                                       "text": `https://jsiiaiautomated.atlassian.net/browse/${issue.key}`,
                                       "marks": [
                                           {
                                               "type": "link",
                                               "attrs": {
                                                   "href": `https://jsiiaiautomated.atlassian.net/browse/${issue.key}`
                                               }
                                           }
                                       ]
                                   }]
                           }]
                   },
                   {
                       "type": "tableCell",
                       "attrs": {},
                       "content": [
                           {
                               "type": "paragraph",
                               "content": [
                                   {
                                       "type": "text",
                                       "text": issue.fields.description
                                   }]
                           }]
                   },
                   {
                       "type": "tableCell",
                       "attrs": {},
                       "content": [
                           {
                               "type": "paragraph",
                               "content": [
                                   {
                                       "type": "text",
                                       "text": issue.fields.status.name
                                   }]
                           }]
                   }
               ]
           })
        })

        return contentArr;
    }

    addReviewers(members){
        let tasks = [];
        members.forEach(mem =>{
            tasks.push({
                "type": "taskItem",
                "attrs": {
                    "localId": "426ae12e-2825-46b9-833e-71ba6da3ef08",
                    "state": "TODO"
                },
                "content": [
                    {
                        "type": "mention",
                        "attrs": {
                            "id": mem.accountId,
                            "text": `@${mem.name}`,
                            "userType": "APP"
                        }
                    }
                ]
            })
        });

        return tasks;
    }

    getDoc(){
        return this.docObj;
    }
}


export default ConfluenceDocObj;
