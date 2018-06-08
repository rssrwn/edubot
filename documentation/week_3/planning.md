# Student Side

We received feedback from our users last week that the aesthetic of the game needs improvement. Lucy felt that the robot was quite gloomy and wouldn't really appeal to key stage 3 students. The students felt that the robot was bland.

We aim to improve the engagement of students by making the robot more visually engaging. We plan to do this by anthropomorphising the robot: giving him eyes and arms. If time permits, we'll add animation to make him feel more alive - to try and introduce a sense of connection.

# Teacher Side

Our overall focus this week is on providing a version of the teacher's class management screens for them to play around with. The feedback from sharing these screens with teachers will guide us on how to make the screens intuitive and usable. We may also learn some additional features that the teachers would find useful. They may have other class management software for example, and we may be able to learn from their experience with this software.

More specifically, we plan to implement the following screens:
- Landing page for the application
- Teacher mode dashboard with options to view existing classes and add students to classes
- Teacher mode level selection screen
- Concept and level introduction screens visited from the level selection screen
- Sample solution screen for a level/levels

On a technical note, we would like to switch from writing pages in html and JavaScript to using a templating language and dynamically generated pages. This will be necessary to produce the customised pages and to keep the behind the scenes components modular.

However, we need to experiment with some different templating frameworks (we are considering Handlebars.js, Mustache and Jade). It may also take some time restructuring our work so far to use the new framework.

Consequently, in case we do not manage to get a working system for the above, we plan to create a limited version of the screens using html that will allow us to demonstrate to the teachers how the class management will work.

## Features Implemented

Shared:
- Each level now has its own set of blocks
- Made buttons simpler and more user friendly
- Added more levels

Teachers:
- Teachers can now view example solutions and attempt levels
- Teachers can now view classes and add members. Mocked it up with grid layout of classes to make efficient use of space, teacher thought

Students:
- Level introduction screen. Mocked it up. Got feedback on it, improved the screen to better convey the information.
- Added stars to show level success

Mocked up:
- Student level selection screen, fleshing out next week
