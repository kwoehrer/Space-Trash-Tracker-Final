
# DETAILED PROJECT DESCRIPTION
The space trash tracker provides 3D, geospatial visuals that represent space debris and satellites currently orbiting our planet. It works utilizing TLEs (two-line element sets) that are obtained by querying Celestrak and Space-Track. After obtaining the TLEs, the application utilizes Satellite.js to parse relevant information such as position and velocity. This information is then passed into an open-source geospatial visualizer, Cesium, and displayed in a way that can be digested by average users. The web application was developed with JavaScript, Node JS, HTML, and CSS. This program offers a potential solution to avoid damage from collision with space debris and satellites. We hope that this web application will provide a means to show the current severity of pollution by debris in space and inspire innovators to tackle the challenge of eliminating space debris.

# HACKATHON JOURNEY
Space Apps challenged our team to dive into the topic of full stack web application. The majority of our hackathon team had never used Javascript as the core language for a program before, and many had never touched web development. Additionally, a large portion of our team had never participated in a hackathon before. We learned a lot about working in a team development environment as well as working better under time constraints for completing a project. Our team learned about working with package managers and module bundlers, working with multiple frameworks at once and properly passing data between them, and we collectively increased both the breadth and depth of our JavaScript and Node JS knowledge. It was challenging and rewarding to go through iterations of a product and approach something that finally worked. We would like to thank NASA for hosting this event, allowing us to participate, and providing us inspiration through the challenge prompts. We would also like to thank the Milky Way Tech Hub for providing an amazing space for us to collaborate as a team in person, giving us the chance to publicly present our project, providing support and encouragement to us throughout our journey, and feeding us delicious food!

# POST HACKATHON KRISCHAN PERSONAL TO DO LIST

1. Create a script that parses all irrelevant information from the initial query for faster load times.
2. Create a script that better automates the query (contact spacetrack/celestrak and see if we can get access to their api)
3. Allow users to search for specific objects and then track that object.
4. Allow users to input hypthothetical TLE data sets

