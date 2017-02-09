# Live-Peers

1. [Vision](#VISION)
2. [Permissions Model](#Permissions-Model)
3. [User journeys](#User-journeys)

## VISION

Enable real-time, peer-to-peer participation and sharing of content.

[![Join the chat at https://gitter.im/foundersandcoders/Live-Peers](https://badges.gitter.im/foundersandcoders/Live-Peers.svg)](https://gitter.im/foundersandcoders/Live-Peers?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

### Relevant scenarios in FAC
+ Presentations from external speakers
+ Project show & tells, whether this is from alumni or students
+ Workshops - during curriculum from internal mentors
+ Code alongs
+ Sharing internal mentoring sessions
+ Business meetings

#### Problems
Sharing presentations/workshops (across campuses)

Enabling participation:
+ Q & A - Can't put your hand up and be noticed by the presenter/mentor if you're not physically in the room
+ Voting - Coming through text chat makes it difficult to count
+ Screen Sharing - Presentations and code alongs - don't have any control over which tab/window the presenter is on or whether they are going to fast for you

## SPRINT 1
**Problem**: Sharing presentation content

**Content to include:** Presenters' audio, video & screencast.

**Necessary feature:** Request authentication for the creation of a room & joining a room

**UX/UI concerns:** Displaying high definition presentation materials (screen cast) at the same time as presenter video/audio. Choose between:
+ Ordinary camera shot of everything at once
+ Two tabs - one with the presenter in the room, another with the slides/code
+ Display both on one tab: one half of screen for presenter, one half for slides/code
+ Full screen cast with audio overlay

### Stretch goals
**Problem**: Participation
1. Text service for participants:
  + Write a piece of text that everyone else can see
  + Names being attached to messages
2. Level of authentication - determine identity of:
  + Presenter
  + Participant(s)

## Beyond this sprint:
+ Add subtitles to audio (This particular accessibility concern is unfortunately outside the scope of the first two week sprint)
+ Preserving live content - copy & paste-able code / docs.
  + Not just a screencast of the presenter's text editor, but a hackpad-style / figma-style multiple author capability
  + Read-only version i.e. include admin rights
+ Additions to text service
  + incorporate markdown syntax and is linkable to github repos and issues
  + turn messages into Q&A format
+ Voting service
+ Record metrics e.g. number of attendees - could be used to pitch idea for funding


## Permissions Model
This needs to be considered _before_ we flesh out our user journeys. In this project, we need to bake in the potential for our users' roles to change.

Roles & Permissions      |   Mentor   |   Moderator   |   Student   |
------------|--------------|--------------|-----------|
**Send AV**  | Y | N | N     
**Receive AV**  | N | Y | N  
**Text**  | Y | Y | Y      

## User journeys

**As a** mentor
**I would like to** share my content (across campuses)
**So that** paricipation is not limited by location

**As a** moderator
**I would like to** access content and be able to share it
**So that** those in my location can participate

**As a** student
**I would like to** access remote content and share my own messages
**So that** I can actively participate in the learning experience
