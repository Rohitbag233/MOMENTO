
class Api {
    constructor(journal) {
        this.journal = journal;
    }

    async callAIAPI(entries, customPrompt = null) {
        const prompt = customPrompt || this.journal.createAIPrompt(entries);
        
        switch (this.journal.aiSettings.provider) {
            case APP_CONFIG.AI_PROVIDERS.OPENAI:
                return await this.callOpenAI(prompt);
            case APP_CONFIG.AI_PROVIDERS.GROQ:
                return await this.callGroq(prompt);
            case APP_CONFIG.AI_PROVIDERS.XAI:
                return await this.callXAI(prompt);
            case APP_CONFIG.AI_PROVIDERS.ANTHROPIC:
                return await this.callAnthropic(prompt);
            case APP_CONFIG.AI_PROVIDERS.GOOGLE:
                return await this.callGoogle(prompt);
            case APP_CONFIG.AI_PROVIDERS.MISTRAL:
                return await this.callMistral(prompt);
            case APP_CONFIG.AI_PROVIDERS.COHERE:
                return await this.callCohere(prompt);
            case APP_CONFIG.AI_PROVIDERS.AWS_BEDROCK:
                return await this.callAWSBedrock(prompt);
            case APP_CONFIG.AI_PROVIDERS.AZURE_OPENAI:
                return await this.callAzureOpenAI(prompt);
            case 'curl':
                return await this.callCurl(prompt);
            default:
                throw new Error('Unsupported AI provider');
        }
    }

    async callOpenAI(prompt) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.journal.aiSettings.apiKey}`
            },
            body: JSON.stringify({
                model: this.journal.aiSettings.model || 'gpt-4',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 150,
                temperature: 0.7
            })
        });

        if (!response.ok) throw new Error('OpenAI API error');
        const data = await response.json();
        return data.choices[0].message.content;
    }

    async callGroq(prompt) {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.journal.aiSettings.apiKey}`
            },
            body: JSON.stringify({
                model: this.journal.aiSettings.model || 'llama-3.1-8b',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 150,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Groq API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
        }
        const data = await response.json();
        return data.choices[0].message.content;
    }

    async callXAI(prompt) {
        const response = await fetch('https://api.x.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.journal.aiSettings.apiKey}`
            },
            body: JSON.stringify({
                model: this.journal.aiSettings.model || 'grok-beta',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 150,
                temperature: 0.7
            })
        });

        if (!response.ok) throw new Error('xAI API error');
        const data = await response.json();
        return data.choices[0].message.content;
    }

    async callAnthropic(prompt) {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.journal.aiSettings.apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: this.journal.aiSettings.model || 'claude-3-sonnet',
                max_tokens: 150,
                messages: [{ role: 'user', content: prompt }]
            })
        });

        if (!response.ok) throw new Error('Anthropic API error');
        const data = await response.json();
        return data.content[0].text;
    }

    async callGoogle(prompt) {
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.journal.aiSettings.apiKey}`
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    maxOutputTokens: 150,
                    temperature: 0.7
                }
            })
        });

        if (!response.ok) throw new Error('Google API error');
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }

    async callMistral(prompt) {
        const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.journal.aiSettings.apiKey}`
            },
            body: JSON.stringify({
                model: this.journal.aiSettings.model || 'mistral-large',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 150,
                temperature: 0.7
            })
        });

        if (!response.ok) throw new Error('Mistral API error');
        const data = await response.json();
        return data.choices[0].message.content;
    }

    async callCohere(prompt) {
        const response = await fetch('https://api.cohere.ai/v1/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.journal.aiSettings.apiKey}`
            },
            body: JSON.stringify({
                model: this.journal.aiSettings.model || 'command',
                message: prompt,
                max_tokens: 150,
                temperature: 0.7
            })
        });

        if (!response.ok) throw new Error('Cohere API error');
        const data = await response.json();
        return data.text;
    }

    async callAWSBedrock(prompt) {
        // Note: AWS Bedrock requires AWS SDK and proper authentication
        // This is a simplified implementation - users would need to set up AWS credentials
        throw new Error('AWS Bedrock requires AWS SDK setup. Please use AWS CLI or SDK for authentication.');
    }

    async callAzureOpenAI(prompt) {
        // Note: Azure OpenAI requires endpoint URL in addition to API key
        // Users need to provide the endpoint URL in the API key field or as a separate field
        const endpoint = this.journal.aiSettings.endpoint || 'https://your-resource.openai.azure.com';
        const response = await fetch(`${endpoint}/openai/deployments/${this.journal.aiSettings.model}/chat/completions?api-version=2023-05-15`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': this.journal.aiSettings.apiKey
            },
            body: JSON.stringify({
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 150,
                temperature: 0.7
            })
        });

        if (!response.ok) throw new Error('Azure OpenAI API error');
        const data = await response.json();
        return data.choices[0].message.content;
    }

    async callCurl(prompt) {
        if (!this.journal.aiSettings.curlCommand) {
            throw new Error('cURL command not configured');
        }

        try {
            // Parse the cURL command to extract components
            const curlData = this.parseCurlCommand(this.journal.aiSettings.curlCommand);
            
            // Replace the prompt in the data
            let requestBody = curlData.data;
            if (requestBody && requestBody.includes('"content":')) {
                // Replace the content field with the new prompt
                requestBody = requestBody.replace(/"content":\s*"[^"]*"/, `"content": "${prompt.replace(/"/g, '\\"')}"`);
            } else if (requestBody) {
                // If no content field found, try to replace the entire message content
                requestBody = requestBody.replace(/"messages":\s*\[[^\]]*\]/, `"messages": [{"role": "user", "content": "${prompt.replace(/"/g, '\\"')}"}]`);
            }

            // Make the actual API call
            const response = await fetch(curlData.url, {
                method: curlData.method || 'POST',
                headers: curlData.headers,
                body: requestBody
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`cURL API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();
            
            // Handle different response formats
            if (data.choices && data.choices[0] && data.choices[0].message) {
                return data.choices[0].message.content;
            } else if (data.content && data.content[0] && data.content[0].text) {
                return data.content[0].text;
            } else if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                return data.candidates[0].content.parts[0].text;
            } else {
                return JSON.stringify(data);
            }
        } catch (error) {
            throw new Error(`cURL Error: ${error.message}`);
        }
    }

    parseCurlCommand(curlCommand) {
        // Remove 'curl' and any leading/trailing whitespace
        let command = curlCommand.replace(/^curl\s+/, '').trim();
        
        const result = {
            url: '',
            method: 'POST',
            headers: {},
            data: ''
        };

        // Extract URL (usually the last argument that doesn't start with -)
        const urlMatch = command.match(/(?:^|\s)(https?:\/\/[^\s]+)(?:\s|$)/);
        if (urlMatch) {
            result.url = urlMatch[1];
            command = command.replace(urlMatch[0], '');
        }

        // Extract method
        const methodMatch = command.match(/-X\s+(\w+)/);
        if (methodMatch) {
            result.method = methodMatch[1];
            command = command.replace(methodMatch[0], '');
        }

        // Extract headers
        const headerMatches = command.matchAll(/-H\s+"([^"]+)"/g);
        for (const match of headerMatches) {
            const header = match[1];
            const colonIndex = header.indexOf(':');
            if (colonIndex > 0) {
                const key = header.substring(0, colonIndex).trim();
                const value = header.substring(colonIndex + 1).trim();
                result.headers[key] = value;
            }
        }

        // Extract data
        const dataMatch = command.match(/-d\s+'([^']+)'/);
        if (dataMatch) {
            result.data = dataMatch[1];
        } else {
            const dataMatch2 = command.match(/-d\s+"([^"]+)"/);
            if (dataMatch2) {
                result.data = dataMatch2[1];
            }
        }

        return result;
    }
}
