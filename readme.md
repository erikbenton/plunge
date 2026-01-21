# Plunge - Aquatic Adventures

This is the "Plunge - Aquatic Adventures" site. It is place where Users can "name and review" locations for underwater exploration such as: scuba, snorkeling, and free diving.

Users can share information about their favorite underwater sites. They can upload their own pictures, pick the specific location on a map, and add a detailed description of what's available at the area. Users can also review the plunge sites to let others know how they enjoyed the spot.

I created this because one of my favorite hobbies is scuba diving, and it is fairly difficult to get good information on spots for diving if you aren't talking to guides or professional divers. By it's nature, diving and finding out what's beneath the water is a bit of an exploratory sport, but the variability in underwater environments also makes it difficult to scope out potential treasures or know how to prepare for a given location. This site aims to bridge that gap and help people share what they've found to make the subaquatic more accessible.

Please visit a live version of the site here: [Plunge](https://plunge-a0hjb6esdugdeuee.westus2-01.azurewebsites.net/)
*Note: This is on the Azure Free Tier and there can bit a bit of "warm up" if the Web App went "cold".

# How It's Made

The goal for this was to keep it simple and see what could be done with just "plain" HTML, CSS, and JS. A major focus was to learn more about the security details involved in going to a public, production environment such as: defining a Content Security Policy, cleaning User inputs to prevent XSS, protecting vendor API Keys, etc.

## Stack

I used the following technology stack:
* Database: **MongoDB**
* Server: **[Express](https://www.npmjs.com/package/express)**
* UI: **[EJS](https://www.npmjs.com/package/ejs)**
* Env: **Node**

## Services & APIs

The following vendor services and APIs were used to support the app:
* [MongoDB Atlas](https://www.mongodb.com/): used for the cloud database.
* [Cloudinary](https://cloudinary.com/): used for storing uploaded User images.
* [MapTiler](https://www.maptiler.com/): used for showing maps in the UI.

## Design/Architecture

This app is based on the Model-View-Controller (MVC) app architecture. It uses an [Express](https://www.npmjs.com/package/express) server to define the controllers, [Mongoose](https://www.npmjs.com/package/mongoose) with [Joi](https://www.npmjs.com/package/joi) to define the models & schema, and [EJS](https://www.npmjs.com/package/ejs) as the templater/View-Engine to "inject" JS into the HTML views.

## Deployment

Plunge is deployed and hosted on Azure's Free Tier for Web Apps using an Ubuntu + Node container.

The deployment is handled via GitHub Actions (see the workflow yaml file).

# Setting up Local Environment

I tried to make setting up a local environment for developing easy by using a Docker compose file to help setup the necessary external connections. Currently there is only the MongoDB local instance that runs in the container, but this helps keep dev machines clean.

To set up the local environment:

1) Clone/download/fork the repo
2) Install necessary node modules with: ```npm install```
3) Initiate the Plunge Docker container: ```docker compose up -d```
    * The ```-d``` flag means "detached" from the terminal instance
4) Seed the local MongoDB using: ```npm run seed```
5) Start up the dev server on Port 3003: ```npm run dev```

To shut it all down:

1) Stop the instance of the server running
2) Stop the Docker container: ```docker compose down```

# For the Future

This is still a work-in-progress, but some things to add in the future:

* Add API services/endpoints for forms.
    * This would alow for better form validation checks/messages, without refreshing the page.
* Implement an advanced text-parser (or Markdown) for Descriptions and Reviews.
    * This would allow the User to format their longer strings into something more like an article and would help readability.
* Add "Plunge Reports" that detail a trip/adventure at a location.
    * Similar to "hiking reports" for hiking trails: not quite a Review, but a more personal experience with the area.
* User messaging
    * Have a question about someone's Plunge Site? Try asking them via a message.
* Add tidal data and visibility data using an external API like NOAA

# Lessons Learned

I learned how to implement the basics of a content security policy, how to protect against database injection attacks and cross-site scripting by sanitizing User inputs, and how to avoid other security vulnerabilities with my own tools (and not those provided by default with a framework like ASP.NET Core).

I learned how to manage uploading User files to an external vendor ([Cloudinary](https://cloudinary.com/)), put limits in place to prevent malicious abuse, and make resource retrieval more efficient.

I learned how to manage and protect API Keys for various environments (server-side vs client-side keys) and to be aware of what is shared with the client, since a browser keeps no secrets.

I learned how to use Docker to make development and testing easier and cleaner.

I learned that basic HTML, CSS, and JS can do quite a lot on their own without a library or framework such as React or Angular to help.

# Acknowledgements

I'd like to thank [Alvida Black and Scuba Mask Vectors by Vecteezy](https://www.vecteezy.com/free-vector/scuba-mask) for allowing me to use their icon.