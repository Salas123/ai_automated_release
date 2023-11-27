import api from "@forge/api";

class AIHelper{
    #AIAPIKey;
    constructor({...props}) {
        this.#AIAPIKey = props.apiKey;
        this.setReleaseStatus = props.setReleaseStatus;
        this.availableAssistants = this.getAnyExistingAssistants();
        this.runStatus = '';
    }

    async getAnyExistingAssistants(){
        const response = await api.fetch( "https://api.openai.com/v1/assistants?order=desc&limit=20",{
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.#AIAPIKey}`,
                "OpenAI-Beta": "assistants=v1"
            }
        })

        const payload = await response.json()

        return await payload.data.map((assit) => {
            let obj = {};
            obj.id = assit.id;
            obj.name = assit.name;
            obj.description = assit.description;
            obj.instructions = assit.instructions;

            return obj;
        })
    }

    timeoutFn(ms){
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    }
    async pollRunStatus({...props}){
        console.log(`Run ID: ${props.run_id} Thread ID: ${props.thread_id}`)
        const response = await api.fetch(`https://api.openai.com/v1/threads/${props.thread_id}/runs/${props.run_id}`,{
            method: "GET",
            headers: {
                "Authorization": `Bearer ${this.#AIAPIKey}`,
                "Content-Type": "application/json",
                "OpenAI-Beta": "assistants=v1",
            }
        });
        const payload = await response.json();
        this.runStatus = payload.status;

        console.log(`Counter: ${props.counter}`)

        if(this.runStatus !== 'completed'){
            // 5 secs to poll again
            await this.timeoutFn(5000);
            await this.pollRunStatus({...props, counter: props.counter + 1})
        }

    }

    async createSummary(content){
        this.setReleaseStatus('...retrieving AI assistants...');
        const assistants = await this.availableAssistants;

        const runResponse = await api.fetch(`https://api.openai.com/v1/threads/runs`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${this.#AIAPIKey}`,
                "Content-Type": "application/json",
                "OpenAI-Beta": "assistants=v1",
            },
            body: JSON.stringify({
            "assistant_id": assistants[1].id,
            "thread": {
                "messages": [
                    {"role": "user", "content": content}
                ]
            }
        })
    })
        console.log(`Response status: ${runResponse.status}`)
        /*
        * TODO: Error handling on invalid status returned
        * */

        const runObj = await runResponse.json();
        this.runStatus = runObj.status;

        this.setReleaseStatus('...creating summarization for confluence doc...');
        await this.pollRunStatus({thread_id: runObj.thread_id, run_id: runObj.id, counter: 1});

        const messageResponse = await api.fetch(`https://api.openai.com/v1/threads/${runObj.thread_id}/messages`,{
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${this.#AIAPIKey}`,
                "Content-Type": "application/json",
                "OpenAI-Beta": "assistants=v1",
            }
        })
        console.log(`Messages Response: ${messageResponse.status}`)

        const messsagePayload = await messageResponse.json();

        return messsagePayload.data[0].content[0].text.value;

}
}

export default AIHelper;
