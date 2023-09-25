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

export class Event {
  constructor(data) {
    this.id = data.id
    this.creatorId = data.creatorId
    this.creator = data.creator
    this.name = data.name
    this.description = data.description
    this.coverImg = data.coverImg
    this.capacity = data.capacity
    this.startDate = formatDateAndTime(data.startDate)
    this.endDate = formatDateAndTime(data.endDate)
    this.startTime = data.startTime
    this.endTime = data.endTime
    this.location = data.location
    this.type = data.type
    this.isCancelled = data.isCancelled
    this.challenges = data.challenges
    this.participantCount = data.participantCount
  }
}