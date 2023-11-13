import { logger } from './Logger.js';

//NOTE - Use v-html="difficulty.html" in your template to display the difficulty level in a span tag with the appropriate color.

//NOTE - Use {{ difficulty.text }} in your template to display the difficulty level in plain text.

//FIXME - JAKE - This is the switch statement util I was talking about today in the meeting and how it is taking the difficulty with type Number from the backend and parses it into a string...but were you saying this logic should be handled in the backend somehow with our cases of parsing rewards? I'm curious how that would be handled - and if this should also be back-end logic? - AJ
export const StrDifficultyNum = (difficulty) => {
  switch (difficulty) {
    case 1:
      return {
        html:
        `
          <span class="text-light">Difficulty: <span class="text-success">Easy</span></span>
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
          <span class="text-light">Difficulty: <span class="text-danger position-relative" style="top: .05rem; font-size: .95rem;">Hard</span></span>
        `,
        text: 'Hard',
      };
    case 4:
      return {
        html:
        `
          <span class="text-light">Difficulty: <span class="text-danger position-relative" style="top: .05rem; font-size: .95rem;">Very Hard</span></span>
        `,
        text: 'Very Hard',
      };
    case 5:
      return {
        html:
        `
          <span class="text-light">Difficulty: <span class="text-danger position-relative" style="top: .05rem; font-size: .95rem;">Expert</span></span>
        `,
        text: 'Expert',
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