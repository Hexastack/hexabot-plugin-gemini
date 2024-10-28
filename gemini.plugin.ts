/*
 * Copyright © 2024 Hexastack. All rights reserved.
 *
 * Licensed under the GNU Affero General Public License v3.0 (AGPLv3) with the following additional terms:
 * 1. The name "Hexabot" is a trademark of Hexastack. You may not use this name in derivative works without express written permission.
 * 2. All derivative works must include clear attribution to the original creator and software, Hexastack and Hexabot, in a prominent location (e.g., in the software's "About" section, documentation, and README file).
 */

import { Injectable } from '@nestjs/common';

import { Block } from '@/chat/schemas/block.schema';
import { Context } from '@/chat/schemas/types/context';
import {
  OutgoingMessageFormat,
  StdOutgoingTextEnvelope,
} from '@/chat/schemas/types/message';
import { MessageService } from '@/chat/services/message.service';
import { ContentService } from '@/cms/services/content.service';
import GeminiLlmHelper from '@/contrib/extensions/helpers/hexabot-helper-gemini/index.helper';
import { HelperService } from '@/helper/helper.service';
import { HelperType } from '@/helper/types';
import { LoggerService } from '@/logger/logger.service';
import { BaseBlockPlugin } from '@/plugins/base-block-plugin';
import { PluginService } from '@/plugins/plugins.service';
import { PluginBlockTemplate } from '@/plugins/types';

import GEMINI_PLUGIN_SETTINGS from './settings';

@Injectable()
export class GeminiPlugin extends BaseBlockPlugin<
  typeof GEMINI_PLUGIN_SETTINGS
> {
  template: PluginBlockTemplate = { name: 'Gemini RAG Block' };

  constructor(
    pluginService: PluginService,
    private logger: LoggerService,
    private contentService: ContentService,
    private messageService: MessageService,
    private helperService: HelperService,
  ) {
    super('gemini-plugin', pluginService);
  }

  getPath(): string {
    return __dirname;
  }

  async process(block: Block, ctx: Context, _convId: string) {
    const ragContent = await this.contentService.textSearch(ctx.text);
    const { model, instructions, context, max_messages_ctx, ...options } =
      this.getArguments(block);
    const geminiHelper = this.helperService.use(
      HelperType.LLM,
      GeminiLlmHelper,
    );

    const systemInstruction = [
      `CONTEXT: ${context}`,
      `DOCUMENTS:`,
      ...ragContent.map(
        (curr, index) =>
          `\tDOCUMENT ${index + 1} \n\t\tTitle: ${curr.title} \n\t\tData: ${curr.rag}`,
      ),
      `INSTRUCTIONS:`,
      instructions,
    ].join('\n');

    const history = await this.messageService.findLastMessages(
      ctx.user,
      max_messages_ctx,
    );
    const text = await geminiHelper.generateChatCompletion(
      ctx.text,
      model,
      systemInstruction,
      history,
      options,
    );

    const envelope: StdOutgoingTextEnvelope = {
      format: OutgoingMessageFormat.text,
      message: {
        text,
      },
    };
    return envelope;
  }
}
