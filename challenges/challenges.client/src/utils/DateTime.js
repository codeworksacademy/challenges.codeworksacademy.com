export const FormatDateAndTime = {
  name: 'FormatDateAndTime',
  props: {
    date: {
      type: String,
      required: true,
    },
  },
  computed: {
    formattedDate() {
      return new Date(this.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    },
    formattedTime() {
      return new Date(this.date).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
      });
    },
  }
}
