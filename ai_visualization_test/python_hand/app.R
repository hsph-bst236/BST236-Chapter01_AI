library(shiny)
library(plotly)
library(dplyr)
library(tidyr)

# UI definition
ui <- fluidPage(
  titlePanel("Penguin Data Visualization"),
  
  sidebarLayout(
    sidebarPanel(
      # Variable selection
      selectInput("x_var", "X Variable",
                 choices = c("Bill Length (mm)", "Bill Depth (mm)", 
                           "Flipper Length (mm)", "Body Mass (g)"),
                 selected = "Bill Length (mm)"),
      
      selectInput("y_var", "Y Variable",
                 choices = c("Bill Length (mm)", "Bill Depth (mm)", 
                           "Flipper Length (mm)", "Body Mass (g)"),
                 selected = "Bill Depth (mm)"),
      
      # Species selection
      checkboxGroupInput("species", "Species Filter",
                        choices = c("Adelie", "Gentoo", "Chinstrap"),
                        selected = c("Adelie", "Gentoo", "Chinstrap"))
    ),
    
    mainPanel(
      plotlyOutput("scatter_plot", height = "800px")
    )
  )
)

# Server logic
server <- function(input, output) {
  # Load and process data
  penguins <- reactive({
    df <- read.csv("penguins.csv", check.names = FALSE)  # Prevent R from modifying column names
    df <- na.omit(df)
    df %>% filter(Species %in% input$species)
  })
  
  # Create the plot
  output$scatter_plot <- renderPlotly({
    req(input$x_var, input$y_var, input$species)
    
    # Create subplot layout
    fig <- plot_ly()
    
    # Color palette
    colors <- c('#e41a1c', '#377eb8', '#4daf4a')
    names(colors) <- c("Adelie", "Gentoo", "Chinstrap")
    
    # Get the data
    plot_data <- penguins()
    
    # Add scatter plot
    for (species in input$species) {
      species_data <- plot_data %>% filter(Species == species)
      
      fig <- fig %>% add_trace(
        data = species_data,
        x = species_data[[input$x_var]],  # Use [[ for column access
        y = species_data[[input$y_var]],  # Use [[ for column access
        type = 'scatter',
        mode = 'markers',
        name = species,
        marker = list(color = colors[species]),
        showlegend = TRUE,
        hovertemplate = paste0(
          "<b>", input$x_var, "</b>: %{x}<br>",
          "<b>", input$y_var, "</b>: %{y}<br>",
          "<b>Species</b>: ", species,
          "<extra></extra>"
        ),
        xaxis = "x",
        yaxis = "y"
      )
    }
    
    # Add marginal distributions
    for (species in input$species) {
      species_data <- plot_data %>% filter(Species == species)
      
      # Top histogram
      fig <- fig %>% add_trace(
        data = species_data,
        x = species_data[[input$x_var]],  # Use [[ for column access
        type = "histogram",
        name = species,
        marker = list(color = colors[species]),
        showlegend = FALSE,
        xaxis = "x2",
        yaxis = "y2"
      )
      
      # Right histogram
      fig <- fig %>% add_trace(
        data = species_data,
        y = species_data[[input$y_var]],  # Use [[ for column access
        type = "histogram",
        name = species,
        marker = list(color = colors[species]),
        showlegend = FALSE,
        xaxis = "x3",
        yaxis = "y3"
      )
    }
    
    # Update layout
    fig <- fig %>% layout(
      title = paste("Penguin Data:", input$x_var, "vs", input$y_var),
      xaxis = list(
        domain = c(0, 0.8),
        title = input$x_var
      ),
      yaxis = list(
        domain = c(0, 0.8),
        title = input$y_var
      ),
      xaxis2 = list(
        domain = c(0, 0.8),
        anchor = "y2"
      ),
      yaxis2 = list(
        domain = c(0.85, 1),
        anchor = "x2"
      ),
      xaxis3 = list(
        domain = c(0.85, 1),
        anchor = "y3"
      ),
      yaxis3 = list(
        domain = c(0, 0.8),
        anchor = "x3"
      ),
      showlegend = TRUE,
      legend = list(
        x = 0.01,
        y = 0.99,
        yanchor = "top",
        xanchor = "left"
      ),
      bargap = 0.1
    )
    
    fig
  })
}

# Run the app
shinyApp(ui = ui, server = server) 