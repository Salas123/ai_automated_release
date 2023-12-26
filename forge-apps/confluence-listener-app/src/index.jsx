import queryDB from "./QueryDB";
import slackWebhook from "./utils/WebhooksToSlack";

function parseEventType(eventType) {

    const eventTypeComponents = eventType.split(':');
    return {
        event: eventTypeComponents[eventTypeComponents.length - 2],
        eventComponent: eventTypeComponents[eventTypeComponents.length - 1]
    };
}


export async function run(event, context) {

    /**
     *  TODO: Add conditional handling for events that are not related to releases... Query Releases DB if no, doc is returned
     *  then it is a not a valid release doc
     * */

    console.log(event);

    const eventObj = {
        ...parseEventType(event.eventType),
        spaceID: event.content.space.id,
        spaceKey: event.content.space.key,
        spaceName: event.content.space.name,
        pageStatus: event.task ? undefined : event.content.status,
        pageID: event.content.id,
        pageTitle: event.content.title,
        taskContent: event.task ? event.task.title : undefined,
        taskStatus: event.task ? event.task.status : undefined,
        taskID: event.task ? event.task.id : undefined
    }

    const dbDoc = await queryDB.GetReleaseByPageId({pageID: eventObj.pageID});


    //
    if (eventObj.event === 'created') {
        console.log('Something was created...');
        switch (eventObj.eventComponent) {
            case 'page': {
                console.log('...a page was created');


                await queryDB.UpdateDocRevisionByID({docID: dbDoc.id});

                await queryDB.UpdateDocPageStatusByID({docID: dbDoc.id, data: eventObj.pageStatus})
                /*
                *  status of page transitioned away from "Draft" to published
                *  What to do if page is created:
                *       --> notify communication channel
                *
                * */


                /**
                 *  TODO: when task is created save contentID and upload to MongoDB
                 *
                 *   query task by contentID and PageTitle
                 *
                 *   when page is created save info on task
                 * */

                await slackWebhook.PostPageCreated({
                    releaseName: eventObj.pageTitle,
                    pageID: eventObj.pageID
                });

                return;
            }
            case 'task': {
                console.log('...a task was created');

                /*
                *  What to do if page is created:
                *       --> add task into respective entry in the DB, if there's an additional review outside of initial DB entry
                *
                * */

                let currTasksObjs = dbDoc.confluenceDoc.tasks.tasksObjs;

                if (currTasksObjs === undefined || (`${eventObj.taskID}` > currTasksObjs.length - 1)) {

                    /**
                     *  !!! Important: Inorder to get status of specific task, query index - 1
                     * */
                    let taskObj = {
                        taskStatus: eventObj.taskStatus
                    };

                    await queryDB.UpdateDocTaskObjByID({docID: dbDoc.id, data: taskObj});
                }

                return;
            }
        }
    } else if (eventObj.event === 'updated') {
        console.log('Something was updated');
        switch (eventObj.eventComponent) {
            case 'page': {
                console.log('...a page was updated');

                await queryDB.UpdateDocRevisionByID({docID: dbDoc.id});


                /*
                * What to do on updates to page:
                *      -> if status of release is not under "QA review" && all tasks completed:
                *           -> full release on github
                *           -> create QA checklist and update DB that it's under QA review
                *
                * */

                break;

            }
            case 'task': {
                /*
                *  What to do on updates to task:
                *  -> if completed:
                *       -> update db status of respective task: completed
                *
                * */
                console.log('...a task was updated');

                await queryDB.UpdateDocTaskStatusCompleteByID({
                    docID: dbDoc.id,
                    taskID: (parseInt(eventObj.taskID) - 1),
                    data: {taskStatus: eventObj.taskStatus}
                });


                break;

            }
        }


        const taskObjs = await queryDB.GetAllTasksFromDocByID({docID: dbDoc.id});
        let allTasksDone = true;
        taskObjs.map((task) => {
            allTasksDone = allTasksDone && (task.taskStatus === 'complete');
        });

        allTasksDone ? await slackWebhook.PostTasksComplete({
            releaseName: eventObj.pageTitle,
            pageID: eventObj.pageID
        }) : console.log('All tasks are not complete yet...');


    }


}

