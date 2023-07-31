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

// API URL for fetching recipe from TheCocktailDB
const API_URL = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=";

// Update the GET route to return an array of cocktails
// Update the GET route to return a random cocktail
// Update the GET route to return a random cocktail
app.get("/", async (req, res) => {
  try {
    const cocktailName = req.query.name; // Get the cocktail name from the query parameter
    if (!cocktailName) {
      // If no cocktail name is provided, render the "index.ejs" template with an error message
      return res.render("index.ejs", {
        error: "Please provide a cocktail name.",
      });
    }

    // Fetch a list of cocktails from the TheCocktailDB API using the provided cocktailName
    const response = await axios.get(API_URL + "search.php", {
      params: {
        s: cocktailName, // Add the cocktail name as a query parameter
      },
    });
    const cocktailData = response.data.drinks; // Use a descriptive variable name

    if (!cocktailData || cocktailData.length === 0) {
      // If no cocktails are found, render the "index.ejs" template with an error message
      return res.render("index.ejs", {
        error: "Sorry, No cocktail found. Please try again later.",
      });
    }

    // Render the "index.ejs" template with the cocktailData
    return res.render("index.ejs", { cocktails: cocktailData });
  } catch (error) {
    // Handle errors
    console.error("Error fetching cocktails:", error);
    return res.render("index.ejs", {
      error: "An error occurred while fetching cocktails. Please try again later.",
    });
  }
});

// Handle POST request on the root route ("/")
app.post("/", async (req, res) => {
  try {
    // Extract the selected category from the request body
    const searchQuery = req.body.searchQuery;

    // Update the API URL to include the selected category and the API key
    const API_URL_WITH_QUERY = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchQuery}`;

    // Fetch cocktail data from TheCocktailDB API based on the search query and API key
    const response = await axios.get(API_URL_WITH_QUERY);
    const drinks = response.data.drinks; // Access the drink data

    // Render the "index.ejs" template with the newly fetched cocktail data
    res.render("index.ejs", {
      data: drinks, // Sending the fetched cocktail data to the template
      error: null,
    });
  } catch (error) {
    // If an error occurs during the fetch, render the "index.ejs" template with an error message
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: "Failed to fetch cocktail data. Please try again later.",
      data: null,
    });
  }
});


// Start the server and listen on the specified port
app.listen(process.env.PORT ||port, () => {
  console.log(`App listening on port ${port}`);
  console.log(`App listening on port ${process.env.PORT}`);
});