const openai = require('openai')
const zod = require('openai/helpers/zod')
const z = require("zod")
const {OPEN_AI_KEY} = require('../constants')


const Message = z.object({
    id: z.string(),
    username: z.string(),
    text: z.string()
});

const ChildMessage3 = z.object({
    id: z.string(),
    username: z.string(),
    text: z.string(),
    children: z.array(Message)
});

const ChildMessage2 = z.object({
    id: z.string(),
    username: z.string(),
    text: z.string(),
    children: z.array(ChildMessage3)
});

const ChildMessage1 = z.object({
    id: z.string(),
    username: z.string(),
    text: z.string(),
    children: z.array(ChildMessage2)
});

const Messages = z.object({
    messages: z.array(Message)
});

const Responses = z.object({
    messages: z.array(ChildMessage1)
});

const client = new openai({
    apiKey: OPEN_AI_KEY,
});

const systemPrompt = "You generate test data for a twitter-like application. The messages will have an id field as well as a username and the message content.";

class GptDataGenerator {
    async getParentMessages() {
        const prompt = "Generate some 10 messages for the front page. The message content should be between 100 and 200 characters.";
        const completion = await client.beta.chat.completions.parse({
            model: "gpt-4o-2024-08-06",
            messages: [
                {role: "system", content: systemPrompt},
                {role: "user", content: prompt}
            ],
            response_format: zod.zodResponseFormat(Messages, "message")
        });
        return completion.choices[0].message.parsed
    }

    async getResponseMessages(messages) {
        const prompt = `Given the following message thread:\n ${JSON.stringify(messages)} \n Generate 3 responses between 100 and 200 characters.`
        const completion = await client.beta.chat.completions.parse({
            model: "gpt-4o-2024-08-06",
            messages: [
                {role: "system", content: systemPrompt},
                {role: "user", content: prompt}
            ],
            response_format: zod.zodResponseFormat(Messages, "message")
        });
        return completion.choices[0].message.parsed
    }
    async getResponseMessagesAll(messages) {
        const prompt = `Given the following message:\n ${JSON.stringify(messages)} \n Generate between 3 and 6 responses between 100 and 200 characters. Then continue this pattern 2 or 3 layers deep for each response in the children field`
        const completion = await client.beta.chat.completions.parse({
            model: "gpt-4o-2024-08-06",
            messages: [
                {role: "system", content: systemPrompt},
                {role: "user", content: prompt}
            ],
            response_format: zod.zodResponseFormat(Responses, "message")
        });
        return completion.choices[0].message.parsed
    }
}

module.exports = GptDataGenerator
