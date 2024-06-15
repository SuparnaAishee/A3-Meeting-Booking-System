## About
## Meeting Room Booking System for Co-working spaces
Starting with the backend, you've crafted schemas based on the following models:

User Model
Room Model
Slot
Booking Model
With these models in place, you empower both admins and users to interact seamlessly with the booking system:

Admin Actions: Administrators have the privilege of creating, updating, and deleting rooms. They can specify details like the room's name, room number, floor number, capacity, price per slot, and available amenities. Additionally, admins are responsible for creating time slots for each room. They set the date, start time, and end time for these slots, ensuring that users have a range of options to choose from. Through the web interface, admins can effortlessly manage the co-working space inventory and slot availability, ensuring accurate and up-to-date information for users.
User Interactions: On the user side, individuals can create bookings by selecting from the available time slots for their desired meeting times. They input the date and select specific slots for their sessions, along with their preferred room selection. The system automatically calculates the total amount based on the number of slots selected and the price per slot. Users receive real-time feedback on the availability of rooms and slots, ensuring smooth booking experiences without conflicts.

## Installation

To install and run the project locally, follow these steps:

### STEPS
1. **Clone the repository:**
git clone my repositry link

2. **Navigate to the project directory**
3. **Install dependencies:**
 <---Express , typescript , mongooes, nodemon---->
 4. **Build the TypeScript code:**
 5. **Start the development server:**

 The server will start running at localhost:3000. You can now access the API endpoints using tools like Postman.
 
### Scripts
**npm run start:dev to run the server**

**npm run lint to check error by eslint**

**npm run prettier:fix for fix the writing format**

**npm build for compile typescript**