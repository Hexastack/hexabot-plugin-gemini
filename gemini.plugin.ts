import { Content, GoogleGenerativeAI } from '@google/generative-ai'; // Importing Google Generative AI
import { Injectable } from '@nestjs/common';

import { Block } from '@/chat/schemas/block.schema';
import { Context } from '@/chat/schemas/types/context';
import {
  OutgoingMessageFormat,
  StdOutgoingTextEnvelope,
} from '@/chat/schemas/types/message';
import { MessageService } from '@/chat/services/message.service';
import { ContentService } from '@/cms/services/content.service';
import { LoggerService } from '@/logger/logger.service';
import { BaseBlockPlugin } from '@/plugins/base-block-plugin';
import { PluginService } from '@/plugins/plugins.service';

import { GEMINI_PLUGIN_SETTINGS } from './settings';

@Injectable()
export class GeminiPlugin extends BaseBlockPlugin<
  typeof GEMINI_PLUGIN_SETTINGS
> {
  private generativeAI: GoogleGenerativeAI;

  constructor(
    pluginService: PluginService,
    private logger: LoggerService,
    private contentService: ContentService,
    private messageService: MessageService,
  ) {
    super('gemini', GEMINI_PLUGIN_SETTINGS, pluginService);

    this.template = { name: 'Gemini RAG Block' };

    this.effects = {};
  }

  private async getMessagesContext(
    context: Context,
    maxMessagesCtx = 5,
  ): Promise<Content[]> {
    // Retrieve the last few messages for context
    const recentMessages = await this.messageService.findLastMessages(
      context.user,
      maxMessagesCtx,
    );

    return recentMessages.map((m) => {
      return {
        role: 'sender' in m && m.sender ? `user` : `model`,
        parts: [
          {
            text:
              'text' in m.message && m.message.text
                ? m.message.text
                : JSON.stringify(m.message),
          },
        ],
      };
    });
  }

  async process(block: Block, context: Context, _convId: string) {
    const ragContent = await this.contentService.textSearch(context.text);
    const args = this.getArguments(block);
    const client = this.getInstance(args.token);

    const systemInstruction = [
      `CONTEXT: ${args.context}`,
      `DOCUMENTS:`,
      ...ragContent.map(
        (curr, index) =>
          `\tDOCUMENT ${index + 1} \n\t\tTitle: ${curr.title} \n\t\tData: ${curr.rag}`,
      ),
      `INSTRUCTIONS:`,
      args.instructions,
    ].join('\n');

    const model = client.getGenerativeModel({
      model: args.model,
      systemInstruction,
      generationConfig: {
        /* 
        =====================================================================
        Check the documentation for more details on the generation config 
        https://ai.google.dev/api/generate-content#v1beta.GenerationConfig 
        =====================================================================
        */

        // controls the randomness of the output. Use higher values for more creative responses,
        // and lower values for more deterministic responses. Values can range from [0.0, 2.0].
        temperature: args.temperature,
        maxOutputTokens: args.num_ctx || 256,
        responseMimeType: 'text/plain',
      },
    });
    const history = await this.getMessagesContext(
      context,
      args.max_messages_ctx,
    );
    const chat = model.startChat({
      history,
    });

    const result = await chat.sendMessage(context.text);

    const envelope: StdOutgoingTextEnvelope = {
      format: OutgoingMessageFormat.text,
      message: {
        text: result.response.text(),
      },
    };
    return envelope;
  }

  private getInstance(token: string) {
    if (this.generativeAI) {
      return this.generativeAI;
    }

    try {
      this.generativeAI = new GoogleGenerativeAI(token);
      return this.generativeAI;
    } catch (err) {
      this.logger.warn('Gemini: Unable to instantiate GoogleGenerativeAI', err);
    }
  }
}
