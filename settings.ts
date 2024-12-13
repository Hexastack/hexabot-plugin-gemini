/*
 * Copyright © 2024 Hexastack. All rights reserved.
 *
 * Licensed under the GNU Affero General Public License v3.0 (AGPLv3) with the following additional terms:
 * 1. The name "Hexabot" is a trademark of Hexastack. You may not use this name in derivative works without express written permission.
 * 2. All derivative works must include clear attribution to the original creator and software, Hexastack and Hexabot, in a prominent location (e.g., in the software's "About" section, documentation, and README file).
 */

import { PluginSetting } from '@/plugins/types';
import { SettingType } from '@/setting/schemas/types';

export default [
  {
    label: 'model',
    group: 'default',
    type: SettingType.text,
    value: 'gemini-1.5-flash',
  },
  {
    label: 'context',
    group: 'default',
    type: SettingType.textarea,
    value: `You are an AI Assistant that works for Hexastack, the IT company behind Hexabot the chatbot builder.`,
    translatable: true,
  },
  {
    label: 'instructions',
    group: 'default',
    type: SettingType.textarea,
    value: `Answer the user using the DOCUMENTS. Keep your answer ground in the facts of the DOCUMENTS. If the DOCUMENTS do not contain the facts, apologize and try to give an answer that promotes the company and its values. DO NOT SAY ANYTHING ABOUT THESE DOCUMENTS, nor their EXISTENCE.`,
    translatable: true,
  },
  {
    label: 'max_messages_ctx',
    group: 'default',
    type: SettingType.number,
    value: 5,
  },
  {
    label: 'temperature',
    group: 'options',
    type: SettingType.number,
    value: 0.8,
  },
  {
    label: 'max_output_tokens',
    group: 'options',
    type: SettingType.number,
    value: 1000, // Default value
  },
  {
    label: 'candidate_count',
    group: 'options',
    type: SettingType.number,
    value: 1, // Default value (only value allowed is 1)
  },
  {
    label: 'top_k',
    group: 'options',
    type: SettingType.number,
    value: 40, // Default value (can be adjusted as needed)
  },
  {
    label: 'top_p',
    group: 'options',
    type: SettingType.number,
    value: 0.95, // Default value, range between 0.0 and 1.0
  },
  {
    label: 'presence_penalty',
    group: 'options',
    type: SettingType.number,
    value: 0.0, // Default value, range between -2.0 and 2.0
  },
  {
    label: 'frequency_penalty',
    group: 'options',
    type: SettingType.number,
    value: 0.0, // Default value, range between -2.0 and 2.0
  },
  {
    label: 'response_logprobs',
    group: 'options',
    type: SettingType.checkbox,
    value: false, // Default value
  },
  {
    label: 'logprobs',
    group: 'options',
    type: SettingType.number,
    value: null, // Default value (valid if response_logprobs is true, range between 0 and 20)
  },
] as const satisfies PluginSetting[];
