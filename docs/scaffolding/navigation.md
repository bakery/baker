---
title: Scaffolding Navigation
permalink: /scaffolding/navigation.html
---
# Scaffolding navigation

Navigation modules are a special case of containers. Navigation is probably one of the first elements of the application that you will want to generate 

## Running navigation generator

```
npm run generate
? Choose the generator to use
  Component
  Container
❯ Navigation
  Saga
  Model
```

There are a few parameters to configure navigation element

```
? What should your container be called? <-- name for the navigation component
? Which boilerplate do you want to use? <-- navigation type to use [1]
? Do you need separate versions of this component for iOS and Android? <-- platform specific customization
```

[1] Baker currently supports 2 navigation templates: Cards and Tabs.
