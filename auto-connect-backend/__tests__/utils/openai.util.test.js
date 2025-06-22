const { parseUsingLLM } = require("../../utils/openai.util");
const OpenAI = require("openai");

jest.mock("openai");

describe("parseUsingLLM", () => {
    let createMock;

    beforeEach(() => {
        createMock = jest.fn();
        OpenAI.mockImplementation(() => ({
            chat: {
                completions: {
                    create: createMock,
                },
            },
        }));
    });

    test("should return parsed JSON when API responds with valid JSON", async () => {
        const mockResponse = {
            choices: [
                {
                    message: {
                        content: JSON.stringify({ success: true, data: "test" }),
                    },
                },
            ],
        };

        createMock.mockResolvedValue(mockResponse);

        const result = await parseUsingLLM("Hello", "Respond with JSON");
        expect(result).toEqual({ success: true, data: "test" });

        expect(createMock).toHaveBeenCalledWith({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "Respond with JSON" },
                { role: "user", content: "Hello" },
            ],
            temperature: 0.7,
            max_tokens: 1000,
            response_format: { type: "json_object" },
        });
    });

    test("should throw an error if API returns invalid JSON", async () => {
        const mockResponse = {
            choices: [
                {
                    message: {
                        content: "Invalid JSON string",
                    },
                },
            ],
        };

        createMock.mockResolvedValue(mockResponse);

        await expect(parseUsingLLM("Hello", "Respond with JSON"))
            .rejects
            .toThrow(/OpenAI API returned invalid JSON/);
    });

    test("should throw an error if OpenAI API call fails", async () => {
        createMock.mockRejectedValue(new Error("API Error"));

        await expect(parseUsingLLM("Hello", "Respond with JSON"))
            .rejects
            .toThrow(/ChatGPT request failed: API Error/);
    });
});
