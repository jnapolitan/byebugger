# ByeBugger

### ByeBugger

Single-player educational software engineering game.

- [Live Site]()
- [Background and Overview](#background-and-overview)
- [Technologies](#technologies)
- [Functionality and MVP](#functionality-and-mvp)
- [Accomplished Over the Weekend](#accomplished-over-the-weekend)
- [Group Members and Work Breakdown](#group-members-and-work-breakdown)

<!-- * [Additional Planned Features](#additional-planned-features)
* [Credits](#credits)
* [Group Members](#group-members) -->

## Background and Overview

ByeBugger is a single-player educational game that teaches players software engineering concepts through the act of solving bugs. Running into bugs and learning how to debug your code are integral parts to the software development process. ByeBugger introduces its player to this process by having him/her run through a map to catch bugs. When caught, these bugs present themselves as real-life computer science bugs, which the player needs to solve to gain points and move up the leader board. Will you catch 'em all and reign above all the other ByeBuggers out there?

<!-- We will need to:
- store user and info (time of when they played, their score) in database
-  -->

## Functionality and MVP

- [ ] Game lobby with player sign up/login (User Auth)
- [ ] Library of questions/bugs
- [ ] Library of primer/learning pages (precedes game start, to prime user on some concepts they may encounter throughout the game)
- [ ] Graphic assets
  - [ ] Bugs
  - [ ] Human player
  - [ ] Textures/environment
  - [ ] Life-line objects
- [ ] Player control logic
- [ ] Bug trajectory logic
- [ ] Game logic
  - [ ] Point system
- [ ] Production README

#### Bonus Features

- [ ] Level difficulty logic
  - [ ] Adjust speed of bugs
  - [ ] Introduce obstacle logic
    - [ ] Product manager logic
  - [ ] Final level:
    - [ ] Beat Heroku boss
    - [ ] Player looks for master key to defeat boss

## Technologies

ByeBugger is implemented using the MERN stack (MongoDB, Express, React, and Node.js). The game is rendered using HTML5 Canvas and WebGL/three.js and real-time updates are tracked with ...??

#### Backend: MongoDB/Express

User Model: handle, email, password
Stats Model: user id, score

#### Frontend: React/Node.js

## Accomplished over the Weekend

- Set up database
- Proposal README
- Implement user authorization on database backend

## Group Members & Work Breakdown

- [Julian Napolitan](https://github.com/jnapolitan)
- [Sue Park](https://github.com/spark1031)
- [Eric To](https://github.com/eric-to)

<!-- ### August 26 - August 27

- Build skeleton React site - **Kyle**
- Build the skeleton Chrome extension - **Nick**
- Investigate Google API methods and test collection of data - **Jeremiah**
- Begin setting up D3 visualization - **Kavian**

### August 27

- Continue and complete the basic work from Sunday - **All**
- Build login view on Chrome extension - **Nick/Jeremiah**
- Decide which data to save in database, and how to structure it **All will discuss**
- Write and test methods to save browser data to database - **Jeremiah/Nick**

### Day 2

- Connect user authorization database to Chrome front end - **Kyle**
- Connect React-based Web application to database - **Kyle/Kavian**
- Meet to decide duties for next three days

### Day 3

- Continue implementation of visualization on Web application using D3 library
- Add methods to fetch data for popups in visualization
- Run tests of completed Chrome extension

### Day 4

- Complete visualization of data on Web application
- Add popups to visualization
- Make seed/demo data and visualizations for guest user

### Day 5

- Add search capability to Web application
- Add search capability to Chrome extension
- Make demo page (required for Chrome extensions -- may not be required since this project has a live page too)

### Day 6

- Complete Production README.md - **Jeremiah**
- Refine design/CSS
- Finish testing and debugging - **All team members** -->
