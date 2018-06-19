# 5 Minute Opening Pitch

- Teachers and students struggling to keep up with new curriculum
- We're having ICT and science teachers forced to teach computing **picture of sighing/frustrated teachers/students**
- The changes most drastically affect key stage 3 students and non-computing teachers, making computing courses compulsory and impacting students and their choices as they transition to GCSE

Existing solutions:
- On the teacher side we envisage Nancy - chemistry teacher, struggling to teach computing, persona, moodogram specifically pointing out failings of existing systems
- Don't provide facilities for teachers to give feedback or review student solutions
- On the student side we see students like Mark who may be forced to take computing due to the new curriculum, despite not being particularly interested.
- With existing solutions, Mark is left to do a lot of the work independently
- Programming not very intuitive/heavy syntax, platforms like codecademy may fail to engage, particularly because computing now compulsory. **screenshot showing codecademy and its failings**

We now present you EduBot - the visual programmatic learning environment for key stage 3 students and teachers.
- EduBot gives a clean intuitive interface to students
- Introduces the core programming concepts in a concise and visual way, using a programming game format where students apply the concepts to help a robot complete objectives **demo play page**
- Teachers can track the progress of students throughout the concepts, view their solutions (as well as sample solutions to aid understanding) and provide feedback to the students **demo feedback**

# Demonstration

Demo dialogue should be focused on user interactions with the application and how it solves the identified problems.

Sign up as new student (prefilled fields):
- (EduBot intro?)
- Look at concept introduction - (teachers wanted a very engaging and visual page, we added the video, the blocks diagrams and highlighted key definitions, mention bitesize)
- Select tutorial
- Walk through level intro screen - (similar feedback to above, stripped out walls of text)
- Open tutorial level - (we observed students initial interactions and found them not knowing where to click, so we developed a tutorial)
- Play tutorial

Switch to teacher:
- Add new class
- Add student to class
- View their page and their score
- (It is these kinds of features that the likes of codecademy does not provide)

Login as more experienced student:
- Pick more difficult level
- Start level and then return to intro to look at description again
- Return to level (see persistent solution, students stated that it was frustrating to lose their solutions when leaving the page)
- Finish level and get 2 stars (we received feedback that it would aid learning and iterating over solutions if students could see where they could improve their solutions, we added the breakdown of robot actions taken and blocks used)

Switch to teacher:
- Navigate to student
- View sample solution (we felt it would help non-specialist teachers by providing them with sample solutions demonstrating how best to tackle the problems)
- View student solution (feature not present in other solutions)
- Give feedback (this was requested early in development as a must have feature)

Switch to student:
- View the feedback

# The Technical Side

## Languages and technologies used:
- The standard: JavaScript, HTML, CSS
- Handlebars - helped reduce duplication in our HTML pages and allowed us to generate customised pages for each user. Provided useful features out of the box, like ifs and elses
- Node.js + Express - we initially chose Python + Django but switched to Node.js + Express as it allowed more interoperability between the backend and the frontend, with a common language between both. This would allow us to extend our backend functionality to do things like running user solutions for verification purposes. 
- Blockly library for providing the visual programming interface for our levels
- Finally, we used ...
  - jQuery - helping us manipulate HTML and CSS
  - Postgres SQL - for our database

## Application structure and implementation

Walk them through diagram. Model-view-controller style for backend, some of the tables on the DB, frontend structure.

A significant behind the scenes challenge was the level editor. We needed to create a suitable and flexible representation of a level as well as an editor that allows us to build the levels, add hints and add behind the scenes parameters relating to the actions and blocks needed to complete/score the level.

Frontend issues included:
- Finding a suitable format for storing and sending levels, and devising a system for restoring them in the correct form.
- Making the robot move in a realistic manner was a challenge ...
- Creating the blocks necessary for EduBot and translating them into suitable EduBot instructions was a challenge ...


# Evaluation

Show those pictures of my mum. We feel we've developed something that has benefited our user group and we've been really excited because of the enthusiasm we've received when showing it to teachers and students alike.

What we've produced provides a good foundation for teaching programming concepts and integrates the management capabilities we found lacking in alternative solutions. It currently mirrors the curriculum as presented by BBC bitesize. A large part of what we would like to add to EduBot revolves around the extent to which it educates students. We would want levels covering:
- Functions and variables
- Data structures and algorithms
- Create a new level representation for trees

We've considered how to take students from visual programming to text based programming, and would like to explore having a code viewer in later levels.






