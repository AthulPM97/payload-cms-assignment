import type { LexicalCommand } from 'lexical'

import { createCommand } from 'lexical'

export const TOGGLE_SUPERSCRIPT_WITH_MODAL_COMMAND: LexicalCommand<any | null> = createCommand(
  'TOGGLE_SUPERSCRIPT_WITH_MODAL_COMMAND',
)