# Google Gemini Plugin for Hexabot Chatbot Builder

The Gemini Plugin allows you to integrate Google Generative AI into your Hexabot chatbot workflows, enabling the creation of generative AI blocks. This plugin provides settings for customizing responses, including controlling the maximum length of the generated content and using recent conversation messages as context for generating more relevant replies.

[Hexabot](https://hexabot.ai/) is an open-source chatbot / agent solution that allows users to create and manage AI-powered, multi-channel, and multilingual chatbots with ease. If you would like to learn more, please visit the [official github repo](https://github.com/Hexastack/Hexabot/).

## Prerequisites

Before setting up the Gemini Plugin, you will need to generate an API token from Google’s Generative AI platform.

1. Go to the [Google Generative AI API page](https://ai.google.dev/gemini-api).
2. Select **"Develop in your own environment"** to generate your API token.
3. Once you have your API token, you can proceed to configure the global gemini settings within Hexabot (Settings > Gemini).

## Installation
Run the following command which will download and install the Gemini plugin:
```sh
cd ~/projects/my-chatbot
npm install hexabot-plugin-gemini
hexabot dev
```

## Configuration

The Gemini Plugin provides several customizable settings that can be configured through the Hexabot admin interface. The following settings are available:

- **Model**: The model to be used for generating responses (e.g., `gemini-1.5-flash`).
- **Temperature**: The temperature controls the degree of randomness in token selection. Lower temperatures are good for prompts that require a more deterministic response, while higher temperatures can lead to more diverse or creative results. A temperature of 0 is deterministic, meaning that the highest probability response is always selected (default: `0.8`).
- **Candidate Count**: Specifies the number of generated responses to return. Currently, this value can only be set to 1 (default: `1`).
- **Max Output Tokens**: Sets the maximum number of tokens to include in a candidate response (default: `1000`).
- **Top-K**: Changes how the model selects tokens for output. A topK of 1 means the selected token is the most probable among all the tokens in the model's vocabulary (greedy decoding), while a topK of 3 means that the next token is selected from among the 3 most probable using the temperature (default: `40`).
- **Top-P**: Changes how the model selects tokens for output. Tokens are selected from the most to least probable until the sum of their probabilities equals the topP value (default: `0.95`).
- **Presence Penalty**: Presence penalty applied to the next token's logprobs if the token has already been seen in the response (default: `0.0`).
- **Frequency Penalty**: Frequency penalty applied to the next token's logprobs, multiplied by the number of times each token has been seen in the response so far (default: `0.0`).
- **Response LogProbs**: If True, export the logprobs results in the response (default: `false`).

## How to Use

1. Go to the Hexabot Visual Editor.
2. Drag-n-drop the Gemini Plugin under "Custom Blocks" into the canvas.
3. Double-click on the block to edit 

## Contributing

We welcome contributions from the community! Whether you want to report a bug, suggest new features, or submit a pull request, your input is valuable to us.

Please refer to our contribution policy first : [How to contribute to Hexabot](https://github.com/Hexastack/Hexabot/blob/main/CONTRIBUTING.md)

[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](https://github.com/Hexastack/Hexabot/blob/main/CODE_OF_CONDUCT.md)

Feel free to join us on [Discord](https://discord.gg/rNb9t2MFkG)

## License

This software is licensed under the GNU Affero General Public License v3.0 (AGPLv3) with the following additional terms:

1. The name "Hexabot" is a trademark of Hexastack. You may not use this name in derivative works without express written permission.
2. All derivative works must include clear attribution to the original creator and software, Hexastack and Hexabot, in a prominent location (e.g., in the software's "About" section, documentation, and README file).

---

*Happy Chatbot Building!*