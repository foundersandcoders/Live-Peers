# SPRINT 1

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

For breakdown into user stories, see github issues.

### Stretch goals
**Problem:** Participation  

**Feature 1:** Text service for participants
  + Write a piece of text that everyone else can see
  + Names being attached to messages

**Feature 1:** Authentication  

Determine identity of:
  + Presenter
  + Participant(s)

## Wireframes
**Mentor journey**  
Login page  
Mentor view  
Mentor view (Student and Moderator Details)  

**Student journey**  
Student Join Page  
Student View  

**Moderator journey**  
(Starts as student journey)  
Student view (Enter Pin to View Mentor)  
Moderator View  

## Permissions Model

Roles & Permissions      |   Mentor   |   Moderator   |   Student   |
------------|--------------|--------------|-----------|
**Send AV**  | Y | N | N     
**Receive AV**  | N | Y | N  
**Text**  | Y | Y | Y      
