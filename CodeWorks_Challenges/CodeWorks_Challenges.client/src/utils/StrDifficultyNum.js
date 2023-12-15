import { logger } from './Logger.js';

//NOTE - Use v-html="difficulty.html" in your template to display the difficulty level in a span tag with the appropriate color.

//NOTE - Use {{ difficulty.text }} in your template to display the difficulty level in plain text.

// REVIEWED - JAKE - This is the switch statement util I was talking about today in the meeting and how it is taking the difficulty with type Number from the backend and parses it into a string...but were you saying this logic should be handled in the backend somehow with our cases of parsing rewards? I'm curious how that would be handled - and if this should also be back-end logic? - AJ

// FIXME [❌ AJ] Bad Practice if only getting html - 🟡 Unless you need this text outside of the DOM this actually makes more sense to simply be a reusable component. I would only abstract this into a function like this if I was adding functionality that could be called from various places. 

export const StrDifficultyNum = (difficulty) => {
  switch (difficulty) {
    case 1:
      return {
        html:
          `
          <img src="../assets/img/easy-difficulty-chart.svg" alt="Easy" style="width: 1.5rem; height: 1.5rem; margin-right: .25rem;"/>
        `,
        text: 'Easy',
      };
    case 2:
      return {
        html:
          `
          <img src="../assets/img/medium-difficulty-chart.svg" alt="Medium" style="width: 1.5rem; height: 1.5rem; margin-right: .25rem;"/>
        `,
        text: 'Medium',
      };
    case 3:
      return {
        html:
          `
          <img src="../assets/img/hard-difficulty-chart.svg" alt="Hard" style="width: 1.5rem; height: 1.5rem; margin-right: .25rem;"/>
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