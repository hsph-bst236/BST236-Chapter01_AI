library(shiny)
library(ggplot2)
library(dplyr)

# Load the dataset
penguins <- read.csv("penguins.csv")

# Define UI
ui <- fluidPage(
  titlePanel("Penguins Data Visualization"),
  sidebarLayout(
    sidebarPanel(
      selectInput("xvar", "X-axis variable", choices = names(penguins)[3:6]),
      selectInput("yvar", "Y-axis variable", choices = names(penguins)[3:6]),
      selectInput("colorvar", "Color by", choices = c("Species", "Island", "Sex"))
    ),
    mainPanel(
      plotOutput("scatterPlot")
    )
  )
)

# Define server logic
server <- function(input, output) {
  output$scatterPlot <- renderPlot({
    ggplot(penguins, aes_string(x = input$xvar, y = input$yvar, color = input$colorvar)) +
      geom_point() +
      theme_minimal() +
      labs(title = "Penguins Data Scatter Plot")
  })
}

# Run the application 
shinyApp(ui = ui, server = server)

# How to run:
# 1. Make sure you have R and the required packages (shiny, ggplot2, dplyr) installed.
# 2. Save this script as app.R.
# 3. Place the penguins.csv file in the same directory as app.R.
# 4. Open R or RStudio and set the working directory to the location of app.R.
# 5. Run the command: source('app.R')
# 6. The Shiny app will open in your default web browser.