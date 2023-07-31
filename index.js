// Import required modules
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

// Create an Express app
const app = express();
const port = 3000;

// Set up middleware
app.use(express.static("public")); // Serve static files from the "public" directory
app.use(bodyParser.urlencoded({ extended: true })); // Parse incoming URL-encoded data
app.set("view engine", "ejs"); // Set the view engine to EJS for rendering templates



// API URL for fetching jokes from JokeAPI
const API_URL = "www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita";

// Handle GET request on the root route ("/")
app.get("/", async (req, res) => {
  try {
    // Fetch a joke from the JokeAPI
    const response = await axios.get(API_URL);
    const result = response.data;
    console.log(result); // Log the fetched joke for debugging purposes

    // Render the "index.ejs" template with the fetched joke data
    res.render("index.ejs", { data: result });
  } catch (error) {
    // If an error occurs during the fetch, render the "index.ejs" template with an error message
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: error.message,
    });
  }
});

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });