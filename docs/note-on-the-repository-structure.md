# Application Repository Structure

After setting up your application with Baker, you will notice that the resulting project includes several subprojects that could be theoretically split into separate repositories. Instead we have deliberately opted for a monorepository approach. The only exception to this is a collection of house keeping scripts and configs grouped under [baker-scripts](https://github.com/thebakeryio/baker-scripts) package.

The reasons for the monorepository approach are the following:

- mobile app and server code collocation allows you to iterate quicker and easier crossing boundaries between server and client
- coding conventions and configs are shared among different parts of the project (baker-mobile app-server app)
- most of the development dependencies are pinned in the top level package.json with submodules relying on these tools for common house keeping tasks
- exposing baker internal tools in the same repository allows you customize it with ease and know exactly what is going on under the hood        