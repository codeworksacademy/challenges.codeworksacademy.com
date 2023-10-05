import { logger } from './Logger.js';

//NOTE - Use v-html="difficulty.html" in your template to display the difficulty level in a span tag with the appropriate color.

//NOTE - Use {{ difficulty.text }} in your template to display the difficulty level in plain text.

export const StrDifficultyNum = (difficulty) => {
  switch (difficulty) {
    case 1:
      return {
        html:
        `
          '<span class="text-light">Difficulty: <span class="text-success">Easy</span></span>'
        `,
        text: 'Easy',
      };
    case 2:
      return {
        html:
        `
          <span class="text-light">Difficulty: <span class="text-warning">Medium</span></span>
        `,
        text: 'Medium',
      };
    case 3:
      return {
        html:
        `
          <span class="text-light">Difficulty: <span class="text-danger">Hard</span></span>
        `,
        text: 'Hard',
      };
    default:
      return {
        html: 
        `
          <span class="text-secondary" style="font-style: italic;">Difficulty: N/A</span>
        `,
        text: 'Not Specified',
      };
  }
};