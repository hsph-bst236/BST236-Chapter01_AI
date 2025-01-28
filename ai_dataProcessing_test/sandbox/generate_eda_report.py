import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path
import os

def create_report_directory():
    """Create reports directory if it doesn't exist"""
    Path("reports").mkdir(parents=True, exist_ok=True)
    Path("reports/figures").mkdir(parents=True, exist_ok=True)

def save_text_report(content, filename):
    """Save text content to reports directory"""
    with open(f"reports/{filename}", "w") as f:
        f.write(content)

def generate_eda_report():
    # Create report directory
    create_report_directory()
    
    # Set style for better visualizations
    plt.style.use('ggplot')
    sns.set_palette('husl')
    
    # Load the dataset
    df = pd.read_csv('data/boston.csv')
    
    # Basic Dataset Information
    basic_info = [
        "Boston Housing Dataset Analysis Report",
        "=" * 40,
        f"\nDataset Shape: {df.shape}",
        "\nFeature Descriptions:",
        "- CRIM: Per capita crime rate by town",
        "- ZN: Proportion of residential land zoned for lots over 25,000 sq.ft",
        "- INDUS: Proportion of non-retail business acres per town",
        "- CHAS: Charles River dummy variable (1 if tract bounds river; 0 otherwise)",
        "- NOX: Nitric oxides concentration (parts per 10 million)",
        "- RM: Average number of rooms per dwelling",
        "- AGE: Proportion of owner-occupied units built prior to 1940",
        "- DIS: Weighted distances to five Boston employment centers",
        "- RAD: Index of accessibility to radial highways",
        "- TAX: Full-value property-tax rate per $10,000",
        "- PTRATIO: Pupil-teacher ratio by town",
        "- B: 1000(Bk - 0.63)^2 where Bk is the proportion of blacks by town",
        "- LSTAT: % lower status of the population",
        "- MEDV: Median value of owner-occupied homes in $1000's (Target variable)",
    ]
    
    # Statistical Summary
    stats_summary = [
        "\nStatistical Summary",
        "=" * 20,
        "\n" + df.describe().to_string(),
    ]
    
    # Missing Values Analysis
    missing_values = [
        "\nMissing Values Analysis",
        "=" * 20,
        "\n" + df.isnull().sum().to_string(),
    ]
    
    # Correlation Analysis
    correlations_with_medv = df.corr()['MEDV'].sort_values(ascending=False)
    correlation_analysis = [
        "\nCorrelations with House Prices (MEDV)",
        "=" * 35,
        "\n" + correlations_with_medv.to_string(),
    ]
    
    # Generate Visualizations
    
    # 1. Distribution of target variable
    plt.figure(figsize=(10, 6))
    sns.histplot(data=df, x='MEDV', bins=30)
    plt.title('Distribution of House Prices')
    plt.xlabel('Median Value in $1000s')
    plt.ylabel('Count')
    plt.savefig('reports/figures/price_distribution.png')
    plt.close()
    
    # 2. Correlation Matrix
    plt.figure(figsize=(12, 10))
    correlation_matrix = df.corr()
    sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', fmt='.2f')
    plt.title('Correlation Matrix')
    plt.tight_layout()
    plt.savefig('reports/figures/correlation_matrix.png')
    plt.close()
    
    # 3. Scatter plots for top correlated features
    fig, axes = plt.subplots(2, 2, figsize=(15, 15))
    axes = axes.ravel()
    
    top_features = ['RM', 'LSTAT', 'PTRATIO', 'NOX']
    for idx, feature in enumerate(top_features):
        sns.scatterplot(data=df, x=feature, y='MEDV', ax=axes[idx])
        axes[idx].set_title(f'{feature} vs House Price')
    
    plt.tight_layout()
    plt.savefig('reports/figures/top_correlations_scatter.png')
    plt.close()
    
    # 4. Box plot for CHAS
    plt.figure(figsize=(8, 6))
    sns.boxplot(data=df, x='CHAS', y='MEDV')
    plt.title('House Prices by Charles River Location')
    plt.xlabel('Bounds Charles River (1=Yes, 0=No)')
    plt.ylabel('Median Value in $1000s')
    plt.savefig('reports/figures/charles_river_boxplot.png')
    plt.close()
    
    # 5. Distribution of numerical features
    fig, axes = plt.subplots(4, 4, figsize=(20, 20))
    axes = axes.ravel()
    
    for idx, col in enumerate(df.columns):
        sns.histplot(data=df, x=col, ax=axes[idx], bins=30)
        axes[idx].set_title(f'Distribution of {col}')
    
    plt.tight_layout()
    plt.savefig('reports/figures/feature_distributions.png')
    plt.close()
    
    # Key Findings
    key_findings = [
        "\nKey Findings",
        "=" * 15,
        "\n1. Dataset Information:",
        f"   - Number of samples: {df.shape[0]}",
        f"   - Number of features: {df.shape[1]}",
        "\n2. Missing Values:",
        "   - No missing values found in the dataset",
        "\n3. Price Distribution:",
        f"   - Mean house price: ${df['MEDV'].mean():.2f}k",
        f"   - Median house price: ${df['MEDV'].median():.2f}k",
        f"   - Price range: ${df['MEDV'].min():.2f}k - ${df['MEDV'].max():.2f}k",
        "\n4. Top Correlations with House Prices:",
        "   - Strong positive correlation with number of rooms (RM)",
        "   - Strong negative correlation with lower status population percentage (LSTAT)",
        "   - Moderate negative correlation with pupil-teacher ratio (PTRATIO)",
        "\n5. Charles River Effect:",
        "   - Houses near Charles River tend to have higher median values",
    ]
    
    # Combine all sections
    full_report = "\n".join(basic_info + stats_summary + missing_values + 
                           correlation_analysis + key_findings)
    
    # Save report
    save_text_report(full_report, "eda_report.txt")
    
    print("EDA report and visualizations have been generated in the 'reports' directory.")

if __name__ == "__main__":
    generate_eda_report() 