import requests
import json

url = "http://127.0.0.1:8000/predict"
headers = {'Content-Type': 'application/json'}

valid_payload = {
    "Age": 37,
    "AnnualIncome": 57722.57,
    "NumberOfPurchases": 19,
    "TimeSpentOnWebsite": 5.9,
    "CustomerTenureYears": 1.09,
    "LastPurchaseDaysAgo": 11,
    "Gender": "Male",
    "ProductCategory": "Furniture",
    "PreferredDevice": "Desktop",
    "Region": "South",
    "ReferralSource": "Paid Ads",
    "CustomerSegment": "Regular",
    "LoyaltyProgram": 1,
    "DiscountsAvailed": 5,
    "SessionCount": 3,
    "CustomerSatisfaction": 2
}

def test_case(name, payload, expected_status):
    print(f"\n--- Testing: {name} ---")
    resp = requests.post(url, json=payload, headers=headers)
    print(f"Status Code: {resp.status_code}")
    print(f"Response: {resp.text}")
    if resp.status_code == expected_status:
        print("[PASS]")
    else:
        print(f"[FAIL] (Expected {expected_status})")

# 1. Valid Input
test_case("Valid Payload", valid_payload, 200)

# 2. Missing Value (Drop Age)
missing_payload = valid_payload.copy()
del missing_payload['Age']
test_case("Missing Value (Age)", missing_payload, 422)

# 3. Invalid Input (String for Age)
invalid_type_payload = valid_payload.copy()
invalid_type_payload['Age'] = "twenty"
test_case("Invalid Type (Age='twenty')", invalid_type_payload, 422)

# 4. Out of Bounds (Age < 18)
out_of_bounds_payload = valid_payload.copy()
out_of_bounds_payload['Age'] = 10
test_case("Out of Bounds (Age=10)", out_of_bounds_payload, 422)

# 5. Out of Bounds (CustomerSatisfaction > 5)
sat_payload = valid_payload.copy()
sat_payload['CustomerSatisfaction'] = 6
test_case("Out of Bounds (CustomerSatisfaction=6)", sat_payload, 422)

# 6. Negative values for inputs that should be >= 0
neg_payload = valid_payload.copy()
neg_payload['AnnualIncome'] = -100
test_case("Negative Value (AnnualIncome=-100)", neg_payload, 422)
