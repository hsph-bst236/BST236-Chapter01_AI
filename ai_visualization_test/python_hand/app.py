import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import numpy as np

# Set page config
st.set_page_config(layout="wide", page_title="Penguin Data Visualization")

# Load data
@st.cache_data
def load_data():
    df = pd.read_csv("penguins.csv")
    return df.dropna()

# Load the data
df = load_data()

# Sidebar
st.sidebar.title("Variables")

# Get numerical columns
numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()

# Variable selection
x_var = st.sidebar.selectbox("X Variable", numeric_cols, index=numeric_cols.index("Bill Length (mm)"))
y_var = st.sidebar.selectbox("Y Variable", numeric_cols, index=numeric_cols.index("Bill Depth (mm)"))

# Species selection
st.sidebar.title("Species Filter")
species_list = df["Species"].unique().tolist()
selected_species = []
for species in species_list:
    if st.sidebar.checkbox(species, value=True):
        selected_species.append(species)

# Filter data based on selection
filtered_df = df[df["Species"].isin(selected_species)]

# Create figure with secondary axes
fig = make_subplots(
    rows=2, cols=2,
    column_widths=[0.8, 0.2],
    row_heights=[0.2, 0.8],
    horizontal_spacing=0.05,
    vertical_spacing=0.05,
    specs=[[{"type": "histogram"}, {"type": "histogram"}],
           [{"type": "scatter"}, {"type": "histogram"}]]
)

# Add scatter plot
for species in selected_species:
    species_df = filtered_df[filtered_df["Species"] == species]
    fig.add_trace(
        go.Scatter(
            x=species_df[x_var],
            y=species_df[y_var],
            mode="markers",
            name=species,
            showlegend=True,
            hovertemplate=f"<b>{x_var}</b>: %{{x}}<br><b>{y_var}</b>: %{{y}}<br><b>Species</b>: {species}<extra></extra>"
        ),
        row=2, col=1
    )

# Add marginal distributions
# Top histogram (x-axis)
for species in selected_species:
    species_df = filtered_df[filtered_df["Species"] == species]
    fig.add_trace(
        go.Histogram(
            x=species_df[x_var],
            name=species,
            showlegend=False,
            marker_color=px.colors.qualitative.Set1[species_list.index(species)],
        ),
        row=1, col=1
    )

# Right histogram (y-axis)
for species in selected_species:
    species_df = filtered_df[filtered_df["Species"] == species]
    fig.add_trace(
        go.Histogram(
            y=species_df[y_var],
            name=species,
            showlegend=False,
            marker_color=px.colors.qualitative.Set1[species_list.index(species)],
        ),
        row=2, col=2
    )

# Update layout
fig.update_layout(
    title=f"Penguin Data: {x_var} vs {y_var}",
    height=800,
    bargap=0.1,
    showlegend=True,
    legend=dict(
        yanchor="top",
        y=0.99,
        xanchor="left",
        x=0.01
    )
)

# Update axes labels
fig.update_xaxes(title_text=x_var, row=2, col=1)
fig.update_yaxes(title_text=y_var, row=2, col=1)

# Show the plot
st.plotly_chart(fig, use_container_width=True) 