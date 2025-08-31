# Final Project

A full-stack web application where users can discover and create flea markets (“loppis”) nearby. The app allows people to browse events on a map, add their own flea markets with details and images, and interact with the community.

## The problem

We wanted to make it easier for people to find and share local flea markets in a simple and user-friendly way. To achieve this, we built a responsive web app with the following approach:  

- **Planning:** We started by breaking down the project into core features, user registration & login, map integration, creating new flea markets, and browsing events. We also created a design in figma and a flowchart.  

- **Frontend:** Built with React, Tailwind CSS, React Router, Zustand, and Leaflet for interactive maps. We also used libraries for e.g. keen-slider, react focus lock and then lucide for icons.     

- **Backend:** Node.js with Express, MongoDB (Atlas) for data storage, Nominatim API for Open Source Street Map and Cloudinary for image handling. Swagger/OpenAPI for API documentation. Also other libraries like multer to be able to handle formdata submittion with different file formats.  

- **Techniques:** We focused on reusable components, clean state management with hooks, and a mobile-first design.  

- **Next steps:** 
With more time, we would like to:  
- Allow users to upload a profile picture, edit contact information, and choose dark mode.  
- Automatically filter out flea markets with past dates.  
- Add more flexible scheduling options when creating an event, e.g. “every Sunday until further notice.”  
- Let users click “add to calendar” so their calendar app opens with the flea market details pre-filled.  
- Improve the user experience with more transitions and animations.  
- Implement a global error handler to manage larger issues such as network failures.  

# Credits

- [Bianca Van Dijk](https://pixabay.com/users/biancavandijk-9606149/) – images from Pixabay

## View it live

[Live demo on Netlify]
https://runthornet.netlify.app/


[Backend on Render]
https://runthornet-api.onrender.com/