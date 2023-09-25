function formatDateAndTime(date) {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  const formattedTime = new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric'
  })
  return {
    formattedDate,
    formattedTime
  }
}

export class Challenge {
  constructor(data) {
    this.id = data.id
    this.creatorId = data.creatorId
    this.creator = data.creator
    this.name = data.name
    this.description = data.description
    this.coverImg = data.coverImg
    this.createdAt = formatDateAndTime(data.createdAt)
    this.updatedAt = formatDateAndTime(data.updatedAt)
    this.supportLinks = data.supportLinks
    this.pointValue = data.pointValue
    this.answers = data.answers
    this.isCancelled = data.isCancelled
    this.event = data.event ? new Event(data.event) : null
  }
}

