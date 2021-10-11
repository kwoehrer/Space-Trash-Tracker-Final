# AWARDS
Local Level: **First Place at Local Milwaukee NASA Hackathon Hosted by Milky Way Tech Hub**

Global Level: Still being ranked and rated.

# LIVE WEB APPLICATION
https://kwoehrer.uwmsois.com/ROPV/
A stable build that displays 7,000 objects slow load.

https://kwoehrer.uwmsois.com/ROPV/DisplayAll.html
An experimental build that displays all the objects from the Celestrak/Space-Track query. Loads slightly faster than stable build but still needs to be better optimized.

# DETAILED PROJECT DESCRIPTION
The space trash tracker provides 3D, geospatial visuals that represent space debris and satellites currently orbiting our planet. It works utilizing TLEs (two-line element sets) that are obtained by querying Celestrak and Space-Track. After obtaining the TLEs, the application utilizes Satellite.js to parse relevant information such as position and velocity. This information is then passed into an open-source geospatial visualizer, CesiumJS, and displayed in a way that can be digested by your average user. The web application was developed with JavaScript, Node JS, HTML, and CSS. This program offers a potential solution to avoid damage from collision with space debris and satellites. We hope that this web application will provide a means to show the current severity of pollution by debris in space and inspire innovators to tackle the challenge of eliminating space debris.

# HACKATHON JOURNEY
Space Apps challenged our team of six members to dive into the topic of full stack web application. The majority of our hackathon team had never used Javascript as the core language for a program before, and many had never touched web development. Additionally, a large portion of our team had never participated in a hackathon before. We learned a lot about working in a team development environment as well as working better under time constraints for completing a project. Our team learned about working with package managers and module bundlers, working with multiple frameworks at once and properly passing data between them, and we collectively increased both the breadth and depth of our JavaScript and Node JS knowledge. It was challenging and rewarding to go through iterations of a product and approach something that finally worked. We would like to thank NASA for hosting this event, allowing us to participate, and providing us inspiration through the challenge prompts. We would also like to thank the Milky Way Tech Hub for hosting the local Milwaukee NASA hackathon as well as providing an amazing space for us to collaborate as a team in person, giving us the chance to publicly present our project, providing support and encouragement to us throughout our journey, and, most importantly, feeding us delicious food! 

# POST HACKATHON KRISCHAN PERSONAL TO DO LIST

1. ~~Create a script that parses all irrelevant information from the initial query for faster load times.~~
2. Create a script that better automates the query (contact spacetrack/celestrak and see if we can get access to their api)
3. Allow users to search for specific objects and then track that object.
4. Allow users to input hypthothetical TLE data sets.
5. Possible bug with new update-- Preloader not properly working. Currently figuring out why.

# POST HACKATHON KRISCHANS COMPLETE ADDITIONS 
1. ~~Better optimized our loops for faster loading. (We can load 7,000 objects now instead of 3,000).~~ The web application now displays 10811 oribiting objects. Load time is  shorter than our initial display of 3000 objects but still too long for my standards.
2. Created a backend script that parses irrelevant information from  the "GP" JSON that was obtained from the query on the celestrak/space-track database.

      a. Now the live web application only utilizes OBJECT_TYPE and TLE fields of the initial JSON query result.
      
      b. For added functionality to the web application, I could revisit what information is parsed into the "parsedTLEList.json" (This is packaged together with the main script on the live web application)
      
3. Created a html/css layout that is user friendly.
4. Created a preloader for the web application.
5. Further utilized the cesiumJS library to show object names when clicked.

      a. Displaying the object name directly on the cesium viewer model caused frame lag so we used the current implementation of viewing names instead.
      
      b. Added a portion to script that changes TLE notation to normal english (For example, Deb -> Debris)
      
