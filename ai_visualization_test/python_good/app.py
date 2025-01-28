import dash
from dash import dcc, html
from dash.dependencies import Input, Output
import plotly.graph_objects as go
import plotly.express as px
import pandas as pd
import numpy as np
from plotly.subplots import make_subplots
from scipy.stats import gaussian_kde

# Read the data
df = pd.read_csv('penguins.csv')

# Create the Dash app
app = dash.Dash(__name__)

# Define the layout
app.layout = html.Div([
    # Left panel with controls
    html.Div([
        html.H4('X variable'),
        dcc.Dropdown(
            id='x-variable',
            options=[
                {'label': 'Bill Length (mm)', 'value': 'Bill Length (mm)'},
                {'label': 'Bill Depth (mm)', 'value': 'Bill Depth (mm)'},
                {'label': 'Flipper Length (mm)', 'value': 'Flipper Length (mm)'},
                {'label': 'Body Mass (g)', 'value': 'Body Mass (g)'}
            ],
            value='Bill Length (mm)'
        ),
        
        html.H4('Y variable', style={'marginTop': '20px'}),
        dcc.Dropdown(
            id='y-variable',
            options=[
                {'label': 'Bill Length (mm)', 'value': 'Bill Length (mm)'},
                {'label': 'Bill Depth (mm)', 'value': 'Bill Depth (mm)'},
                {'label': 'Flipper Length (mm)', 'value': 'Flipper Length (mm)'},
                {'label': 'Body Mass (g)', 'value': 'Body Mass (g)'}
            ],
            value='Bill Depth (mm)'
        ),
        
        html.H4('Filter by species', style={'marginTop': '20px'}),
        dcc.Checklist(
            id='species-filter',
            options=[
                {'label': ' Adelie', 'value': 'Adelie'},
                {'label': ' Gentoo', 'value': 'Gentoo'},
                {'label': ' Chinstrap', 'value': 'Chinstrap'}
            ],
            value=['Adelie', 'Gentoo', 'Chinstrap'],
            style={'lineHeight': '2'}
        ),
        
        html.Div([
            dcc.Checklist(
                id='show-options',
                options=[
                    {'label': ' Show species', 'value': 'show_species'},
                    {'label': ' Show marginal plots', 'value': 'show_marginal'}
                ],
                value=['show_species', 'show_marginal'],
                style={'lineHeight': '2'}
            ),
        ], style={'marginTop': '20px'})
    ], style={'width': '25%', 'float': 'left', 'padding': '20px', 'boxSizing': 'border-box'}),
    
    # Right panel with plot
    html.Div([
        dcc.Graph(id='scatter-plot', style={'height': '700px'})
    ], style={'width': '75%', 'float': 'right', 'padding': '20px', 'boxSizing': 'border-box'})
], style={'display': 'flex'})

def calculate_kde(data, grid_points=100):
    """Calculate kernel density estimation for the given data"""
    if len(data) < 2:
        return [], []
    
    kernel = gaussian_kde(data)
    min_val, max_val = np.min(data), np.max(data)
    grid = np.linspace(min_val, max_val, grid_points)
    density = kernel(grid)
    return grid, density

# Define callback to update the graph
@app.callback(
    Output('scatter-plot', 'figure'),
    [Input('x-variable', 'value'),
     Input('y-variable', 'value'),
     Input('species-filter', 'value'),
     Input('show-options', 'value')]
)
def update_graph(x_var, y_var, selected_species, show_options):
    # Filter data based on selected species
    filtered_df = df[df['Species'].isin(selected_species)]
    
    # Create figure with secondary y-axis
    fig = make_subplots(
        rows=2, cols=2,
        column_widths=[0.8, 0.2],
        row_heights=[0.2, 0.8],
        horizontal_spacing=0.05,
        vertical_spacing=0.05,
        specs=[[{"type": "scatter"}, {"type": "scatter"}],
               [{"type": "scatter"}, {"type": "scatter"}]]
    )
    
    # Add scatter plot
    colors = {'Adelie': '#FF9999', 'Gentoo': '#66B2FF', 'Chinstrap': '#99FF99'}
    
    for species in selected_species:
        species_df = filtered_df[filtered_df['Species'] == species]
        
        scatter = go.Scatter(
            x=species_df[x_var],
            y=species_df[y_var],
            mode='markers',
            name=species if 'show_species' in show_options else None,
            showlegend='show_species' in show_options,
            marker=dict(
                color=colors[species],
                size=8,
                opacity=0.6
            )
        )
        fig.add_trace(scatter, row=2, col=1)
    
    # Add marginal plots if enabled
    if 'show_marginal' in show_options:
        # Top density plot (x-axis)
        for species in selected_species:
            species_df = filtered_df[filtered_df['Species'] == species]
            x_data = species_df[x_var].dropna()
            if len(x_data) >= 2:
                x_grid, x_density = calculate_kde(x_data)
                fig.add_trace(
                    go.Scatter(
                        x=x_grid,
                        y=x_density,
                        fill='tozeroy',
                        name=species if 'show_species' in show_options else None,
                        showlegend=False,
                        line=dict(color=colors[species]),
                        opacity=0.6
                    ),
                    row=1, col=1
                )
        
        # Right density plot (y-axis)
        for species in selected_species:
            species_df = filtered_df[filtered_df['Species'] == species]
            y_data = species_df[y_var].dropna()
            if len(y_data) >= 2:
                y_grid, y_density = calculate_kde(y_data)
                fig.add_trace(
                    go.Scatter(
                        x=y_density,
                        y=y_grid,
                        fill='tozerox',
                        name=species if 'show_species' in show_options else None,
                        showlegend=False,
                        line=dict(color=colors[species]),
                        opacity=0.6
                    ),
                    row=2, col=2
                )
    
    # Update layout
    fig.update_layout(
        template='plotly_white',
        showlegend='show_species' in show_options,
        height=700,
        margin=dict(l=50, r=50, t=50, b=50),
        xaxis3=dict(
            title=x_var,
            showgrid=True,
            zeroline=False
        ),
        yaxis3=dict(
            title=y_var,
            showgrid=True,
            zeroline=False
        ),
        xaxis1=dict(showticklabels=False),
        yaxis1=dict(showticklabels=False),
        xaxis4=dict(showticklabels=False),
        yaxis4=dict(showticklabels=False)
    )
    
    # Add grid to main plot
    fig.update_xaxes(showgrid=True, gridwidth=1, gridcolor='rgba(128,128,128,0.2)', row=2, col=1)
    fig.update_yaxes(showgrid=True, gridwidth=1, gridcolor='rgba(128,128,128,0.2)', row=2, col=1)
    
    return fig

if __name__ == '__main__':
    app.run_server(debug=True) 