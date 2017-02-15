# SPRINT 1

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

### Necessary feature:
Request authentication for the creation of a room & joining a room

### Stretch goals
**Problem**: Participation
1. Text service for participants:
  + Write a piece of text that everyone else can see
  + Names being attached to messages
2. Level of authentication - determine identity of:
  + Presenter
  + Participant(s)

## Permissions Model
This needs to be considered _before_ we flesh out our user journeys. In this project, we need to bake in the potential for our users' roles to change.

Roles & Permissions      |   Mentor   |   Moderator   |   Student   |
------------|--------------|--------------|-----------|
**Send AV**  | Y | N | N     
**Receive AV**  | N | Y | N  
**Text**  | Y | Y | Y      
