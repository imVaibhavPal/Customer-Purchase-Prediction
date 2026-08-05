import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

def main():
    print("Loading dataset...")
    # Load the dataset
    df = pd.read_csv('Dataset/customerData_500k.csv')
    
    # Define features and target
    X = df.drop(columns=['PurchaseStatus'])
    y = df['PurchaseStatus']
    
    # Define categorical and numerical columns
    categorical_cols = [
        'Gender', 'ProductCategory', 'PreferredDevice', 
        'Region', 'ReferralSource', 'CustomerSegment'
    ]
    numerical_cols = [
        'Age', 'AnnualIncome', 'NumberOfPurchases', 'TimeSpentOnWebsite',
        'CustomerTenureYears', 'LastPurchaseDaysAgo', 'DiscountsAvailed',
        'SessionCount', 'CustomerSatisfaction', 'LoyaltyProgram'
    ]
    
    # Create preprocessing steps
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numerical_cols),
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_cols)
        ]
    )
    
    # Create the pipeline with the model
    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        # Using n_estimators=20 and max_depth=15 to keep the model size small for cloud deployment
        ('classifier', RandomForestClassifier(n_estimators=20, max_depth=15, random_state=42, n_jobs=-1))
    ])
    
    # Train/Test Split (80/20)
    print("Splitting data into train and test sets...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20, random_state=42, stratify=y)
    
    # Train the pipeline
    print("Training the RandomForest pipeline...")
    pipeline.fit(X_train, y_train)
    
    # Make predictions
    print("Evaluating model...")
    y_pred = pipeline.predict(X_test)
    
    # Calculate metrics
    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred)
    rec = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    cm = confusion_matrix(y_test, y_pred)
    
    # Print metrics
    print("\n--- Model Evaluation Metrics ---")
    print(f"Accuracy:  {acc:.4f}")
    print(f"Precision: {prec:.4f}")
    print(f"Recall:    {rec:.4f}")
    print(f"F1 Score:  {f1:.4f}")
    print("\nConfusion Matrix:")
    print(cm)
    
    # Save the model
    model_path = 'model.pkl'
    joblib.dump(pipeline, model_path)
    print(f"\nModel successfully saved to {model_path}")

if __name__ == "__main__":
    main()
