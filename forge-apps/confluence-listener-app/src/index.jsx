import QueryDB from "./QueryDB";

function parseEventType(eventType){
    const eventTypeComponents = eventType.split(':');
    return {
        event: eventTypeComponents[eventTypeComponents.length - 2],
        eventComponent: eventTypeComponents[eventTypeComponents.length - 1]
    };
}

export async function run(event, context) {
    const eventObj = {
        ...parseEventType(event.eventType),
        spaceID: event.content.space.id,
        spaceKey: event.content.space.key,
        spaceName: event.content.space.name,
        contentID: event.content.id,
        pageTitle: event.content.title,
    }

    if(eventObj.event === 'created'){
        console.log('Something was created...');
        switch (eventObj.eventComponent){
            case 'page':{
                /*
                *  What to do if page is created:
                *       --> notify communication channel
                *
                * */

                console.log('...a page was created');
                return;
            }
            case 'task':{
                console.log('...a task was created');
                /*
                *  What to do if page is created:
                *       --> add task into respective entry in the DB
                *
                * */
                return;
            }
        }
    }
    else if(eventObj.event === 'updated'){
        console.log('Something was updated')
        switch (eventObj.eventComponent){
            case 'page':{
                console.log('...a page was updated');
                /*
                * What to do on updates to page:
                *      -> if status of release is not under "QA review" && all tasks completed:
                *           -> full release on github
                *           -> create QA checklist and update DB that it's under QA review
                *
                * */
                return;
            }
            case 'task':{
                /*
                *  What to do on updates to task:
                *  -> if completed:
                *       -> update db status of respective task: completed
                *
                * */
                console.log('...a task was updated')
                return;
            }
        }
    }

}

