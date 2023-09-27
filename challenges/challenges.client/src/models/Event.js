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
    this.roles = data.roles
    this.name = data.name //
    this.description = data.description //
    this.coverImg = data.coverImg //
    this.supportLinks = data.supportLinks //
    // this.sponsors = data.sponsors
    this.capacity = data.capacity
    this.startDate = formatDateAndTime(data.startDate)
    this.endDate = formatDateAndTime(data.endDate)
    this.startTime = data.startTime
    this.endTime = data.endTime
    this.location = data.location
    this.type = data.type
    this.challenges = data.challenges
    this.isCancelled = data.isCancelled
    this.isFinished = data.isFinished
    this.participantCount = data.participantCount
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }
}